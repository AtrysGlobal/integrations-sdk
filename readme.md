# Atrys SDK for integrations

## Purpose
***
The purpose of this project is to deliver a tool to consume the resources present in the Atrys teleconsultation platform, exposing a series of methods to perform the necessary requests to backend.

## Patient model
***
At the moment of making an integration with the teleconsultation platform, the patient model with which you work must be clearly exposed, so that our rules engine can "translate" your model to ours, this process is one of the initial ones at the beginning of the commercial/technical relationship.

## CDN
***
This sdk has been published in the following link so that it is available for use
https://cdn.mit.telemedicina.com/atrys-sdk.js

## SharedData
***
There is an object called SharedData which contains information necessary for the use of both private and public internal methods.

One of the necessary variables that the client must set is integrationClientIdentificator.

When the MIT main class is instantiated, this variable must be set

Example:
```
const integrationClientIdentificator = 'clientName';
mit.sharedData.integrationClientIdentificator = integrationClientIdentificator
``` 

## API
***
```
session(setup: string, publicKey: string): Promise<SessionInterface>;
```
> Create a new session in our session service ang get a MIT Token
>
>**@setup**: String identificator for country of origin. Ex: CO, ES, CL, BR.  
>**@publicKey**: String of the public key for validate the origin of the request


```
normalizeModel(clientPatientModel: any): Promise<any>;
```
> Method for normalize the patient model for work with Atrys Backend
> 
>**@clientPatientModel**: Object with the patient data

**Client Patient Model.**

Note: The previously set integrationClientIdentificator variable must be used here.

```
    {
        "from": integrationClientIdentificator,
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

**Atrys Normalized Patient Model (normalizedPatientModel).**
Example: const normalizedPatientModel = await mit.normalizeModel(clientPatientModel)

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
> 
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
> Method for create the magic link for deliver to clients for no login acces to Atrys platform.
```
getAppointmentIdByExternalId(): Promise<any>;
```
> Method that gets the id of an appointment by the external id of the patient.


## Build
***

The project can be built to run as SDK in the browser or to be used in BackEnd in a nodejs microservice for example.

To build the SDK for the browser, after build the SDK is available in **dist** folder   

```
npm run build
```

To build the SDK for backend, after build the SDK is available in **lib** folder.   

```
npm run build-package
```