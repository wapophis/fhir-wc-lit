import { LitElement,html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt,NameUseEnum} from "hapi-fhir/src/fhir-dstu-3-0";
import {Button} from "@material/mwc-button";
import {TextField} from "@authentic/mwc-textfield";
import {Select} from "@authentic/mwc-select";
import {Formfield} from "@authentic/mwc-formfield";
import {Chip} from "@authentic/mwc-chips";

class FhirHumanNameMaterialForm extends LitElement{

    static get properties(){
        return {
            modal:{type:Boolean},
            accordion:{type:Boolean},
            humanNameDt:{type:Object},
            title:{type:String},                  // TITLE TO SHOW ON TOP OF THE FORM
            showExtensions:{type:Boolean}         // TRUE TO SHOW EXTENSIONS SELECTOR
        };
    }

    constructor() {
        // Always call super() first
        super(...arguments);
        this.modal=false;
        this.accordion=false;
        this.humanNameDt=new HumanNameDt( {
          suffix:["Mister","Capitain"],
          use: "maiden",
          family: "Windsor",
          given: [
            "Peter",
            "James"
          ],
          period: {
            end: "2002"
          },
          prefix:["Junior","Senior"],
        });
        this.title="Fhir HumanName Form";
    }

    static get styles(){
      return [Layouts,Alignment,
       css`
        .header{
          font-family:Roboto, sans-serif;
          font-size:x-large;
          opacity:0.76;
          margin-left:48px;
          align-self: center;
          border-bottom:1px dashed silver;
        }
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

      `];
    }

    get renderNames(){

      return html`
            <div class="layout horizontal wrap between-aligned" style="justify-content:space-between;margin-bottom:4px;margin-top:4px;">
                  <mwc-textfield name="givenName" icon="edit" value=""
                   box outlined
                   helperText="Please set your given name here"
                   label="Given Name" value="${this.humanNameDt.given.join(" ")}" @blur=${(ev)=>console.log(this.humanNameDt)}></mwc-textfield>
                   <mwc-textfield name="familyName" icon="edit" value="${this.humanNameDt.family}"
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
        if(useValues[i].code===this.humanNameDt.use){
          useOptions.push(html`<option value="${useValues[i].code}" selected>${useValues[i].display}</option>`);
        }else{
        useOptions.push(html`<option value="${useValues[i].code}">${useValues[i].display}</option>`);
        }
      }

      return html`<mwc-select style="margin-bottom:4px;margin-top:4px;" value="${this.humanNameDt.use}" box outlined label="Name Use" helperText="Please set the use for this name" leadingIconContent="edit" @change=${(ev)=>console.log(ev)}>
        <select slot="select" >
             ${useOptions}
          </select>
       </mwc-select>`;
    }

    get renderPeriod(){
      return html`
        <div class="layout horizontal wrap between-justified" style="margin-top:16px;margin-bottom:16px;align-content:between-justified">
        <fieldset style="border-radius:3px;border:1px solid silver;padding:12px 32px 12px 48px;">
          <legend style="font-family:roboto;font-size:small;opacity:0.38">Name period valid</legend>
           <mwc-icon style="margin-left: -40px;opacity: 0.58;">edit</mwc-icon>
            <mwc-formfield alignEnd label="Since">
              <input type="date" value="${this.humanNameDt.period.start}">
            </mwc-formfield>
            <mwc-formfield alignEnd label="To">
            <input type="date" value="${this.humanNameDt.period.end}">
            </mwc-formfield>
        </fieldset>
        </div>
      `;
    }
    get renderPrefix(){
      let preffixes=this.humanNameDt.prefix;
      let preffixesToRender=new Array();
      for(let i=0;i<preffixes.length;i++){
        preffixesToRender.push(html`<mwc-chip label="${preffixes[i]}" avatar="${preffixes[i].substring(0,1)}" trailingIcon="cancel"></mwc-chip>`);
      }
     return html`
     <div class="layout vertical" style="margin-bottom:4px;margin-top:4px;">
      <div class="layout horizontal">
      <mwc-textfield name="prefix" icon="edit" value=""
                   box outlined
                   helperText="Please set any prefix here"
                   label="Prefix"></mwc-textfield>
        <mwc-chip-set input autoRemove id="chips" @focus=${(ev)=>console.log(ev)} >
        ${preffixesToRender}
        </mwc-chip-set>
      </div>

    </div>

     `;
    }


    get renderSuffix(){
      let suffixes=this.humanNameDt.suffix;
      let suffixesToRender=new Array();
      for(let i=0;i<suffixes.length;i++){
        suffixesToRender.push(html`<mwc-chip label="${suffixes[i]}" avatar="${suffixes[i].substring(0,1)}" trailingIcon="cancel"></mwc-chip>`);
      }
      return html`

      <div class="layout vertical" style="margin-top:16px">
       <div class="layout horizontal">
       <mwc-textfield name="suffix" icon="edit" value=""
                    box outlined
                    helperText="Please set any suffix here"
                    label="Suffix"></mwc-textfield>
         <mwc-chip-set input autoRemove id="chips" @focus=${(ev)=>console.log(ev)} >
          ${suffixesToRender}
         </mwc-chip-set>
       </div>

     </div>

      `;
     }


     get renderExtensions(){
      let extensionsOptions=[];
      let commonExtensions=new Array();
      commonExtensions.push(new ExtensionDt({uri:"extension1",valueString:"extension1-value"}));

      for(let i=0;i<commonExtensions.length;i++){
        extensionsOptions.push(html`<option value="${commonExtensions[i].uri}">${commonExtensions[i].valueString}</option>`);
      }

      return html`<mwc-select box outlined label="Extensions" leadingIconContent="edit" @change=${(ev)=>console.log(ev)}>
        <select slot="select">
            <option value="" disabled selected></option>
             ${extensionsOptions}
          </select>
       </mwc-select>`;
    }

    render(){
      return html`
      <div>
        <div class="header layout horizontal">${this.title}</div>
        <div class="layout vertical wrap content">
        ${this.renderPrefix}
        ${this.renderNames}
        ${this.renderUse}
        ${this.renderSuffix}
        ${this.renderPeriod}
        ${this.renderExtensions}
        </div>
        </div>
        `;
    }
}

customElements.define('fhir-human-name-material-form', FhirHumanNameMaterialForm);
