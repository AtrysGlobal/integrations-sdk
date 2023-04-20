# MIT SDK API V1 SPECS

---

## Integration Values

The following values are of utmost importance for the configuration of your MIT SDK client or the authentication of your API access credentials. For security reasons it is recommended that you keep these values secret.

> NOTE 1: These values will be also specified in the postman specification attached to this repository as mit-sdk-api-spec.postman_collection.json

- **Environment**: To be understood as the implementation stage. Separate your pre-production environments from your production environments.
- **MIT API**: API rest that will manage the negotiation of your access tokens as an integration client. You will need a public RSA key to complete your authentication process.
- **Telemedicine API**: API rest that will manage your medical appointment booking operations, patient management, availabilities, among others. You will need the access token from API MIT in order to authenticate your requests.
- **Country Code**: Keyword to specify a country setting with which you want to operate in Telemedicine API . (e.g: BR)
- **Locale Code**: keyword to specify a response language for Telemedicine API (e.g.: pt_BR)
- **Client Public ID**: Unique key word assigned to you as client.
- **Client Public Key**: RSA key assigned to you as client.
- **Access Token**: Session token that you will get from MIT API as MIT Client. This has a limited lifetime and you will need to renegotiate it.
- **Login Token**: Token assigned to a patient who has successfully authenticated through Api telemedicine. This token will allow him/her to execute different tasks under his/her identity
- **Atrys Product**: Product identifier for which you are consuming Atrys services (normally the value will be "SDK")
- **Clinic ID**: Identifier of the clinic with which you wish to perform operations through SDK client or API authentication.

## Response Specs

The structure for successful responses is as follows:

```typescript
export interface APIResponse {
  statusCode: number;
  internalCode?: number;
  message: string;
  payload: any;
}
```

> NOTE 1: The content of the payload property will vary depending on the resource you are requesting. The response of the various resources is detailed in the POSTMAN specification document.

The structure for failed responses is as follows:

```typescript
export interface APIResponse {
  statusCode: number;
  internalError?: any;
  error: string;
  payload: any;
}
```

## Endpoints Specs

---

### Consolidate Immediate Appointment

**POST** `https://<API_MIT>.telemedicina.com/auth/session`

**Body**:

```json
{
  "publicKey": "•••••••",
  "setup": "DEV",
  "clinicId": "clinicId"
}
```

**Example**:

```bash
curl --location 'https://<API_MIT>.telemedicina.com/auth/session' \
--data '{
    "publicKey": "•••••••",
    "setup": "DEV"
}'
```

**Expected Response**:

```json
{
  "token": "SECRET_TOKEN"
}
```

---

### List Professionals

**GET** `https://<API>.telemedicina.com/professionals/list`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**

```bash
curl --location 'https://<API>.telemedicina.com/professionals/list' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### List Professionals By SpecialtyId

**GET** `https://<API>.telemedicina.com/professionals/list/specialty/:SpecialtyId`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Path variables**:

- SpecialtyId: Uuid identifier of an active specialty.

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/professionals/list/specialty/6213e196c2a6c02a6ac792b1' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### Query Availabilities Blocks

**POST** `https://<API>.telemedicina.com/blocks/query`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "professionalId": "professionalId",
  "clinicId": "clinicId",
  "date": {
    "day": 28,
    "month": 4,
    "year": 2023
  }
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/blocks/query' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "professionalId": "62143e9076f0e0556808b2e7",
    "clinicId": "5f236fc966fbb0054894b780",
    "date": {
        "day": 19,
        "month": 4,
        "year": 2023
    }
}'
```

---

### List Blocked Days

**GET** `https://<API>.telemedicina.com/blocks/blocked-days`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/blocks/blocked-days' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### List Availabilities

**GET** `https://<API>.telemedicina.com/availability`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/availability' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### List Objectives

**GET** `https://<API>.telemedicina.com/objetives`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/objetives' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### Create Availability

**POST** `https://<API>.telemedicina.com/availability?professionalId=<ProfessionalId>`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Query Params**:

- ProfessionalId: Unique id for valid professional.

**Body**:

```json
{
  "administrativeDetails": {
    "objective": "objectiveId",
    "appointmentDuration": 5,
    "clinicId": "clinicId"
  },
  "professionalDetails": {
    "specialtyId": "specialtyId"
  },
  "dateDetails": {
    "startDate": {
      "year": "2023",
      "month": "04",
      "day": "20"
    },
    "endDate": {
      "year": "2023",
      "month": "04",
      "day": "21"
    },
    "days": ["domingo"],
    "dailyRanges": [
      {
        "start": "0:00",
        "end": "23:59"
      }
    ]
  }
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/availability?professionalId=62143e9076f0e0556808b2e7' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "administrativeDetails": {
        "objective": "6213e19cc2a6c02a6ac79328",
        "appointmentDuration": 5,
        "clinicId": "5f236fc966fbb0054894b780"
    },
    "professionalDetails": {
        "specialtyId": "6213e196c2a6c02a6ac792ad"
    },
    "dateDetails": {
        "startDate": {
            "year": "2023",
            "month": "04",
            "day": "20"
        },
        "endDate": {
            "year": "2023",
            "month": "04",
            "day": "21"
        },
        "days": [
            "domingo"
        ],
        "dailyRanges": [
            {
                "start": "0:00",
                "end": "23:59"
            }
        ]
    }
}'
```

---

### Update Availability

**POST** `https://<API>.telemedicina.com/availability/:AvailabilityId?professionalId=<ProfessionalId>`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Query Params**:

- ProfessionalId: Unique id for valid professional.

**Path Params**:

- AvailabilityId: Unique id for valid availability.

**Body**:

```json
{
  "administrativeDetails": {
    "objective": "objectiveId",
    "appointmentDuration": 5,
    "clinicId": "clinicId"
  },
  "professionalDetails": {
    "specialtyId": "specialtyId"
  },
  "dateDetails": {
    "startDate": {
      "year": "2023",
      "month": "04",
      "day": "20"
    },
    "endDate": {
      "year": "2023",
      "month": "04",
      "day": "21"
    },
    "days": ["domingo"],
    "dailyRanges": [
      {
        "start": "0:00",
        "end": "23:59"
      }
    ]
  }
}
```

**Example**:

```bash
curl --location --request PUT 'https://<API>.telemedicina.com/availability/64416a28559d3e0008cec33f?professionalId=62143e9076f0e0556808b2e7' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "administrativeDetails": {
        "objective": "6213e19cc2a6c02a6ac79328",
        "appointmentDuration": 5,
        "clinicId": "5f236fc966fbb0054894b780"
    },
    "professionalDetails": {
        "specialtyId": "6213e196c2a6c02a6ac792ad"
    },
    "dateDetails": {
        "startDate": {
            "year": "2023",
            "month": "04",
            "day": "20"
        },
        "endDate": {
            "year": "2023",
            "month": "04",
            "day": "21"
        },
        "days": [
            "domingo"
        ],
        "dailyRanges": [
            {
                "start": "10:00",
                "end": "18:59"
            }
        ]
    }
}'
```

---

### Update Availability State

**PUT** `https://<API>.telemedicina.com/availability/:AvailabilityId/state`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Path Params**:

- AvailabilityId: Unique id for valid availability.

**Body**:

```json
{
  "isActive": false
}
```

**Example**:

```bash
curl --location --request PUT 'https://<API>.telemedicina.com/availability/636d772c4eec8d000810690f/state' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "isActive": true
}'
```

---

### Normalize Patient (Rule Engine)

**POST** `https://<API_MIT>.telemedicina.com/rules`

**Authorization**: Bearer Token

**Example**:

```bash
curl --location 'https://<API_MIT>.telemedicina.com/rules' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
   "from":"<CLIENT_ID>",
   "payload":{
      "CaseData":{
         "CaseId":"1-C6A0OUU",
         "CaseNum":"1-26501013462"
      },
      "GeolocationData":{
         "Address":"Calle prueba 1234",
         "Extra":"Piso 6",
         "State":"CAPITAL FEDERAL",
         "Country":"AR",
         "Latitude":"-34.64424",
         "City":"CAPITAL FEDERAL",
         "Longitude":"-58.55662"
      },
      "BeneficiaryData":{
         "DateOfBirth":"987-07-22",
         "Email":"patient-sd222k@yopmail.com",
         "Language":"ES",
         "IntPhoneCode":"54",
         "IdNumber":"33182287",
         "FirstName":"GONZALO EZEQUIEL",
         "PhoneNumber":"1161711401",
         "LastName":"DAUD",
         "IdType":"DNI"
      }
   },
   "setup":"INT-BR"
}'
```

---

### Generate SSO Magic Link

**POST** `https://<API_MIT>.telemedicina.com/tools/sso`

**Authorization**: Bearer Token

**Body**:

```json
{
  "username": "username",
  "password": "password",
  "reservedAppointmentId": "reservedAppointmentId"
}
```

**Example**:

```bash
curl --location 'https://<API_MIT>.telemedicina.com/availability/636d772c4eec8d000810690f/state' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
  "username": "username",
  "password": "password",
  "reservedAppointmentId": "reservedAppointmentId"
}'
```

---

### Patient Login

**POST** `https://<API>.telemedicina.com/auth/login`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "username": "username",
  "password": "password",
  "clinicId": "clinicId"
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/auth/login' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "username": "patient-sd2@yopmail.com",
    "password": "qeH)ss2XD",
    "clinicId": "5f236fc966fbb0054894b780"
}'
```

---

### Register Patient

**POST** `https://<API>.telemedicina.com/account/register`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "clinicId": "clinicId",
  "identificationData": {
    "cpf": "cpf",
    "passport": "33182287",
    "isForeign": false
  },
  "personalData": {
    "name": "GONZALO EZEQUIEL",
    "lastName": "DAUD",
    "secondLastName": "",
    "motherName": "",
    "phoneNumber": "1161711401",
    "email": "patient-sd2@yopmail.com",
    "breed": "5f430c1248530c1de30ffa68",
    "gender": "male",
    "birthdate": "1987-07-22",
    "nacionality": "5fdd4956d1d8135520fbbeeb"
  },
  "addressData": {
    "cep": "",
    "uf": "5f42ffcae6d4f516ed6dd8bf",
    "city": "5f4300ebac8998f49d91b078",
    "neighborhood": "",
    "street": "Calle prueba 1234",
    "streetNumber": 0
  },
  "password": "qeH)fpassword",
  "externalId": "externalId",
  "newUserFromSDK": true
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/account/register' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "clinicId": "5f236fc966fbb0054894b780",
    "identificationData": {
        "cpf": "33182287",
        "passport": "33182287",
        "isForeign": false
    },
    "personalData": {
        "name": "GONZALO EZEQUIEL",
        "lastName": "DAUD",
        "secondLastName": "",
        "motherName": "",
        "phoneNumber": "1161711401",
        "email": "patient-sd2@yopmail.com",
        "breed": "5f430c1248530c1de30ffa68",
        "gender": "male",
        "birthdate": "1987-07-22",
        "nacionality": "5fdd4956d1d8135520fbbeeb"
    },
    "addressData": {
        "cep": "",
        "uf": "5f42ffcae6d4f516ed6dd8bf",
        "city": "5f4300ebac8998f49d91b078",
        "neighborhood": "",
        "street": "Calle prueba 1234",
        "streetNumber": 0
    },
    "password": "qeH)fpassword",
    "externalId": "1-C6A0OOOM",
    "newUserFromSDK": true
}'
```

---

### Update Patient

**PUT** `https://<API>.telemedicina.com/patient/:UserId`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Path Params**:

- UserId: Unique user identifier associated with the patient

**Body**:

```json
{
  "clinicId": "clinicId",
  "identificationData": {
    "cpf": "cpf",
    "passport": "33182287",
    "isForeign": false
  },
  "personalData": {
    "name": "GONZALO EZEQUIEL",
    "lastName": "DAUD",
    "secondLastName": "",
    "motherName": "",
    "phoneNumber": "1161711401",
    "email": "patient-sd2@yopmail.com",
    "breed": "5f430c1248530c1de30ffa68",
    "gender": "male",
    "birthdate": "1987-07-22",
    "nacionality": "5fdd4956d1d8135520fbbeeb"
  },
  "addressData": {
    "cep": "",
    "uf": "5f42ffcae6d4f516ed6dd8bf",
    "city": "5f4300ebac8998f49d91b078",
    "neighborhood": "",
    "street": "Calle prueba 1234",
    "streetNumber": 0
  },
  "password": "password",
  "externalId": "externalId",
  "newUserFromSDK": true
}
```

**Example**:

```bash
curl --location --request PUT 'https://<API>.telemedicina.com/patient/643f20115ff08d000804c2f2' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "clinicId": "5f236fc966fbb0054894b780",
    "identificationData": {
        "cpf": "33182287",
        "passport": "33182287",
        "isForeign": false
    },
    "personalData": {
        "name": "GONZALO EZEQUIEL",
        "lastName": "DAUD",
        "secondLastName": "",
        "motherName": "",
        "phoneNumber": "1161711401",
        "email": "patient-sd222k@yopmail.com",
        "breed": "5f430c1248530c1de30ffa68",
        "gender": "male",
        "birthdate": "987-07-22",
        "nacionality": "5fdd4956d1d8135520fbbeeb"
    },
    "addressData": {
        "cep": "",
        "uf": "5f42ffcae6d4f516ed6dd8bf",
        "city": "5f4300ebac8998f49d91b078",
        "neighborhood": "",
        "street": "Calle prueba 1234",
        "streetNumber": 0
    },
    "password": "qeH)fpassword",
    "externalId": "1-C6A0OOOM",
    "newUserFromSDK": true
}'
```

---

### Change Password SDK

**PUT** `https://<API>.telemedicina.com/account/credentials/sdk`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "email": "patient-sd2@yopmail.com",
  "password": "qeH)fpassword"
}
```

**Example**:

```bash
curl --location --request PUT 'https://<API>.telemedicina.com/account/credentials/sdk' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "email": "patient-sd2@yopmail.com",
    "password": "qeH)fpassword"
}'
```

---

### List Medical Specialties

**GET** `https://<API>.telemedicina.com/common/medical-specialties`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/common/medical-specialties' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### List Specialties By Medical Specialties

**GET** `https://<API>.telemedicina.com/administrative/list/specialties/:MedicalSpecialtyId`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Path Params**:

- MedicalSpecialtyId: Unique identifier of active medical specialty

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/administrative/list/specialties/5f35e707127b082ccd516c1b' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### List Symptoms

**GET** `https://<API>.telemedicina.com/common/symptoms`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/common/symptoms' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### Homologate External Appointment Id

**GET** `https://<API>.telemedicina.com/integrations/appointments/inmediate/:ExternalId`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Path Params**:

- ExternalId: External identifier of existing appointment

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/integrations/appointments/inmediate/1-C6A0OUU' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>'
```

---

### Reserve Scheduled Appointment

**POST** `https://<API>.telemedicina.com/appointments/action/create/reserve`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "patientDetails": {
    "userId": "userId"
  },
  "professionalDetails": {
    "userId": "professionalUserId",
    "specialtyId": "specialtyId"
  },
  "dateDetails": {
    "date": {
      "year": 2023,
      "month": 4,
      "day": 28
    },
    "start": "12:10"
  },
  "appointmentType": "SCHEDULED"
}
```

**Example**:

```bash
curl --location 'https://develop.dservices.telemedicina.com/appointments/action/create/reserve' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "patientDetails": {
        "userId": "64414a4778894d00082ec9e6"
    },
    "professionalDetails":{
        "userId": "6217758f76f0e0556808c435",
        "specialtyId": "6213e196c2a6c02a6ac792b1"
    },
    "dateDetails":{
        "date": {
            "year": 2023,
            "month": 4,
            "day": 20
        },
        "start": "12:10"
    },
    "appointmentType": "SCHEDULED"
}'
```

---

### Consolidate Scheduled Appointment

**POST** `https://<API>.telemedicina.com/appointments/action/create/consolidate`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "id": "appointmentId",
  "patientDetails": {
    "symptoms": ["Headache", "Stomachache", "Fever"],
    "description": "I'm not feeling good"
  }
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/appointments/action/create/consolidate' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "id": "644163531c9e000008e80f90",
    "patientDetails": {
        "symptoms": ["Headache", "Stomachache", "Fever"],
        "description": "I'\''m not feeling good"
    }
}'
```

---

### Reserve Immediate Appointment

**POST** `https://<API>.telemedicina.com/appointments/action/create/reserve`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "patientDetails": {
    "userId": "userId"
  },
  "appointmentType": "IMMEDIATE"
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/appointments/action/create/reserve' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "patientDetails": {
        "userId": "64414a4778894d00082ec9e6"
    },
    "appointmentType": "IMMEDIATE"
}'
```

---

### Consolidate Immediate Appointment

**POST** `https://<API>.telemedicina.com/appointments/action/create/consolidate`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "id": "appointmentId",
  "patientDetails": {
    "symptoms": ["Headache", "Stomachache", "Fever"],
    "description": "I'm not feeling good"
  }
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/appointments/action/create/consolidate' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
    "id": "644163531c9e000008e80f90",
    "patientDetails": {
        "symptoms": ["Headache", "Stomachache", "Fever"],
        "description": "I'\''m not feeling good"
    }
}'
```
