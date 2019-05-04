import { LitElement, html } from 'lit-element';
import {Layouts} from 'lit-flexbox-literals';         /// SOPORTE PARA FLEXBOX LAYOUTS
import {style} from './card/mwc-card-css.js';    /// ESTILOS DE MATERIAL CARD
import {classMap} from 'lit-html/directives/class-map';

class PatientResumeLayout extends LitElement{
   constructor() {
      // Always call super() first
      super();

      // Initialize properties
      this.loading=false;
      this.myFhirPatient={
         identifier:[
            {use:"usual",
             value:"AN123456789"}
         ],
         name:[
         {given:"Felipe Juan Froilán de Todos los Santos",
         family:"de Marichalar",
         prefix:"Don",
         suffix:"y Borbón"}],
       address:[
         {line:["Calle","Antonio de Nebrija",11],
         city:"Bormujos",
         postalCode:41930,
         district:"Sevilla"}]
       };


       this.addEventListener('load-started',async(e)=>{
         this.loading=true;
         await this.requestUpdate();
       });

       this.addEventListener('load-complete', async (e) => {
         this.loading=false;
         await this.requestUpdate();
         console.log(this.loading);
       });

   }

   static get properties(){
      return {loading:{type:Boolean}};
   }
  static get styles() {
    return [Layouts];
  }

  renderStyle() {
    return style;
  }

  render(){
    return html`

    <!-- template content -->

      ${this.renderStyle()}
      <div>Loading status:${this.loading}</div>
      <div class="mdc-card ${classMap({'mdc-card--stroked': true})}">
      <div class="layout vertical wrap" width="640px">
            <!-- patient resume -->
       <div class="layout vertical wrap" style="padding:16px" >
          <!--<fhir-mwc-patient-resume .patient=${this.myFhirPatient} givenName=${this.myFhirPatient.name.given}
           firstSurname=${this.myFhirPatient.name.family} secondSurName=${this.myFhirPatient.name.suffix} mainId="AN123456789"></fhir-mwc-patient-resume> -->
           <fhir-mwc-patient-resume .patient=${this.myFhirPatient} showAllNames></fhir-mwc-patient-resume>
       </div>
    <!-- patient hr basic -->
       <div class="layout vertical wrap" style="padding:16px" >
          PATIENT HR BASIC
       </div>
    <!-- timer-slider-agenda -->
       <div class="layout horizontal wrap" style="padding:16px" >
          TIMER AS SLIDER AGENDA
       </div>
    <!-- patient appointments resumed -->
       <div class="layout vertical wrap" style="padding:16px" >
          PATIENT APPOINTMENTS RESUMED
       </div>
      <!-- MAIN ACTION BUTTON -->
    <div class="mdc-card__primary-action" tabindex="0">
       MAIN ACTION BUTTON
    </div>
    </div>
  </div>

  `;
  }
}


customElements.define('fhir-patient-resume-layout', PatientResumeLayout);
