import { LitElement,html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt} from "hapi-fhir/src/fhir-dstu-3-0";
import {ListItem} from "@authentic/mwc-list";

class FhirHumanNameMaterialListItem extends LitElement{

    static get properties(){
        return {
            firstLine:{type:String},
            secondLine:{type:String},
            icon:{type:String},
            modal:{type:Boolean},
            accordion:{type:Boolean},
            icono:{type:String},
            humanNameDt:{type:Object}
        };
    }

    constructor() {
        // Always call super() first
        super(...arguments);
        this.firstLine="Primary Text";
        this.secondLine="Secondary Text";
        this.modal=false;
        this.accordion=false;
        this.icon="supervised_user_circle";
    /*    this.humanNameDt=new HumanNameDt({family:"Martínez",given:["Luis","Alejandro"]});
        this.humanNameDt.addExtension(new ExtensionDt({uri:"http://hl7.org/fhir/StructureDefinition/humanname-mothers-family"
        ,valuePropName:"valueString",valueString:"Fontiveros"}))
        this.humanNameDt.addExtension(new ExtensionDt({uri:"http://hl7.org/fhir/StructureDefinition/humanname-mothers-family"
        ,valuePropName:"valueString",valueString:"Lozano"}));
     */
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

    _renderContent(){

    }

    render(){
        if(this.humanNameDt.isEmpty()){
          this.firstLine="Nombre completo";
          this.secondLine="use";
        }else{
          this.firstLine=this.humanNameDt.text;
          this.secondLine=this.humanNameDt.use;  
        }
        

        if(this.modal===true && this.accordion===false){
            return html`<mwc-list-item style="font-family:Roboto;" 
            modal
            icon="supervised_user_circle">
          <span slot="primary-text" class="primary-text">${this.firstLine}</span>
          <span slot="secondary-text" class="secondary-text">${this.secondLine}</span>
             <p slot="content" class="content"><slot name="content"></slot></p>
          </mwc-list-item>`;
        }

        if(this.modal===false && this.accordion===true){
            return html`<mwc-list-item style="font-family:Roboto;" 
            accordion
            icon="supervised_user_circle">
    
            <span slot="primary-text" class="primary-text">${this.firstLine}</span>
          <span slot="secondary-text" class="secondary-text">${this.secondLine}</span>
             <p slot="content" class="content"><slot name="content"></slot></p>
          </mwc-list-item>`;
        }


        return html`<mwc-list-item style="font-family:Roboto;" 
        icon="${this.icon}">
        <span slot="primary-text" class="primary-text">${this.firstLine}</span>
          <span slot="secondary-text" class="secondary-text">${this.secondLine}</span>
             <p slot="content" class="content"><slot name="content"></slot></p>
      </mwc-list-item>`;
    }
}

customElements.define('fhir-human-name-material-list-item', FhirHumanNameMaterialListItem);
