export default (setup: string): any => {
  return {
    backend: {
      'DEV': 'https://dev.services.telemedicina.com',
      'STAGING': 'https://qa.services.telemedicina.com',
      'PROD': 'https://prod.services.telemedicina.com',
      'LOCAL': 'http://caprica.com:3000/api/v1'
    },
    frontend: {
      'DEV': `https://dev-${setup}.auth.telemedicina.com/`,
      'STAGING': `https://staging-${setup}.auth.telemedicina.com/`,
      'PROD': 'https://prod.services.telemedicina.com',
      'LOCAL': 'http://caprica.com:3000/api/v1'
    },
    CRYPTO_SEED: 'V-pQ%S+Pv8HE&8Ag',
  }
}