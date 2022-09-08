const endpoints = {
    appointments: {
        consolidate: '/appointments/action/create/consolidate',
        reserve: '/appointments/action/create/reserve'
    },
    integrations: {
        list: '/integrations/appointments/inmediate'
    },
    blocks: {
        query: '/blocks/query'
    },
    medicalSpecialties: {
        list: '/medical-specialties'
    },
    patient: {

    },
    professional: {

    },
    specialty: {
        list: '/list/specialties'
    },
    user: {

    },
    account: {
        register: '/account/register',
        changePasswordSdk: '/account/credentials/sdk'
    },
    availability: {

    },
    symptoms: {

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