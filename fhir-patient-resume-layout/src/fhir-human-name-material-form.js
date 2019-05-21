import { LitElement,html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt} from "hapi-fhir/src/fhir-dstu-3-0";
import {Button} from "@material/mwc-button";
import {TextField} from "@authentic/mwc-textfield";

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
        .primary-text{
          font-size:x-large;  
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

    get renderTextFields(){
      return html`
                  <mwc-textfield value="value" name="name" icon="edit"
                   box outlined required persistentHelperText
                   cols="20"
                   placeholder="placeHolder"
                   validationMessage="validation message"
                   helperText="helperText"
                   label="Name Given"></mwc-textfield>
                  <mwc-textfield label="Name Family" ></mwc-textfield>
      `; 
    }

    render(){
      return html`
        <div class="layout vertical wrap">
        ${this.renderTextFields}  
    
        </div>`;
    }
}

customElements.define('fhir-human-name-material-form', FhirHumanNameMaterialForm);
