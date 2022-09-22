const endpoints = {
    appointments: {
        consolidate: '/appointments/action/create/consolidate',
        reserve: '/appointments/action/create/reserve',
        symptoms: '/common/symptoms'
    },
    integrations: {
        list: '/integrations/appointments/inmediate'
    },
    blocks: {
        query: '/blocks/query'
    },
    medicalSpecialties: {
        list: '/common/medical-specialties'
    },
    patient: {

    },
    professional: {
        listBySpecialtyId: "/professionals/list/specialty"
    },
    specialty: {
        listBySpecialtyId: '/administrative/list/specialties'
    },
    user: {

    },
    account: {
        register: '/account/register',
        changePasswordSdk: '/account/credentials/sdk'
    },
    availability: {
        objetives: '/objetives',
        path: '/availability',
    },
    diagnostics: {

    },
    access: {
        login: '/auth/login',
        integrations: '/auth/login/integrations',
        validate: '/auth/login/validate'
    },
    clinic: {
        get: '/clinics/sdk'
    },
    MIT_URL: 'https://mit.telemedicina.com',
    MIT_SESSION_SERVICE: 'https://api.mit.telemedicina.com/auth/session',
    MIT_RULE_ENGINE_SERVICE: 'https://api.mit.telemedicina.com/rules'
}

export default endpoints;