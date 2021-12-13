# Atrys SDK for integrations

## Purpose

The purpose of this project is to deliver a tool to consume the resources present in the Atrys teleconsultation platform, exposing a series of methods to perform the necessary requests to backend.

## Patient model

At the moment of making an integration with the teleconsultation platform, the patient model with which you work must be clearly exposed, so that our rules engine can "translate" your model to ours, this process is one of the initial ones at the beginning of the commercial/technical relationship.

## CDN

This SDK has been published in the following link so that it is available for use (javascript in browser)

```
https://cdn.mit.telemedicina.com/atrys-sdk.js
```

### Javscript Basic Example

```
<script src="https://cdn.mit.telemedicina.com/atrys-sdk.js" type="module"></script>
<script type="module">

    try {
        const mit = new MIT('TEST', '');
    
        const integrationClientIdentificator = 'EXAMPLE';
        mit.sharedData.integrationClientIdentificator = integrationClientIdentificator

        console.log('MIT', mit);

        const session = await mit.session()
        console.log('SESSION', session);

        const req = await mit.normalizeModel({
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
                    "IdNumber": "34567899",
                    "FirstName": "Test Test",
                    "LastName": "Test Test",
                    "IntPhoneCode": "54",
                    "PhoneNumber": "12345678",
                    "Email": "a@b.com",
                    "DateOfBirth": "2001-01-01",
                    "Language": "ES"
                },
                "CaseData": {
                    "CaseId": "637741353756375358",
                    "CaseNum": "637741353756375358"
                }
            }
        })

        console.log('patient normalized', req.data);

        const newPatient = await mit.createPatient(req.data)
        console.log('patient created', newPatient.data);

        const login = await mit.login()
        console.log('login', login.data);

        const inmediate = await mit.reserveInmediateAppointment()
        console.log('inmediate reserve', inmediate.data);

        const consolidate = await mit.consolidateInmediateAppointment([])
        console.log('inmediate consolidate', consolidate.data);

        const appointmentPayload = await mit.getAppointmentIdByExternalId()
        console.log("Get appointment by caseId OK", appointmentPayload);

        const magicLink = mit.magicLink()
        console.log('maic link', magicLink);
    } catch (error) {
        console.log(error);
    }
    
</script>
```                


## NPM Module

The npm site of the module can be found [here](https://www.npmjs.com/package/@atrysglobal/mit-sdk)

```
npm i -S @atrysglobal/mit-sdk
```

## SharedData

This class is a singleton to set and get information necessary for the use of both private and public internal methods.

the public properties are:

```
public environment: Environment = {
	frontend: string,
	backend: string,
};

public tokens: SessionTokens = {
	mit: string,
	atrysBackend: string,
	atrysFrontEnd: string,
};

public patientId: string;
public patientUsername: string;
public patientPassword: string;
public appopintmentReservedId: string;
public mode: string;
public integrationClientIdentificator: string;
public integrationExternalId: string;
```

One of the necessary variables that the client must set is integrationClientIdentificator.

When the MIT main class is instantiated, this variable must be set

Example:

```
const integrationClientIdentificator = 'clientName';
mit.sharedData.integrationClientIdentificator = integrationClientIdentificator
``` 

# API

```
session(setup: string, publicKey: string): Promise<SessionInterface>;
```
> Create a new session in our session service ang get a MIT Token
>
>**@setup**: String identificator for country of origin. Ex: CO, ES, CL, BR. 
>
>For integration and development, the value must be **TEST**
>
>**@publicKey**: String of the public key for validate the origin of the request

```
normalizeModel(clientPatientModel: any): Promise<any>;
```
> Method for normalize the patient model for work with Atrys Backend
> 
>**@clientPatientModel**: Object with the patient data

## Client Integration Model
Note: The previously set integrationClientIdentificator variable must be used here.

```
    const clientPatientModel = {
        "from": integrationClientIdentificator,
        "payload": { ...the model patient used internally }
    }

```

Here is an **example** of a payload model for integration:

```
{
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
        "IdNumber": "34567899",
        "FirstName": "Test Test",
        "LastName": "Test Test",
        "IntPhoneCode": "54",
        "PhoneNumber": "12345678",
        "Email": "a@b.com",
        "DateOfBirth": "2001-01-01",
        "Language": "ES"
    },
    "CaseData": {
        "CaseId": "637741353756375358",
        "CaseNum": "637741353756375358"
    }
}
```

**Atrys Normalized Patient Model (normalizedPatientModel).**
Example: 

```
const normalizedPatientModel = await mit.normalizeModel(clientPatientModel)
```

The service returns internal model parsed for ready to use in Atrys backends.

```
{
    "clinicId": string",
    "identificationData": {
        "isForeign": boolean,
        "passport": string,
        "dni": string
    },
    "personalData": {
        "name": string,
        "lastName": string,
        "secondLastName": string,
        "phoneNumber": string,
        "email": string,
        "breed": string,
        "gender": string,
        "birthdate": string,
        "nacionality": string,
        "healthInsurance": string,
    },
    "addressData": {
        "uf": string,
        "city": string,
        "neighborhood": string,
        "street": string,
        "complement": string,
        "streetNumber": string,
        "zipcode": string,
    },
    "password": string,
    "externalId": string,
    "gender":string
}
```

```
createPatient(normalizedPatientModel: any): Promise<any>;
```
> Method for create a new patient in the Atrys Backend.
> 
>**@normalizedPatientModel**: Object with the patient data model normalized by our RuleEngine. Normalized model must look like Atrys patient model exposed below.

```
login(): Promise<any>;
```
>Login method for authenticate the user in Atrys Backend


```
listProfessionals(): Promise<any>;
```

>List all professional present in the selected backend by setup variable in session method.


```
listSpecialties(specialtyId: string): Promise<any>;
```
> Method for list the specialties derived by a main specialty id. Ex: In medicine have general, family, cardiology, etc
> 
>**@specialtyId**: id of the main medical specialty


```
listBlocks(queryBlock: any): Promise<any>;
```
> Method for list all available blocks for the selected professional.
> 
>**@queryBlock**:

```
{
	"date" {
		"month":8,
		"year":2021,
		"day":25
		},
	"specialtyId":"611d8635f2fbbcfe08c8f5b0"
}
```

```
reserveSheduledAppointment(reservePayload: any): Promise<any>;
```

> Method for reserve a new scheduled appointment.
> 
>**@reservePayload**:

```
{
	"appointmentType":"agendamiento",
	"professionalDetails"{
		"specialtyId":"611d8635f2fbbcfe08c8f5b0",
			"userId":"6126517f17148aa3c070ff4b",
			"specialtyDetails":{
				"price":0
				}
			},
		"dateDetails":{
			"date":{
				"month":8,
				"year":2021,
				"day":25
			},
		"start":"17:10"
	}
}
```


```
consolidateSheduledAppointment(symptoms: string[]): Promise<any>;
```

> Method for consolidate previous reserved appointment. 
>**@symptoms**: array of symptoms


```
reserveInmediateAppointment(): Promise<any>;
```

> Method for reserve a new inmediate appointment.


```
consolidateInmediateAppointment(symptoms: string[]): Promise<any>;
```

> Method for consolidate previous inmediate appointment.

```
magicLink(): string;
```

> Method for create the magic link for deliver to clients for passwordless login acces to Atrys platform.

```
getAppointmentIdByExternalId(): Promise<any>;
```

> Method that gets the id of an appointment by the external id of the patient. (or get appointment id by external integration id)


## Build

The project can be built to run as SDK in the browser or to be used in BackEnd in a nodejs microservice for example.

To build the SDK for the browser, after build the SDK is available in **dist** folder   

```
npm run build
```

To build the SDK for backend, after build the SDK is available in **lib** folder.   

```
npm run build-package
```