export const VERSION_PORTAL = 'Versión 2026.06.21-10:10';
export const EMPRESA_PORTAL = '© / 2026';
export const VERSION_WEB = 'V10.0-12';

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};

/*--------------------------------------

PORTAL-DENTAL-QAS
ng build --prod --optimization --build-optimizer --aot --base-href /es/ --deploy-url /es/ --i18n-locale=es --output-path=dist/ROOT
ng build --prod --optimization --build-optimizer --aot --base-href /es/ --deploy-url /es/ --i18n-locale=es --output-path=dist/ROOT/es

Angular 20
ng build --configuration=production --base-href=/ --deploy-url=/ --output-path=dist/ROOT

--------------------------------------*/

var urlPro = 'https://crm-familiasunidasla.com/pe_crm_api/';
var urlQas = 'http://ec2-54-215-12-132.us-west-1.compute.amazonaws.com:8080/pe_crm_api/';
var urlLocal = 'http://localhost:18080/pe_crm_api/';

var pro = false;
var qas = false;

let documentBsaeUriWithoutLanguage = document.baseURI
    .replace("/es/", "")
    .replace("/en/", "");

var API_F = '';
if(pro){
    API_F = urlPro;
}else{
    API_F = qas ? urlQas : urlLocal;
}
export const API_URL = API_F;

//console.log('API_URL '+API_URL);

export const ADMINISTRATOR = '1';
export const MASTER = '2';
export const VENDOR = '3';
export const BACKOFFICE = '4';
export const INTERVIEWER = '5';
export const VOC = '6';
export const TEMPLATE_CREATOR = '7';
export const INTERVIEWER_SCALES = '8';
export const GHOSTWRITING = '9';
export const THERAPIST = '10';
export const CLINICIAN = '11';
export const MARKETING = '12';
export const MARKETING_REV = '13';
export const DIG_MAR_MAN = '14';

export const US_STATES = [
  {
    name: "Alabama",
    abbreviation: "AL"
  },
  {
    name: "Alaska",
    abbreviation: "AK"
  },
  {
    name: "American Samoa",
    abbreviation: "AS"
  },
  {
    name: "Arizona",
    abbreviation: "AZ"
  },
  {
    name: "Arkansas",
    abbreviation: "AR"
  },
  {
    name: "California",
    abbreviation: "CA"
  },
  {
    name: "Colorado",
    abbreviation: "CO"
  },
  {
    name: "Connecticut",
    abbreviation: "CT"
  },
  {
    name: "Delaware",
    abbreviation: "DE"
  },
  {
    name: "District Of Columbia",
    abbreviation: "DC"
  },
  {
    name: "Federated States Of Micronesia",
    abbreviation: "FM"
  },
  {
    name: "Florida",
    abbreviation: "FL"
  },
  {
    name: "Georgia",
    abbreviation: "GA"
  },
  {
    name: "Guam",
    abbreviation: "GU"
  },
  {
    name: "Hawaii",
    abbreviation: "HI"
  },
  {
    name: "Idaho",
    abbreviation: "ID"
  },
  {
    name: "Illinois",
    abbreviation: "IL"
  },
  {
    name: "Indiana",
    abbreviation: "IN"
  },
  {
    name: "Iowa",
    abbreviation: "IA"
  },
  {
    name: "Kansas",
    abbreviation: "KS"
  },
  {
    name: "Kentucky",
    abbreviation: "KY"
  },
  {
    name: "Louisiana",
    abbreviation: "LA"
  },
  {
    name: "Maine",
    abbreviation: "ME"
  },
  {
    name: "Marshall Islands",
    abbreviation: "MH"
  },
  {
    name: "Maryland",
    abbreviation: "MD"
  },
  {
    name: "Massachusetts",
    abbreviation: "MA"
  },
  {
    name: "Michigan",
    abbreviation: "MI"
  },
  {
    name: "Minnesota",
    abbreviation: "MN"
  },
  {
    name: "Mississippi",
    abbreviation: "MS"
  },
  {
    name: "Missouri",
    abbreviation: "MO"
  },
  {
    name: "Montana",
    abbreviation: "MT"
  },
  {
    name: "Nebraska",
    abbreviation: "NE"
  },
  {
    name: "Nevada",
    abbreviation: "NV"
  },
  {
    name: "New Hampshire",
    abbreviation: "NH"
  },
  {
    name: "New Jersey",
    abbreviation: "NJ"
  },
  {
    name: "New Mexico",
    abbreviation: "NM"
  },
  {
    name: "New York",
    abbreviation: "NY"
  },
  {
    name: "North Carolina",
    abbreviation: "NC"
  },
  {
    name: "North Dakota",
    abbreviation: "ND"
  },
  {
    name: "Northern Mariana Islands",
    abbreviation: "MP"
  },
  {
    name: "Ohio",
    abbreviation: "OH"
  },
  {
    name: "Oklahoma",
    abbreviation: "OK"
  },
  {
    name: "Oregon",
    abbreviation: "OR"
  },
  {
    name: "Palau",
    abbreviation: "PW"
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA"
  },
  {
    name: "Puerto Rico",
    abbreviation: "PR"
  },
  {
    name: "Rhode Island",
    abbreviation: "RI"
  },
  {
    name: "South Carolina",
    abbreviation: "SC"
  },
  {
    name: "South Dakota",
    abbreviation: "SD"
  },
  {
    name: "Tennessee",
    abbreviation: "TN"
  },
  {
    name: "Texas",
    abbreviation: "TX"
  },
  {
    name: "Utah",
    abbreviation: "UT"
  },
  {
    name: "Vermont",
    abbreviation: "VT"
  },
  {
    name: "Virgin Islands",
    abbreviation: "VI"
  },
  {
    name: "Virginia",
    abbreviation: "VA"
  },
  {
    name: "Washington",
    abbreviation: "WA"
  },
  {
    name: "West Virginia",
    abbreviation: "WV"
  },
  {
    name: "Wisconsin",
    abbreviation: "WI"
  },
  {
    name: "Wyoming",
    abbreviation: "WY"
  }
];

export const ARR_LANGUAJES = [
  {
    name: "English"
  },
  {
    name: "Spanish"
  }
];

export const ARR_TYPESOFINTERVIEW = [
  {
    name: "Phone Call"
  },
  {
    name: "Zoom Video Call"
  },
  {
    name: "In Person"
  }
];

export const ARR_REFERRALSORUCE = [
  {
    name: "Google"
  },
  {
    name: "Facebook"
  },
  {
    name: "Direct referral from other client"
  },
  {
    name: "Lawyer"
  }
];




//EstatusSolicitud
/*
# id_estatus_solicitud, descripcion
'1', 'Received'
'2', 'Reviewing'
'3', 'Interview'
'4', 'Refused'
'5', 'No show'
'6', 'In case'
'7', 'Lost'
'8', 'Won'
'9', 'Open'
'10', 'Ready on draft'
'11', 'Closed'
'12', 'VOC'
'13', 'In approval'
'14', 'Open'   <-- Estatus Open para VOC
*/