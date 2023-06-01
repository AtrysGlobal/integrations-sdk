# MIT SDK API V1 SPECS

---

## Integration Values

The following values are of utmost importance for the configuration of your MIT SDK client or the authentication of your API access credentials. For security reasons it is recommended that you keep these values secret.

> NOTE 1: These values will be also specified in the postman specification attached to this repository as:

- `mit-sdk-api-spec.postman_collection.json`
- `EXAMPLE_SDK_ENVIRONMENT.postman_environment.json`

---

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

## Step by Step Example

To get to the point of booking a consolidated medical appointment for a user of your system through the MIT API and Telemedicine API, you must go through a flow consisting of several steps. The following will describe what you need to do to get to this result.

To begin with you will need to negotiate your federated identity token (henceforth called _session token_) through the MIT API REST (Sessioner service). This token will allow you to authenticate to the _Multiclinic services_ and complete all the necessary steps to get to the desired result.

Since you already have the patient data, you will have to serialize your data in order to make them admissible by _Multiclinic services_ (Rule Engine).

The next steps consist of registering a new patient, initiating or validating the patient's session and requesting a medical appointment and consolidating it.

Finally, you will be able to generate a single-use SSO link to allow your users to log into multi clinica's systems and be seen by a healthcare professional through the scheduled medical appointment.

The following is a description of the process through a sequence diagram

!["Step by step sequence diagram"](../media/mit-sdk-api-sd-steps-workflow.png)

NOTE: You can refer to the attached [Postman collection](mit-sdk-step-by-step.postman_collection.json) for a step-by-step flow from patient creation to immediate appointment booking, including single SSO Link.

The following is a detailed description of what is required to complete each step.

**First step: Get Session Token**

The MIT server will ask you for a client identifier, a country setting and a public key and in return will provide you with an encrypted session token to access the Multiclinic API services.

**POST** `https://<API_MIT>/auth/session`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**

**Body**:

- publicKey: **[PUBLIC CLIENT KEY]**
- setup: **[CLIENT SETUP]**

**Example**:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-H "Setup: BR" \
-d '{"publicKey": "•••••••", "setup": "DEV"}' \
"https://<API_MIT>/auth/session"
```

---

**Second step: Serialize Patient Data (Rule Engine)**

Rule Engine will provide you with the service of standardizing your data to make it admissible in the API Multiclinic registration process.

**POST** `https://<MIT_API>/rules`

**Headers**:

- Authorization: **_[MIT ACCESS TOKEN]_**

**Body**:

- from: **_[CLIENT ID]_**
- payload: **_[CLIENT DOCUMENT DATA]_**
- setup: **_[RULE ENGINE SETUP IDENTIFIER]_**

**Example**:

```bash
curl -X POST \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data-raw '{
   "from":"<CLIENT_ID>",
   "payload":{
      "CaseData":{
         "CaseId":"1-XXXXXX",
         "CaseNum":"1-XXXXXXXXXX"
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
         "DateOfBirth":"1987-07-22",
         "Email":"patient-sd222k@yopmail.com",
         "Language":"ES",
         "IntPhoneCode":"54",
         "IdNumber":"33182287",
         "FirstName":"PEDRO ESCALONA",
         "PhoneNumber":"1161711401",
         "LastName":"DAUD",
         "IdType":"DNI"
      }
   },
   "setup":"INT-BR"
}'
"https://<MIT_API>/rules"
```

---

**Third Step: Register a Patient**

Once you have the user data ready to be admitted by Multiclinic API you can register a new patient user in the system. It will be necessary to have complementary data and a token signed by MIT to perform this operation.

**NOTE:** You must use the clinic identifier with which you have authenticated at MIT.
**NOTE:** The externalId property is obtained once the patient data serialization process (Rule Engine) has been completed.

**POST** `https://<MULTICLINIC_API>/account/register`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**
- Authorization: **_[MIT_ACCESS_TOKEN]_**

**Body**:

- clinicId: **_[AUTHENTICATED_CLINIC_ID]_**
- identificationData: **_[PATIENT_IDENTIFICATION_DATA_OBJECT]_**
- personalData: **_[PATIENT_PERSONAL_DATA_OBJECT]_**
- addressData: **_[PATIENT_ADDRESS_DATA_OBJECT]_**
- externalId: **_[ENTITY_EXTERNAL_ID]_**
- newUserFromSDK: **_[NEW_USER_FROM_SDK]_**

**Example**:

```bash
curl -X POST \
-H "Setup: BR" \
-H "locale: pt_BR" \
-H "Atrys-Product: SDK" \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data-raw '{
    "clinicId": "xxxxxxxxxxxxxxxx",
    "identificationData": {
        "cpf": "XXXXXX",
        "passport": "XXXXXXX",
        "isForeign": false
    },
    "personalData": {
        "name": "HUMBERTO CAMACHO",
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
    "externalId": "XXXXXXXXX",
    "newUserFromSDK": true
}'
"https://<MULTICLINIC_API>/account/register"
```

---

**Fourth Step: Integration Patient Login**

You can authenticate on behalf of a specific user using a federated token. You must specify a clinic identifier and a user name. The username can be either an email or a CPF identifier.

The result of this operation will be a single-use login token, which will allow you to perform certain operations on behalf of the authenticated user.

**POST** `https://<MULTICLINIC_API>/integrations/auth/login`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**
- Authorization: **_[MIT_ACCESS_TOKEN]_**

**Body**:

- username: **_[PATIENT_USERNAME_REFERENCE]_**
- clinicId: **_[AUTHENTICATED_CLINIC_ID]_**

**Example**:

```bash
curl -X POST \
-H "Setup: BR" \
-H "locale: pt_BR" \
-H "Atrys-Product: SDK" \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data-raw '{
    "username": "patient@example.com",
    "clinicId": "xxxxxxxxxxxxxxx"
}'
"https://<MULTICLINIC_API>/integrations/auth/login"
```

---

**Fifth Step: Reserve Immediate Appointment**

Book a medical appointment for a patient. You must complete the process with the following step (consolidation).

NOTE: if you provide the _SCHEDULED_ value for the `appointmentType` property you must specify extra information in the request payload. For more information consult the resource specification in this document.

NOTE: you must request your integration identifiers to perform this operation.

**POST** `https://<MULTICLINIC_API>/appointments/action/create/reserve`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**
- Authorization: **_[MIT_ACCESS_TOKEN]_**

**Body**:

- patientDetails: **_[PATIENT_DETAILS_OBJECT]_**
- integrationClientIdentificator: **_[INTEGRATION_CLIENT_IDENTIFICATOR]_**
- integrationExternalId: **_[INTEGRATION_EXTERNAL_ID]_**
- appointmentType: **_[IMMEDIATE_OR_SCHEDULED]_**

**Example**:

```bash
curl -X POST \
-H "Setup: BR" \
-H "locale: pt_BR" \
-H "Atrys-Product: SDK" \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data '{
    "patientDetails": {
        "userId": "xxxxxxxxxxxxxxxxxxxxxx"
    },
    "integrationClientIdentificator": "xxxxxxxxx",
    "integrationExternalId": "xxxxxx",
    "appointmentType": "IMMEDIATE"
}'
"https://<MULTICLINIC_API>/appointments/action/create/reserve"
```

**Sixth Step: Consolidate Immediate Appointment**

Confirm the booking of a medical appointment for a patient.

**POST** `https://<MULTICLINIC_API>/appointments/action/create/consolidate`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**
- Authorization: **_[MIT_ACCESS_TOKEN]_**

**Body**:

- id: **_[RESERVED_APPOINTMENT_ID]_**
- patientDetails: **_[SYMPTOMS_AND_DESCRIPTION_OBJECT]_**

**Example**:

```bash
curl -X POST \
-H "Setup: BR" \
-H "locale: pt_BR" \
-H "Atrys-Product: SDK" \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data '{
    "patientDetails": {
        "symptoms": ["symptom_id_1","symptom_id_2"],
        "description": "Some description"
    },
    "id": "xxxxxxxxxxxxxxxxx"
}'
"https://<MULTICLINIC_API>/appointments/action/create/consolidate"
```

---

**Seventh Step: Generate a SSO Link**

Generate an SSO link so that the patient can access the telemedicine platform and view their active medical appointments.

**NOTE**: Username parameter takes both email and CPF identifier values.

**NOTE**: ReservedAppointmentId parameter is optional.

**POST** `https://<MULTICLINIC_API>/integrations/sso`

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**
- Authorization: **_[MIT_ACCESS_TOKEN]_**

**Body**:

- username: **_[RESERVED_APPOINTMENT_ID]_**
- reservedAppointmentId: **_[RESERVED_APPOINTMENT_ID]_**
- clinicId: **_[CLINIC_ID_TO_AUTHENTICATE]_**

**Example**:

```bash
curl -X POST \
-H "Setup: BR" \
-H "locale: pt_BR" \
-H "Atrys-Product: SDK" \
-H "Authorization: Bearer <ACCESS_TOKEN>" \
-H "Content-Type: application/json" \
--data '{
    "username": "xxxxxxxxxxxxxxxxx",
    "reservedAppointmentId": "xxxxxxxxxxxxxxxxx",
    "clinicId": "xxxxxxxxxxxxxxxxx",
}'
"https://<MULTICLINIC_API>/integrations/sso"
```

---

## Endpoints Specs

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
    "clinicId": "xxxxxxxxxxxxxxxxxx",
    "identificationData": {
        "cpf": "xxxxxxxxx",
        "passport": "33182287",
        "isForeign": false
    },
    "personalData": {
        "name": "GONZALO EZEQUIEL",
        "lastName": "DAUD",
        "secondLastName": "",
        "motherName": "",
        "phoneNumber": "1161711401",
        "email": "patient@example.com",
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
    "externalId": "XXXXXXXX",
    "newUserFromSDK": true
}'
```

---

### Patient Login

**POST** `https://<API>.telemedicina.com/integrations/auth/login`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "username": "username",
  "clinicId": "clinicId"
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/integrations/auth/login' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "username": "patient@example.com",
    "clinicId": "xxxxxxxxxxxxx"
}'
```

---

### Validate Patient Login

**POST** `https://<API>.telemedicina.com/auth/login/validate`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "loginToken": "loginToken"
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/integration/auth/login' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "loginToken": "eyJhbGciOiJIUzI1NiCJ9.eyJpZCI6IjY0JSHJlZmMwMWQ2ODRkMDNhMjgwMyIsImNyZWFSO12WRBdCI6IjIwMjMtMDQtMjhUMTg6NDM6NTMuNzgyWiIsImlhdCI6MTY4MjcwNXQzMywiZXhwIjoxNjgyNzA3NjEzfQ.D90k_8AcpstCxpiVisYVa6qG8bskk"
}'
```

---

### Patient Login (For dependent)

**POST** `https://<API>.telemedicina.com/auth/login/dependent`

**Authorization**: Bearer Token

**Headers**:

- Setup: **_[COUNTRY_CODE]_**
- locale: **_[LOCALE_CODE]_**
- Atrys-Product: **_[ATRYS_PRODUCT]_**

**Body**:

```json
{
  "titularAccessToken": "jwtAccessToken",
  "userId": "patientUserId",
  "clinicId": "clinicId"
}
```

**Example**:

```bash
curl --location 'https://<API>.telemedicina.com/auth/login/dependent' \
--header 'Setup: BR' \
--header 'locale: pt_BR' \
--header 'Atrys-Product: SDK' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data-raw '{
    "titularAccessToken": "eyJhbGciOiJIUziIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR09OWkFMTyBSX2VRVUlFTCAiLCJzdWIiOiI2NDRiZWZjMDFkNjg0ZDAwMDgzYTI4MDMiLCJhZG1pbmlzdHJhdGl2ZURhdGEiOnsiY2xpbmljSWQiOiI1ZjIzNmZjOTY2ZmJiMDA1NDg5NGI3wNSjZlYThmYWE4NzNiY2M4ODllZWMiLyb2xlIjoicGF0aWVudCIsInRpbWV6b25lIjoiQW1lcmljYS9TYW50aWFnbyIsImNsaW5pY1Byb2ZpbGVJZCI6IjY0NGJlZmMwMWQ2ODRDDkMDAwODNhMjgwNCJ9LCJpYXQiOjE2ODI3MDU3MTQsImV4cCI6MTY4MjcwOTMxNH0.myJPxauVyTD39-_U6hGZqCEnkYTysnhbwvegY",
    "userId": "xxxxxxxxxxxxxxxx",
    "clinicId": "xxxxxxxxxxxxxxxx"
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
  "reservedAppointmentId": "reservedAppointmentId"
}
```

**Example**:

```bash
curl --location 'https://<API_MIT>.telemedicina.com/availability/636d772c4eec8d000810690f/state' \
--header 'Authorization: Bearer <ACCESS_TOKEN>' \
--data '{
  "username": "username",
  "reservedAppointmentId": "reservedAppointmentId"
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
    "clinicId": "xxxxxxxxxxxxx",
    "identificationData": {
        "cpf": "xxxxxxxxx",
        "passport": "xxxxxxxx",
        "isForeign": false
    },
    "personalData": {
        "name": "HUMBERTO CAMACHO",
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
    "externalId": "XXXXXXXXX",
    "newUserFromSDK": true
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
    "symptoms": [],
    "description": "I'm not feeling good"
  }
}
```

> NOTE: Symptoms should be specified as an array of identifiers. The identifiers of the symptoms already registered in the system can be obtained in _List Symptoms Section_.

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
        "symptoms": ["638a603db19dd76b1c9d01f0", "638a603db19dd76b1c9d01f1", "638a603db19dd76b1c9d01f3"],
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
    "symptoms": [],
    "description": "I'm not feeling good"
  }
}
```

> NOTE: Symptoms should be specified as an array of identifiers. The identifiers of the symptoms already registered in the system can be obtained in _List Symptoms Section_.

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
        "symptoms": ["638a603db19dd76b1c9d01f0", "638a603db19dd76b1c9d01f1", "638a603db19dd76b1c9d01f3"],
        "description": "I'\''m not feeling good"
    }
}'
```

---
