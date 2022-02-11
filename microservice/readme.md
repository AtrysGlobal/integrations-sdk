# Atrys Microservice boilerplate for integrations

This micro service consumes the Atrys SDK for integrations.

## Prerequisites

The Atrys SDK must be a dependency of node_modules, so you need to install this package:
#### https://www.npmjs.com/package/@atrysglobal/mit-sdk

To make it a dependency in our package.json, use the following command

```
npm i -S @atrysglobal/mit-sdk
```

The public key delivered by Atrys must be configured in the following file, following this example:

```
// file path: src/utils/config.js
...

const publicKey = `-----BEGIN RSA PRIVATE KEY----- XXXXXX -----END RSA PRIVATE KEY-----`

...
```

In the environment variables you must indicate the setup and the service port

Example:

```
PORT=3030
SETUP=TEST
```

## Run 
To run the project, the following command must be executed:

```bash
npm run dev
```

## Usage
There are two ways of scheduling a medical appointment, so to access these, some steps must first be carried out first.

- Get session

```
GET localhost:3030/session
```

- Normalize patient model 

```
POST localhost:3030/normalize
body: {
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
```

- Create patient or change password if the patient already exists in the Atrys environment.

```
POST localhost:3030/patient/create
body: {
    "clinicId": "5f236fc966fbb0054894b780",
    "identificationData": {
        "isForeign": false,
        "passport": "",
        "dni": "33182287"
    },
    "personalData": {
        "name": "GONZALO EZEQUIEL",
        "lastName": "DAUD",
        "secondLastName": "",
        "phoneNumber": "1161711401",
        "email": "patient-sd2k@yopmail.com",
        "breed": "5f430c1248530c1de30ffa68",
        "gender": "gender",
        "birthdate": "1987-07-22",
        "nacionality": "5fdd4956d1d8135520fbbeeb",
        "healthInsurance": "5fc5c15d99ccb04b708b1fc6"
    },
    "addressData": {
        "uf": "5f42ffca96f8abbeee6dd8b8",
        "city": "5f4300eb8f2acfcc1391b071",
        "neighborhood": "",
        "street": "",
        "complement": "",
        "streetNumber": "",
        "zipcode": ""
    },
    "password": "i0ZLbJ#lH",
    "gender": "male"
}
```

- Login

```
POST localhost:3030/login
```

### Schedule an immediate appointment
Once the previous steps have been carried out, to continue with the immediate scheduling, the following steps must be followed:


- Book immediate appointment

```
POST localhost:3030/appointment/immediate/reserve
```

- Consolidate immediate appointment

```
POST localhost:3030/appointment/immediate/consolidate
```

### Schedule appointment
Once the user is logged in, he must consume the following endpoints to schedule a medical appointment:

- List Professionals

```
GET localhost:3030/professional
```

- List Specialties

```
GET localhost:3030/specialty

params: {
    specialtyId: 5f35e707127b082ccd516c1b
}
```

- List blocks of availability of professionals

```
POST localhost:3030/block

body : {
    "date": {
        "month": 8,
        "year": 2021,
        "day": 30
    },
    "specialtyId": "6127a9acb09493c2e87d7801"
}
```

- Book scheduled appointment

```
POST localhost:3030/appointment/reserve
{
    "professionalDetails": {
        "userId": "612ce4d96dc3c258b13d3907",
        "specialtyDetails": {
            "price": 0
        },
        "specialtyId": "6127a9acb09493c2e87d7801"
    },
    "professionalId": "612ce4d96dc3c258b13d3907",
    "dateDetails": {
        "date": {
            "year": 2021,
            "month": 8,
            "day": 30
        },
        "start": "18:00"
    },
    "appointmentType": "agendamiento"
}
```

- Consolidate scheduled appointment

```
POST localhost:3030/appointment/consolidate
```
