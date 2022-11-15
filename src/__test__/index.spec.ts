import MIT from '../index'
import { AppointmentType } from '../enum/appointment.enum';
import { HttpErrorNew } from '../handlers/base-error'
import { SharedData } from '../helpers/shared_data.helper'

describe('index tests', () => {
    const publicKey = '-----BEGIN RSA PUBLIC KEY-----MIIBCgKCAQEAhQ6LOrh7aR0Ayj5qTCDQ4G4KdONIj4JVQ7/b8uPDXC8o7EPc1wE77cu6hvLT4jfoEI0jmZJ3st7M9ioGj3idSBFDrIIL3vk6TNcHDoqokozWf7VoqlTY/Ex+SViL0pHhZwofLECawEHnjjfRRg03+QBPs1MZdgAOp4o/UMygkIiEaK0q5Nqy1z1BJdvmEdKxqTeoJ/5zyq8udL+KnrA60c0nT6YYb2ifugzoC35Z2Vdqcyk3YK6ilGpTIUtK9FRgniI8UiNdQqhWk11rsZwS30a9EA0oKM7ZUYaPe/rhwaIAEZMUTL8aqHgrcp6f6LKLwP7k8b8PBszldNlzj9R5bQIDAQAB-----END RSA PUBLIC KEY-----'
    const stage = process.env.stage || 'DEV'
    const setup = process.env.setup || 'ES'
    const clinicId = process.env.clinicId || '5f236fc966fbb0054894b780'
    const sdkMode = 'SDK_ADMIN'

    const config = new MIT.Configuration(stage, setup, clinicId, sdkMode, 'es_ES')
    const credentials = new MIT.Credentials(publicKey)
    const mit = new MIT.SDK(config, credentials)

    let patientModel: any = {}
    let start: any
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    const integrationClientIdentificator = 'zurich';
    mit.sharedData.integrationClientIdentificator = integrationClientIdentificator

    const clientPatientModel = {
        "from": integrationClientIdentificator,
        "payload": {
            "GeolocationData": {
                "Country": "AR",
                "State": "Buenos Aires",
                "City": "DHJ",
                "Latitude": "-34.5618913",
                "Longitude": "-58.4617484",
                "Address": "Test 123",
                "Extra": ""
            },
            "BeneficiaryData": {
                "IdType": "DNI",
                "IdNumber": "198298827",
                "FirstName": "José",
                "LastName": "Abarca",
                "IntPhoneCode": "54",
                "PhoneNumber": "12345678",
                "Email": "mock_user_1@yopmail.com",
                "DateOfBirth": "2001-01-01",
                "Language": "ES"
            },
            "CaseData": {
                "CaseId": "OIO-998493",
                "CaseNum": "UA-99883235-OK87"
            }
        }
    }

    it('should retrieve token not null', async () => {
        const token = await mit.common.session()
        expect(token).not.toBeNull()
    })

    it('should retrieve normalizeModel', async () => {
        const result = await mit.common.normalize(clientPatientModel)
        patientModel = result.data
        expect(result.data).not.toBeNull()
    })

    it('should createPatient', async () => {
        const result = await mit.patient.create(patientModel)
        const expected = { message: 'Usuario creado' }
        expect(result.data).not.toBeNull()
        // expect(result.data).toEqual(expected)
        // expect(result.data).toContain(expected)
    })

    it('should login', async () => {
        const result = await mit.patient.login()
        expect(result.data).not.toBeNull()
    })

    it('should list professionals', async () => {
        const result = await mit.professionals.list()
        expect(result.data).not.toBeNull()
    })

    it('should list blocks', async () => {
        const payload = {
            "date": {
                "month": month,
                "year": year,
                "day": day
            },
            "specialtyId": "6213e196c2a6c02a6ac792b1"
        }

        const result = await mit.professionals.blocks(payload)
        start = result.data.payload[0].blocks[0]

        console.log('------------ TOKEN ---------------')
        console.log(result)
        console.log('------------ TOKEN ---------------')

        expect(result.data).not.toBeNull()
    })

    it('should list specialties', async () => {
        const result = await mit.specialty.byId('5f35e707127b082ccd516c1b')
        expect(result.data).not.toBeNull()
    })

    it('should reserve sheduled appointment', async () => {

        const dateBlock = {
            "month": month,
            "year": year,
            "day": day
        }

        const blocks = await mit.professionals.blocks({
            date: dateBlock,
            specailtyId: "6213e196c2a6c02a6ac792b1"
        })

        const dateDetails = {
            date: dateBlock,
            start: "12:00"
        }

        const professionalDetails = {
            specialtyId: "6213e196c2a6c02a6ac792b1",
            userId: "6217765f76f0e0556808c454"
        }

        // const professionalDetails = { "professionalDetails": { "userId": "612ce4d96dc3c258b13d3907", "specialtyDetails": { "price": 0 }, "specialtyId": "6213e196c2a6c02a6ac792b1" }, "professionalId": "612ce4d96dc3c258b13d3907", "dateDetails": { "date": { "year": year, "month": month, "day": day }, "start": start }, "appointmentType": "agendamiento" }
        const result = await mit.appointment.reserve(AppointmentType.SCHEDULED, dateDetails, professionalDetails)
        expect(result.data).not.toBeNull()
    })

    it('should consolidate sheduled appointment', async () => {
        const result = await mit.appointment.consolidate([])
        expect(result.data).not.toBeNull()
    })
    it('should retrieve magic link', () => {
        const result = mit.common.ssoLink()
        expect(result).not.toBeNull()
    })

    it('should reserve immediate appointment', async () => {
        const dt = new Date()
        const d = dt.getDate()
        const tempNumber = Math.floor(Math.random() * 100 * d)
        const newClientPatientModel = { ...clientPatientModel }
        newClientPatientModel.payload.BeneficiaryData.Email = `patient-sdk${tempNumber}@yopmail.com`
        const algo = await mit.common.normalize(clientPatientModel)
        await mit.patient.create(algo.data)
        await mit.patient.login()
        const result = await mit.appointment.reserve(AppointmentType.IMMEDIATE)
        expect(result.data).not.toBeNull()
    })

    it('should consolidate immediate appoinment', async () => {
        const result = await mit.appointment.consolidate([])
        expect(result.data).not.toBeNull()
    })

    it('should get the appointment id with an external id', async () => {

        const result = await mit.appointment.byExternalId()
        const expected = {
            "administrativeDetails": {
                "integrationClientIdentificator": "zurich",
                "integrationExternalId": "1-C6A0OUU"
            },
            "appointmentId": "61a220d019cbda0cd7a58804"
        }
        expect(result).toEqual(expected)
    });

})

describe('index test throw errors', () => {
    jest.setTimeout(100000)
    const publicKey = ``
    const stage = process.env.stage || 'DEV'
    const setup = process.env.setup || 'ES'
    const clinicId = process.env.clinicId || '5f236fc966fbb0054894b780'
    const sdkMode = 'SDK_ADMIN'

    const config = new MIT.Configuration(stage, setup, clinicId, sdkMode, 'es_CL')
    const credentials = new MIT.Credentials(publicKey)
    const mit = new MIT.SDK(config, credentials)

    const patientModel: any = {}
    const dt = new Date()
    const month = dt.getMonth() + 1
    const day = dt.getDate()
    const year = dt.getFullYear()

    // const clientPatientModel = {
    //     "from": "zurich",
    //     "payload": {
    //         "GeolocationData": {
    //             "Country": "AR",
    //             "State": "CAPITAL FEDERAL",
    //             "City": "CAPITAL FEDERAL",
    //             "Latitude": "-34.64424",
    //             "Longitude": "-58.55662",
    //             "Address": "Calle prueba 1234",
    //             "Extra": "Piso 6"
    //         },
    //         "BeneficiaryData": {
    //             "IdType": "DNI",
    //             "IdNumber": "33182287",
    //             "FirstName": "GONZALO EZEQUIEL",
    //             "LastName": "DAUD",
    //             "IntPhoneCode": "54",
    //             "PhoneNumber": "1161711401",
    //             "Email": "patient-sd2k@yopmail.com",
    //             "DateOfBirth": "1987-07-22",
    //             "Language": "ES"
    //         },
    //         "CaseData": {
    //             "CaseId": "1-C6A0OUU",
    //             "CaseNum": "1-26501013462"
    //         }
    //     }
    // }

    const integrationClientIdentificator = 'zurich';
    mit.sharedData.integrationClientIdentificator = integrationClientIdentificator

    const clientPatientModel = {
        "from": integrationClientIdentificator,
        "payload": {
            "GeolocationData": {
                "Country": "AR",
                "State": "Buenos Aires",
                "City": "DHJ",
                "Latitude": "-34.5618913",
                "Longitude": "-58.4617484",
                "Address": "Test 123",
                "Extra": ""
            },
            "BeneficiaryData": {
                "IdType": "DNI",
                "IdNumber": "198298827",
                "FirstName": "José",
                "LastName": "Abarca",
                "IntPhoneCode": "54",
                "PhoneNumber": "12345678",
                "Email": "jose.abc@yopmail.com",
                "DateOfBirth": "2001-01-01",
                "Language": "ES"
            },
            "CaseData": {
                "CaseId": "OIO-998493",
                "CaseNum": "UA-99883235-OK87"
            }
        }
    }

    const resetUserAndToken = async () => {
        await mit.common.session()
        const resultNormalizeModel = await mit.common.normalize(clientPatientModel)
        await mit.patient.create(resultNormalizeModel.data)
        await mit.patient.login()
    }

    it('should throw error when list blocks', async () => {
        const fnErr = async () => {
            const payload = {}
            await mit.professionals.blocks(payload)
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error list specialties', async () => {
        const fnErr = async () => {
            try {
                const wrongValue: any = null
                return await mit.specialty.list()
            } catch (error) {
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should reserve sheduled appointment throw error', async () => {
        const dateDetails = {
            "date": {
                "month": month,
                "year": year,
                "day": day
            },
            "specialtyId": "6127a9acb09493c2e87d7801"
        }
        const professionalDetails = { "professionalDetails": { "userId": "612ce4d96dc3c258b13d3907-xxx", "specialtyDetails": { "price": 0 }, "specialtyId": "6127a9acb09493c2e87d7801" }, "professionalId": "612ce4d96dc3c258b13d3907", "dateDetails": { "date": { "year": year, "month": month, "day": day }, "start": "00:00" }, "appointmentType": "agendamiento" }
        const fnErr = async () => {
            await mit.appointment.reserve(AppointmentType.SCHEDULED, dateDetails, professionalDetails)
        }

        await expect(fnErr).rejects.toThrow()
    })

    it('should consolidate sheduled appointment throw error', async () => {
        const fnThrowErr = async () => {
            try {
                await mit.appointment.consolidate([])
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
                await mit.appointment.reserve(AppointmentType.IMMEDIATE)
                await mit.appointment.consolidate([])
                await mit.appointment.reserve(AppointmentType.IMMEDIATE)
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
                await mit.appointment.consolidate([])
            } catch (error) {
                throw error
            }
        }

        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when normalizeModel with wrong payload', async () => {
        const fnErr = async () => {
            await mit.common.normalize([])
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when createPatient with wrong patientModel', async () => {
        const fnErr = async () => {
            try {
                const tempPatientModel: any = null
                await mit.patient.create(tempPatientModel)
            } catch (error) {
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw error when login with wrong credentials', async () => {
        const fnErr = async () => {
            try {
                await mit.common.session()
                await mit.common.normalize(clientPatientModel)
                const tempPatientModel = { ...patientModel }
                tempPatientModel.password = 1
                await mit.patient.create(tempPatientModel)
                await mit.patient.login()
            } catch (error) {
                await resetUserAndToken()
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    })

    it('should throw an error when trying to get the appointment id with an external id', async () => {
        const fnErr = async () => {
            try {
                const tempSharedData = SharedData.getInstance()
                tempSharedData.integrationExternalId = ''
                await mit.appointment.byExternalId()
            } catch (error) {
                throw error
            }
        }
        await expect(fnErr).rejects.toThrow()
    });
})
