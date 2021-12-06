import MIT from '../index'
import { HttpErrorNew } from '../handlers/base-error'
import { SharedData } from '../helpers/shared_data.helper'

describe('index tests', () => {
    const publicKey = ``
    const setup = process.env.setup || 'TEST'
    const mit = new MIT(setup, publicKey, 'SDK_PATIENT')
    let patientModel: any = {}
    let start: any
    let blocks: any
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    const clientPatientModel = {
        "from": "zurich",
        "payload": {
            "GeolocationData": {
                "Country": "AR",
                "State": "CAPITAL FEDERAL",
                "City": "CAPITAL FEDERAL",
                "Latitude": "-34.64424",
                "Longitude": "-58.55662",
                "Address": "Calle prueba 1234",
                "Extra": "Piso 6"
            },
            "BeneficiaryData": {
                "IdType": "DNI",
                "IdNumber": "33182287",
                "FirstName": "GONZALO EZEQUIEL",
                "LastName": "DAUD",
                "IntPhoneCode": "54",
                "PhoneNumber": "1161711401",
                "Email": "patient-sd2k@yopmail.com",
                "DateOfBirth": "1987-07-22",
                "Language": "ES"
            },
            "CaseData": {
                "CaseId": "1-C6A0OUU",
                "CaseNum": "1-26501013462"
            }
        }
    }

    it('should retrieve token not null', async () => {
        const token = await mit.session()
        expect(token).not.toBeNull()
    })

    it('should retrieve normalizeModel', async () => {
        const result = await mit.normalizeModel(clientPatientModel)
        patientModel = result.data
        expect(result.data).not.toBeNull()
    })

    it('should createPatient', async () => {
        const result = await mit.createPatient(patientModel)
        const expected = { message: 'password changed' }
        expect(result.data).not.toBeNull()
        expect(result.data).toEqual(expected)
    })

    it('should login', async () => {
        const result = await mit.login()
        expect(result.data).not.toBeNull()
    })

    it('should list professionals', async () => {
        const result = await mit.listProfessionals()
        expect(result.data).not.toBeNull()
    })

    it('should list blocks', async () => {
        const payload = {
            "date": {
                "month": month,
                "year": year,
                "day": day
            },
            "specialtyId": "6127a9acb09493c2e87d7801"
        }

        const result = await mit.listBlocks(payload)
        blocks = result.data.payload[0].blocks
        start = result.data.payload[0].blocks[0]
        expect(result.data).not.toBeNull()
    })

    it('should list specialties', async () => {
        const result = await mit.listSpecialties('5f35e707127b082ccd516c1b')
        expect(result.data).not.toBeNull()
    })


    it('should reserve sheduled appointment', async () => {
        const payload = { "professionalDetails": { "userId": "612ce4d96dc3c258b13d3907", "specialtyDetails": { "price": 0 }, "specialtyId": "6127a9acb09493c2e87d7801" }, "professionalId": "612ce4d96dc3c258b13d3907", "dateDetails": { "date": { "year": year, "month": month, "day": day }, "start": start }, "appointmentType": "agendamiento" }
        const result = await mit.reserveSheduledAppointment(payload)
        expect(result.data).not.toBeNull()
    })

    it('should consolidate sheduled appointment', async () => {
        const result = await mit.consolidateSheduledAppointment([])
        expect(result.data).not.toBeNull()
    })
    it('should retrieve magic link', () => {
        const result = mit.magicLink()
        expect(result).not.toBeNull()
    })

    it('should reserve immediate appointment', async () => {
        const dt = new Date()
        const d = dt.getDate()
        const tempNumber = Math.floor(Math.random() * 100 * d)
        const newClientPatientModel = { ...clientPatientModel }
        newClientPatientModel.payload.BeneficiaryData.Email = `patient-sdk${tempNumber}@yopmail.com`
        const algo = await mit.normalizeModel(clientPatientModel)
        await mit.createPatient(algo.data)
        await mit.login()
        const result = await mit.reserveInmediateAppointment()
        expect(result.data).not.toBeNull()
    })

    it('should consolidate immediate appoinment', async () => {
        const result = await mit.consolidateInmediateAppointment([])
        expect(result.data).not.toBeNull()
    })
})

describe('index test throw errors', () => {
    jest.setTimeout(100000)
    const publicKey = ``
    const setup = process.env.setup || 'TEST'
    const mit = new MIT(setup, publicKey, 'SDK_PATIENT')
    const patientModel: any = {}
    const dt = new Date()
    const month = dt.getMonth() + 1
    const day = dt.getDate()
    const year = dt.getFullYear()

    const clientPatientModel = {
        "from": "zurich",
        "payload": {
            "GeolocationData": {
                "Country": "AR",
                "State": "CAPITAL FEDERAL",
                "City": "CAPITAL FEDERAL",
                "Latitude": "-34.64424",
                "Longitude": "-58.55662",
                "Address": "Calle prueba 1234",
                "Extra": "Piso 6"
            },
            "BeneficiaryData": {
                "IdType": "DNI",
                "IdNumber": "33182287",
                "FirstName": "GONZALO EZEQUIEL",
                "LastName": "DAUD",
                "IntPhoneCode": "54",
                "PhoneNumber": "1161711401",
                "Email": "patient-sd2k@yopmail.com",
                "DateOfBirth": "1987-07-22",
                "Language": "ES"
            },
            "CaseData": {
                "CaseId": "1-C6A0OUU",
                "CaseNum": "1-26501013462"
            }
        }
    }

    const resetUserAndToken = async () => {
        await mit.session()
        const resultNormalizeModel = await mit.normalizeModel(clientPatientModel)
        await mit.createPatient(resultNormalizeModel.data)
        await mit.login()
    }

    it('should throw error when list blocks', async () => {
        const fnErr = async () => {
            const payload = {}
            await mit.listBlocks(payload)
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error list specialties', async () => {
        const fnErr = async () => {
            try {
                const wrongValue: any = null
                return await mit.listSpecialties(wrongValue)
            } catch (error) {
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should reserve sheduled appointment throw error', async () => {
        const payload = { "professionalDetails": { "userId": "612ce4d96dc3c258b13d3907", "specialtyDetails": { "price": 0 }, "specialtyId": "6127a9acb09493c2e87d7801" }, "professionalId": "612ce4d96dc3c258b13d3907", "dateDetails": { "date": { "year": year, "month": month, "day": day }, "start": "00:00" }, "appointmentType": "agendamiento" }
        const fnErr = async () => {
            await mit.reserveSheduledAppointment(payload)
        }

        await expect(fnErr).rejects.toThrow()
    })

    it('should consolidate sheduled appointment throw error', async () => {
        const fnThrowErr = async () => {
            try {
                await mit.consolidateSheduledAppointment([])
            } catch (error) {
                throw new HttpErrorNew(error)
            }
        }
        await expect(fnThrowErr).rejects.toThrow()
    })


    it('should throw error when reserve immediate appointment', async () => {
        const fnErr = async () => {
            try {
                const tempSharedData = SharedData.getInstance()
                tempSharedData.appopintmentReservedId = '0'
                await mit.reserveInmediateAppointment()
                await mit.consolidateInmediateAppointment([])
                await mit.reserveInmediateAppointment()
            } catch (error) {
                throw error
            }
        }

        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when consolidate immediate appointment with wrong appointmentReservedId', async () => {
        const fnErr = async () => {
            try {
                const tempSharedData = SharedData.getInstance()
                tempSharedData.appopintmentReservedId = '0'
                await mit.consolidateInmediateAppointment([])
            } catch (error) {
                throw error
            }
        }

        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when normalizeModel with wrong payload', async () => {
        const fnErr = async () => {
            await mit.normalizeModel([])
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when createPatient with wrong patientModel', async () => {
        const fnErr = async () => {
            try {
                const tempPatientModel: any = null
                await mit.createPatient(tempPatientModel)
            } catch (error) {
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when login with wrong credentials', async () => {
        const fnErr = async () => {
            try {
                await mit.session()
                await mit.normalizeModel(clientPatientModel)
                const tempPatientModel = { ...patientModel }
                tempPatientModel.password = 1
                await mit.createPatient(tempPatientModel)
                await mit.login()
            } catch (error) {
                await resetUserAndToken()
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })
})
