import { LitElement, html } from 'lit-element';
import {Layouts,Alignment} from 'lit-flexbox-literals';         /// SOPORTE PARA FLEXBOX LAYOUTS
import {css} from 'lit-element';

import {Button} from "@material/mwc-button"


class PatientResume extends LitElement{

  constructor() {
    // Always call super() first
    super();
    // Initialize properties
    console.log(this.patient);
    this.givenName=this.patient.name.given;
    this.firstSurname=this.patient.name.family;
    this.secondSurname=this.patient.name.suffix;
    this.prefixName=this.patient.name.prefix;
    this.mainId=this.patient.id;

    this.addEventListener('load-complete', async (e) => {
      this.givenName=e.detail.data.name[0].given;
      this.firstSurname=e.detail.data.name[0].family;
      this.secondSurname=e.detail.data.name[0].suffix;
      this.prefixName=e.detail.data.name[0].prefix;
      this.mainId=e.detail.data.id;
      this.patient=e.detail.data;
       await this.requestUpdate();
    });

  }

  static get styles() {
      return [Layouts,Alignment,
      css`.light {
        --mdc-theme-on-primary: black;
        --mdc-theme-primary: #00867d;
        --mdc-theme-on-secondary: black;
        --mdc-theme-secondary: white;
      }`];
  }
  static get properties(){
    return {
      /// RENDERED INFO
      givenName: { type: String },
      firstSurname: { type: String },
      secondSurname: {type: String},
      prefixName: {type: String},
      suffixName: {type: String},
      mainId:{type: String},
      /// OPTIONS

      // NAME OPTIONS
      showAllNames:{type: Boolean},     // Flag to show all names from patient in a tab fashion manner.
      defaultNameUse:{type:String},     // Default name to show in the main name tab

      // ADDRESS OPTIONS
      showAddress: {type: Boolean},     // Flag to show the address information
      showAllAdresses:{type: Boolean},  // Flag to show all the addresses in a tab fashion manner
      defaultAddressUse:{type:String}  // Default address to show in user base

    };
  }



  clickHandler(event) {
     // alert("Mostrar información de claves médics y de enferemeria");
     this.dispatchEvent(new CustomEvent('load-started',{bubbles:true,composed:true,detail:{data:new Date()}}));
     this.fetchResource();
  }

  fetchResource(){

    fetch("https://www.hl7.org/fhir/patient-example.json")
    .then(function(response) {
       return response.json();
    })
    .then(myJson=>this.dispatchEvent(new CustomEvent('load-complete', {bubbles:true,composed:true,
      detail: { data: myJson }
      })));
  }

  get templateAddress(){
    return html`
     <!-- PATIENTS ADDRESS AND ASIGNED PRACTITIONER ICON -->
    <div class="layout horizontal justified wrap" class="layout end" style="margin-top:8px;border-bottom:1px solid #EEEEEE;padding-bottom:4px;">
        <div style="flex-shrink:2;"><fhir-patient-address .addresses=${this.patient.address}
        .line=${this.patient.address[0].line}
        city=${this.patient.address[0].city}
        postalCode=${this.patient.address[0].postalCode}
        district=${this.patient.address[0].district}></fhir-patient-address></div>
        <div  style="flex-shrink:0.5;padding:8px">
        <mwc-button class="light" label="Equipo asignado" icon="people_outline" color="red" style="align-self:center" @click=${this.clickHandler}></mwc-button>
        <!--<img src="../manifest/doctor-stethoscope.svg" width="100%"/>--></div>
    </div>`;
  }
  render(){
    return html`

    <!-- template content -->

      <div class="layout vertical wrap">
        <!-- PATIENTS IDENTIFIER DATA -->
        <div class="layout vertical fixed-top wrap" style="font-size:x-large;font-family: 'Roboto';border-bottom:1px solid #EEEEEE;padding-bottom:4px;">
          <div style="color:#808080">${this.prefixName}</div>
          <div style="color:#333333;">${this.firstSurname} ${this.secondSurname}, ${this.givenName}</div>
          <div style="color:#4d4d4d;font-size:smaller;">${this.mainId}</div>
        </div>
        ${this.templateAddress}
      </div>

  `;
  }
}


customElements.define('fhir-mwc-patient-resume', PatientResume);
