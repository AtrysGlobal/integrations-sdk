const config: any = {
  backend: {
    'INT-BR': 'https://b1qa.atrys-brasil.telemedicina.com/api/v1',
    'INT-ES': 'https://b1qa.atrys-espana.telemedicina.com/api/v1',
    'INT-CO': 'https://b1qa.atrys-colombia.telemedicina.com/api/v1',
    'INT-CL': 'https://b1qa.atrys-chile.telemedicina.com/api/v1',
    'PROD-BR': 'https://b1.atrys-brasil.telemedicina.com/api/v1',
    'PROD-ES': 'https://b1.atrys-espana.telemedicina.com/api/v1',
    'PROD-CO': 'https://b1.atrys-colombia.telemedicina.com/api/v1',
    'PROD-CL': 'https://b1.atrys-chile.telemedicina.com/api/v1',
    'LOCAL': 'http://caprica.com:3000/api/v1',
    'TEST': 'https://backend.mit.telemedicina.com/api/v1',
  },
  frontend: {
    'INT-BR': 'https://www.qa.atrys-brasil.telemedicina.com/',
    'INT-ES': 'https://www.qa.atrys-espana.telemedicina.com/',
    'INT-CO': 'https://www.qa.atrys-colombia.telemedicina.com/',
    'INT-CL': 'https://www.qa.atrys-chile.telemedicina.com/',
    'PROD-BR': 'https://www.atrys-brasil.telemedicina.com/',
    'PROD-ES': 'https://www.atrys-espana.telemedicina.com/',
    'PROD-CO': 'https://www.atrys-colombia.telemedicina.com/',
    'PROD-CL': 'https://www.atrys-chile.telemedicina.com/',
    'LOCAL': 'http://caprica.com',
    'TEST': 'https://mit.telemedicina.com',
  },
  MIT_URL: 'https://mit.telemedicina.com',
  MIT_SESSION_SERVICE: 'https://api.mit.telemedicina.com/auth/session',
  MIT_RULE_ENGINE_SERVICE: 'https://api.mit.telemedicina.com/rules'
};

export default config;