import { LitElement, html, css } from 'lit-element';
import {Layouts} from 'lit-flexbox-literals';         /// SOPORTE PARA FLEXBOX LAYOUTS
import {Icon} from '@material/mwc-icon';


class PatientAddress extends LitElement{
  constructor() {
    // Always call super() first
    super();

    // Initialize properties
  }

  static get styles() {
    return [Layouts,css`.light {
      --mdc-theme-on-primary: black;
      --mdc-theme-primary: #00867d;
      --mdc-theme-on-secondary: black;
      --mdc-theme-secondary: white;
    }`];
  }
  static get properties(){
    return {
      line: { type:Array,hasChanged: (value,oldValue)=> true }, /// HASCHANGED SE USA PARA FORZAR RENDER CUANDO DEVUELVE TRUE LA COMPARACION, USESE CON CUIDADO
      city: { type: String },
      district: {type: String},
      state: {type: String},
      postalCode: {type: String},
      country:{type: String},
      period:{type:Object,hasChanged: (value,oldValue)=> true},
      addresses:{type:Array,hasChanged:(value,oldValue)=> true}
    };
  }

  render(){
    console.log(this.line);
    return html`

    <!-- template content -->

      <div class="layout vertical wrap">
        <!-- PATIENTS ADDRESS DATA -->
        <div class="layout vertical fixed-top wrap" style="font-size:normal;">
          <div class="layout horizontal" style="color:#333333;font-family: 'Roboto';">
          <div style="color:#4ba3c7"><mwc-icon>person_pin</mwc-icon></div>
          <div style="align-self:center">${(this.line!==undefined && this.line.length>0)?
                    this.line.map(i => html`${i}, `):
                    html`<span style="color:#DDDDDD;margin-right:24px;">Sin datos ... </span><mwc-button class="light"  icon="add_box"></mwc-button>`}</div>
          </div>
          <div class="layout horizontal" style="color:#999999;font-family: 'Roboto';font-size:smaller;">
          <div><mwc-icon>location_city</mwc-icon></div>
            <div style="align-self:center">${this.city!==undefined ?html `${this.city}, `:''}
            ${this.postalCode} - ${this.district}</div>
          </div>
          <div class=" layout horizontal "style="color:#999999;font-family: 'Roboto';font-size:smaller;/*margin-top:16px*/">
          <div ><mwc-icon>domain</mwc-icon></div><div style="align-self:center">Servicio Andaluz de Salud</div></div>
        </div>
      </div>

  `;
  }
}


customElements.define('fhir-patient-address', PatientAddress);
