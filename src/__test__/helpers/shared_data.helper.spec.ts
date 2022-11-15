import { SharedData } from '../../helpers/shared_data.helper';

describe('shared data helper tests', () => {
    test('should generate an instance', () => {
        const result: SharedData = SharedData.getInstance();
        const expected = {
            environment: { frontend: '', backend: '' },
            tokens: { mit: '', accessToken: '', atrysFrontEnd: '' },
            patientId: '',
            patientUsername: '',
            patientPassword: '',
            appopintmentReservedId: '',
            integrationClientIdentificator: "",
            integrationExternalId: "",
            mode: '',
            setup: '',
            stage: '',
            errors: [],
            clinicId: '',
            locale: ''
        }
        expect(result).toEqual(expected)
    })

    test('should throw error', () => {
        const fnThrowErr = () => {
            return new SharedData()
        }
        expect(fnThrowErr).toThrowError(new Error('Error: Instantiation failed: Use SharedData.getInstance() instead of new.'))
    })
})
