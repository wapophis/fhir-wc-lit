import { LitElement, html } from 'lit-element';
import {Layouts,Alignment} from 'lit-flexbox-literals';         /// SOPORTE PARA FLEXBOX LAYOUTS
import {css} from 'lit-element';
import {Button} from "@material/mwc-button"
import {TabBar} from "@authentic/mwc-tab-bar"


class PatientResume extends LitElement{

  constructor() {
    console.log("WC-CONSTRUCTION");
    // Always call super() first
    super();
    // Initialize properties
    //console.log(this.patient);
    this.givenName=this.patient.name[0].given;
    this.firstSurname=this.patient.name[0].family;
    this.secondSurname=this.patient.name[0].suffix;
    this.prefixName=this.patient.name[0].prefix;
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


    // NAME USE ICON MAP
    // USE THIS ICON MAP TO MAP MATERIAL ICONS TO FHIR SUPPORTED USES FOR HUMANNAMEDT
    // TODO: SELECT ICONS.

    this.mapIconNameUse={
      usual:"face"
      ,official:"verified_user"
      ,temp:"polymer"
      ,nickname:"polymer"
      ,anonymous:"voice_over_off"
      ,old:"event_seat"
      ,maiden:"pets"
    };


    // EVENTS MAP
    // USE THIS MAP TO MANTAIN CLEAR THE EVENTS AND THE BUBBLING OF THE COMPONENT IN AN ORDER MANNER FASHION. BELOW THE LISTENERS


    this.mapEvents={

      loadStarted:{
        key:"load-started",
        bubbles:true,
        composed:true,
        details:{data:"datetime for example"}
      }
      ,loadCompleted:{
        key:"load-complete",
        bubbles:true,
        composed:true,
        details:{data:"Patient resource"}
      }
      ,showHumanNameByUse:{
        key:"human-name-use-selected",
        bubbles:true,
        composed:true,
        details:{data:"HumanNameDt expected"}
      }
    }

    this.addEventListener('human-name-use-selected',async(e)=>{
      console.log({listener_human_name_use_selected:e.detail.data});
      this.givenName=e.detail.data.given;
      this.firstSurname=e.detail.data.family;
      this.secondSurname=e.detail.data.suffix;
      this.prefixName=e.detail.data.prefix;
      this.mainId=this.patient.id;
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
     this.dispatchEvent(new CustomEvent(this.mapEvents.loadStarted.key
      ,{bubbles:this.mapEvents.loadStarted.bubbles,composed:this.mapEvents.loadStarted.composed
        ,detail:{data:new Date()}}));
     this.fetchResource();
  }

  /*
   * This method use fetch api to get an fhir example resource.
   */
  fetchResource(){
    fetch("https://www.hl7.org/fhir/patient-example.json")
    .then(function(response) {
       return response.json();
    })
    .then(myJson=>this.dispatchEvent(new CustomEvent(this.mapEvents.loadCompleted.key
      , {bubbles:this.mapEvents.loadCompleted.bubbles,composed:this.mapEvents.loadCompleted.composed,
      detail: { data: myJson }
      })));
  }

  /**
   * This method is a field get for the address template of the patient.
   */
  get renderAddresses(){
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

  /**
   * This method is the template logic to build the name use tab when there is more than only one humanName registered for the patient. Then call to render name to
   * use the HumanName template for the selected HumanNameDt.
   */
  get renderTabsForHumanName(){
     console.log({showAllNames:this.showAllNames});
     console.log({patient:this.patient});
     if(this.showAllNames===true && this.patient.name.length>1){
       let tabs=[];
       for(let i=0;i<this.patient.name.length;i++){
         let icon=this.mapIconNameUse[this.patient.name[i].use];
         let humanNameDt=this.patient.name[i];
          tabs.push(html`<mwc-tab icon=${icon} label=${this.patient.name[i].use} isFadingIndicator minWidth isMinWidthIndicator
          @click=${(event)=> this.dispatchEvent(new CustomEvent(this.mapEvents.showHumanNameByUse.key
          ,{bubbles:this.mapEvents.showHumanNameByUse.bubbles
          ,composed:this.mapEvents.showHumanNameByUse.composed
          ,detail:{data:humanNameDt}}
          ))}></mwc-tab>`);
       }
       return html`<mwc-tab-bar>${tabs}</mwc-tab-bar>`;
     }else{
       return html``;
     }
  }


  render(){
    return html`

    <!-- template content -->

      <div class="layout vertical wrap">
        <!-- PATIENTS IDENTIFIER DATA -->
        ${this.renderTabsForHumanName}
        <div class="layout vertical fixed-top wrap" style="font-size:x-large;font-family: 'Roboto';border-bottom:1px solid #EEEEEE;padding-bottom:4px;">
          <div style="color:#808080">${this.prefixName}</div>
          <div style="color:#333333;">${this.firstSurname} ${this.secondSurname}, ${this.givenName}</div>
          <div style="color:#4d4d4d;font-size:smaller;">${this.mainId}</div>
        </div>
        ${this.renderAddresses}
      </div>

  `;
  }
}


customElements.define('fhir-mwc-patient-resume', PatientResume);
