import { LitElement,html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt,NameUseEnum} from "hapi-fhir/src/fhir-dstu-3-0";
import {Button} from "@material/mwc-button";
import {TextField} from "@authentic/mwc-textfield";
import {Select} from "@authentic/mwc-select";
import {Formfield} from "@authentic/mwc-formfield";
import {Chip} from "@authentic/mwc-chips";
import moment from 'moment';

class FhirHumanNameMaterialForm extends LitElement{

    static get properties(){
        return {
            modal:{type:Boolean},
            accordion:{type:Boolean},
            humanNameDt:{type:Object},
            title:{type:String},                  // TITLE TO SHOW ON TOP OF THE FORM
            showExtensions:{type:Boolean},        // TRUE TO SHOW EXTENSIONS SELECTOR
            saveOnClose:{type:Boolean},           // AUTOSAVE ON FHIR RESOURCE AT CLOSE DIALOG
            showSaveButton:{type:Boolean},        // Show Save Button
            buttonText:{type:String}              // Text to show in the button to save if true
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
        this.saveOnClose=false;
        this.showSaveButton=false;
        this.buttonText="Save Name"
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

        .material-date{
          outline: 0px solid transparent;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          padding:8px;
          font-size:large;
          font-weight:400;
          margin-top: 4px;
          margin-bottom: 4px;
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

   /**
   * Only update element if humanNameDt has changed
   */
  shouldUpdate(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    return true;
  }

    handleGivenName(target){
      this.humanNameDt.given=target.value.split(" ");
    }

    handleFamilyName(target){
      this.humanNameDt.family=target.value;
    }

    handleUse(target){
      this.humanNameDt.use=target.value;

    }

    handlePeriod(dateType,target){
      this.humanNameDt.period[dateType]=target.value;
      console.log(this.humanNameDt);
    }

    handleAddSuffix(target){
      if(target.value!==undefined && target.value.trim().length>0){
        this.humanNameDt.addSuffix(target.value);
      }
      target.value="";
      this.requestUpdate();
    }
    handleRemoveSuffix(target){
      this.humanNameDt.removeSuffix(target.label);
      this.requestUpdate();
    }

    handleAddPrefix(target){
      this._addPrefix(target.value);
      target.value="";
      //this.requestUpdate();
      console.log(this.humanNameDt.prefix);
    }
    _addPrefix(value){
      let chipSet=this.shadowRoot.getElementById('chipsprefixes');
      if(value!==undefined && value.trim().length>0){
        let auxSet=new Set(this.humanNameDt.prefix);
        let insertChip=true;
        if(!auxSet.has(value)){
          insertChip=false;
        }
        this.humanNameDt.addPrefix(value);
        if(insertChip===true){
        this._addChip(value,value.substring(0,1),chipSet);
        }
      }
    }

    _addChip(label,avatar,chipSet){
      let chip = document.createElement('mwc-chip');
      chip.label = label;
      chip.trailingIcon = 'close';
      chip.avatar=avatar;
      chipSet.addChip(chip);
    }

    handleAddLivePrefix(ev){
      let target=ev.target;
      if(ev.data===" " && ev.inputType==="insertText" && target.value!==undefined && target.value.trim().length>0){
        let values=target.value.split(" ");
        this._addPrefix(values[values.length-2]);
        target.value="";
     //   this.requestUpdate();
      }
    }

    handleRemovePrefix(target){
      this.humanNameDt.removePrefix(target.label);
      console.log(this.humanNameDt.prefix);
   //   this.requestUpdate();
    }


    get renderNames(){

      return html`
            <div class="layout horizontal wrap between-aligned" style="justify-content:space-between;">
                  <mwc-textfield name="givenName" icon="edit" value="" style="margin-bottom:4px;margin-top:4px;"
                   box outlined
                   helperText="Please set your given name here"
                   label="Given Name" value="${this.humanNameDt.given.join(" ")}" @blur=${(ev)=>this.handleGivenName(ev.target)}></mwc-textfield>
                   <mwc-textfield  style="margin-bottom:4px;margin-top:4px;" name="familyName" icon="edit" value="${this.humanNameDt.family}" @blur=${(ev)=>this.handleFamilyName(ev.target)}
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

      return html`<mwc-select style="margin-bottom:4px;margin-top:4px;" value="${this.humanNameDt.use}" box outlined label="Name Use" helperText="Please set the use for this name" leadingIconContent="edit" @change=${(ev)=>this.handleUse(ev.target)}>
        <select slot="select" >
             ${useOptions}
          </select>
       </mwc-select>`;
    }

    get renderPeriod(){
      return html`
        <div class="layout horizontal wrap between-justified" style="margin-top:16px;margin-bottom:16px;align-content:between-justified">
        <fieldset style="border-radius:4px;border:1px solid silver;padding:12px 32px 12px 48px;">
          <legend style="font-family:roboto;font-size:small;opacity:0.38">Name period valid</legend>
           <mwc-icon style="margin-left: -40px;opacity: 0.58;">edit</mwc-icon>
            <mwc-formfield alignEnd label="Since">
              <input class="material-date" type="date" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
              @blur=${(ev)=>this.handlePeriod("start",ev.target)}
              value="${this.humanNameDt.period.start===undefined?'':moment(this.humanNameDt.period.start).format(moment.HTML5_FMT.DATE)}">
            </mwc-formfield>
            <mwc-formfield alignEnd label="To" >
            <input class="material-date" type="date" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
            @blur=${(ev)=>this.handlePeriod("end",ev.target)}
             value="${this.humanNameDt.period.end===undefined?'':moment(this.humanNameDt.period.end).format(moment.HTML5_FMT.DATE)}">
            </mwc-formfield>
        </fieldset>
        </div>
      `;
    }
    get renderPrefix(){
      let preffixes=this.humanNameDt.prefix;
      let preffixesToRender=[];
      console.log(preffixes);
      for(let i=0;i<preffixes.length;i++){
        preffixesToRender.push(html`<mwc-chip id="${preffixes[i]}" label="${preffixes[i]}" avatar="${preffixes[i].substring(0,1)}" trailingIcon="cancel"></mwc-chip>`);
      }
      console.log(preffixesToRender);
     return html`
     <div class="layout vertical" style="margin-bottom:4px;margin-top:4px;">
      <div class="layout horizontal">
      <mwc-textfield name="prefix" icon="edit" value=""
                   box outlined
                   helperText="Please set any prefix here"
                   label="Prefix"
                   @input=${(ev)=> this.handleAddLivePrefix(ev)}
                   @blur=${(ev)=>this.handleAddPrefix(ev.target)}
                   ></mwc-textfield>
        <mwc-chip-set input autoRemove id="chipsprefixes" @focus=${(ev)=>console.log(ev)} @MDCChip:removal=${(ev)=>{this.handleRemovePrefix(ev.target);}} >
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
                    label="Suffix" @blur=${(ev)=>this.handleAddSuffix(ev.target)}></mwc-textfield>
         <mwc-chip-set input autoRemove id="chipssuffixes" @focus=${(ev)=>console.log(ev)} @MDCChip:removal=${(ev)=>this.handleRemoveSuffix(ev.target)} >
          ${suffixesToRender}
         </mwc-chip-set>
       </div>

     </div>

      `;
     }


     get renderExtensions(){
      let extensionsOptions=[];
      let commonExtensions=new Array();
      commonExtensions.push(new ExtensionDt({uri:"extension1",value:new StringDt("extension1-value")}));

      for(let i=0;i<commonExtensions.length;i++){
        extensionsOptions.push(html`<option value="${commonExtensions[i].uri}">${commonExtensions[i].value}</option>`);
      }

      return html`<mwc-select box outlined label="Extensions" leadingIconContent="edit" @change=${(ev)=>console.log(ev)}>
        <select slot="select">
            <option value="" disabled selected></option>
             ${extensionsOptions}
          </select>
       </mwc-select>`;
    }

    get renderSaveButton(){

      return html`
      <p style="margin:16px"></p>
      <mwc-button outlined raised dense label="${this.buttonText}" icon="save" @click=${(ev)=>console.log(ev)}></mwc-button>`;
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
        ${this.renderSaveButton}
        </div>
        </div>
        `;
    }
}

customElements.define('fhir-human-name-material-form', FhirHumanNameMaterialForm);
