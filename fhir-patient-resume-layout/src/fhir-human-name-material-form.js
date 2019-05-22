import { LitElement,html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt,NameUseEnum} from "hapi-fhir/src/fhir-dstu-3-0";
import {Button} from "@material/mwc-button";
import {TextField} from "@authentic/mwc-textfield";
import {Select} from "@authentic/mwc-select";
import {Formfield} from "@authentic/mwc-formfield";

class FhirHumanNameMaterialForm extends LitElement{

    static get properties(){
        return {
            modal:{type:Boolean},
            accordion:{type:Boolean},
            humanNameDt:{type:Object}
        };
    }

    constructor() {
        // Always call super() first
        super(...arguments);
        this.modal=false;
        this.accordion=false;
        this.humanNameDt=new HumanNameDt();
    }

    static get styles(){
      return css`
        .content{
          font-size:x-large;
          padding:32px;
        }

        .secondary-text{
          text-transform:capitalize
        }
        .content{
          margin-left:16px;
          margin-right:16px
        }
      `;
    }

    get renderNames(){
      return html`
            <div class="layout horizontal wrap">
                  <mwc-textfield name="givenName" icon="edit" value=""
                   box outlined
                   helperText="Please set your given name here"
                   label="Given Name"></mwc-textfield>
                   <mwc-textfield name="familyName" icon="edit" value=""
                   box outlined
                   helperText="Please set your given name here"
                   label="Family Name"></mwc-textfield>
            </div>

      `;
    }

    get renderUse(){
      let useOptions=[];
      let useValues=NameUseEnum.valueSet();
      for(let i=0;i<useValues.length;i++){
        useOptions.push(html`<option value="${useValues[i].code}">${useValues[i].display}</option>`);
      }
      console.log(useOptions);
      return html`<mwc-select box outlined label="Name Use" helperText="Please set the use for this name" leadingIconContent="edit" @change=${(ev)=>console.log(ev)}>
        <select slot="select">
            <option value="" disabled selected></option>
             ${useOptions}
          </select>
       </mwc-select>`;
    }

    get renderPeriod(){
      return html`
        <div class="layout horizontal wrap" style="margin-top:16px;">
        <fieldset style="border-radius:3px;border:1px solid silver;padding:12px 32px 12px 48px;">
          <legend style="font-family:roboto;font-size:small;opacity:0.38">Name period valid</legend>
           <mwc-icon style="margin-left: -40px;opacity: 0.58;">edit</mwc-icon>
            <mwc-formfield alignEnd label="Since">
              <input type="date">
            </mwc-formfield>
            <mwc-formfield alignEnd label="To">
              <input type="date">
            </mwc-formfield>
        </fieldset>
        </div>
      `;
    }

    render(){
      return html`
        <div class="layout vertical wrap content">
        ${this.renderNames}
        ${this.renderUse}
        ${this.renderPeriod}

        </div>`;
    }
}

customElements.define('fhir-human-name-material-form', FhirHumanNameMaterialForm);
