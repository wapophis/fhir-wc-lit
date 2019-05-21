import { LitElement, html,css } from "lit-element";
import {Layouts,Alignment} from "lit-flexbox-literals";         /// SOPORTE PARA FLEXBOX LAYOUTS
import {StringDt,HumanNameDt,ExtensionDt} from "hapi-fhir/src/fhir-dstu-3-0";
import {ListItem} from "@authentic/mwc-list";
import {Button} from "@material/mwc-button";
import {TextField} from "@authentic/mwc-textfield";





class HumanNameListItem extends LitElement{
  log(message){
    console.log({tag:this.TAG,message:message});
  }
  get TAG(){
    return "HumanNameListItem"+":"+new Date();
  }
  static get properties(){
    return {
      /// RENDERED INFO
      nameList:{type:Array,hasChanged:(value,oldValue)=> true},
      humanNameDtList:{type:Array,reflect:false},
      /// OPTIONS

      // NAME OPTIONS
      showAllNames:{type: Boolean},     // Flag to show all names from patient in a tab fashion manner.
      defaultNameUse:{type:String},     // Default name to show in the list item
      hideDefault:{type:Boolean},       // Flag to hide the default selected name in expanded view.

      // WC OPTIONS
      editable:{type:Boolean},          // Flag wich make the human name dt editable
      showIcons:{type:Boolean},         // True to show icons for use.
      editableItemUse:{type:String}     // Property to control the editable item.


    };
  }

  constructor() {
    // Always call super() first
    super();
    // Initialize properties
    this.humanNameDtList=new Array();
    if(this.hideDefault===undefined){
      this.hideDefault=false;
    }
    this.editableItemUse===undefined?this.editableItemUse=null:'';


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
      ,onEditName:{
        key:"onEditName",
        bubbles:false,
        composed:false,
        details:{data:"HumanNameDt expected"}
      }
      ,beforeEditName:{
        key:"beforeEditName",
        bubbles:true,
        composed:true,
        details:{data:"HumanNameDt expected"}
      }
      ,afterEditName:{
        key:"afterEditName",
        bubbles:true,
        composed:true,
        details:{data:"HumanNameDt expected"}
      },
      onRemoveName:{
        key:"onRemoveName",
        bubbles:false,
        composed:false,
        details:{data:"HumanNameDt removed expected"}
      }

    }

    this.addEventListener('human-name-use-selected',async(e)=>{
            await this.requestUpdate();

    });

    this.addEventListener('load-complete', async (e) => {
            await this.requestUpdate();
   });

   /**
    * This listener launch the lifecycle to update and existing name.
    */
   this.addEventListener(this.mapEvents.onEditName.key,async(e)=>{
    // console.log({TAG:this.TAG,msg:this.mapEvents.onEditName.key+"Listener",payload:e.detail.data});
    this.dispatchEvent(new CustomEvent(this.mapEvents.beforeEditName.key
      ,{bubbles:this.mapEvents.beforeEditName.bubbles,composed:this.mapEvents.beforeEditName.composed
        ,detail:{data:e.detail.data}}));
    await this.requestUpdate();
  });


   /**
    * This listener launch the lifecycle to update and existing name.
    */
   this.addEventListener(this.mapEvents.beforeEditName.key,async(e)=>{
     // console.log({TAG:this.TAG,msg:this.mapEvents.beforeEditName.key+"Listener",payload:e.detail.data});
       this.editableItemUse=e.detail.data.use;
       this.dispatchEvent(new CustomEvent(this.mapEvents.afterEditName.key
      ,{bubbles:this.mapEvents.afterEditName.bubbles,composed:this.mapEvents.afterEditName.composed
        ,detail:{data:e.detail.data}}));
    await this.requestUpdate();
  });


     /**
    * This listener launch the lifecycle to update and existing name.
    */
   this.addEventListener(this.mapEvents.afterEditName.key,async(e)=>{
  // console.log({TAG:this.TAG,msg:this.mapEvents.afterEditName.key+"Listener",payload:e.detail.data});
    //this.editableItemUse=null;
    await this.requestUpdate();
  });


  this.log({text:"Constructor finished",data:{
      mapEvents:this.mapEvents,
      mapIconNameUse:this.mapIconNameUse
  }});

  } // END OF THE CONSTRUCTOR


    /**
   *
   * @param {*} use type use for the human name dt.
   * It's launch event onEditName with humannamedt attached
   */
  editNameHandler(humanNameDt){
    this.dispatchEvent(new CustomEvent(this.mapEvents.onEditName.key
      ,{bubbles:this.mapEvents.onEditName.bubbles,composed:this.mapEvents.onEditName.composed
        ,detail:{data:humanNameDt}}));
  }

  /**
   * It's stop the editing of the fields
   * @param {*} humanNameDt
   */
  cancelEditingNameHandler(humanNameDt){
    this.editableItemUse=null;
  }

  /**
   * It's removes the item from the list, updating the date range accordly.
   * @param {*} index
   * @param {*} humanNameDt
   */
  removeNameHandler(index,humanNameDt){
   // console.log(humanNameDt);
    if(humanNameDt.period!==undefined){ // PROCESS PERIOD DATA
        if(humanNameDt.period.end===undefined){
          humanNameDt.period.end=new Date();
        }
    }
    this.nameList.splice(index,1);

    // Updates the defaultNameUse, this force ui update
    if(this.defaultNameUse===humanNameDt.use){
      this.defaultNameUse=this.nameList[0].use;
    }
   // this.totalCount--;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent(this.mapEvents.onRemoveName.key,{
      bubbles:this.mapEvents.onRemoveName.bubbles,
      composed:this.mapEvents.onRemoveName.composed,
      detail:{data:humanNameDt}
    }));
  }

  /**
   * Method to update the humanNameDt provided in dest field
   * @param {*} dest HumanName
   * @param {*} field given (will be splitted by spaces)| family
   * @param {*} value value to set in the field.
   */
  updateNameHandler(dest,field,value){
    if(field==="given"){
      dest[field]=value.split(" ");
    }
    if(field==="family"){
      dest[field]=value;
    }
  }


  updated(changedProperties){
 //   console.log({tag:this.TAG,function:"updated:changedProperties",args:changedProperties});
  }


  static get styles() {
      return [Layouts,Alignment,
        css`.light {
          --mdc-theme-on-primary: black;
          --mdc-theme-primary: #26a69a;
          --mdc-theme-on-secondary: black;
          --mdc-theme-secondary: #c0ca33;
        }`];
  }




  /**
   * Method wich render the human name list as a list item with an accordion
   */

  get renderListItemForHumanName(){
   // console.log({TAG:this.TAG,msg:"renderListItemForHumanName"});

    let showAccordion=false;
    let accordionLabel=null;
    let accordionSubLabel=null;
    let accordionIcon=null;
    let defaultNameIndex=0;


    // Search for default name to show
    if(this.defaultNameUse!== undefined){
      let useFound=false;
        for(let i=0;i<this.nameList.length && useFound===false;i++){
          if(this.nameList[i].use===this.defaultNameUse){
            defaultNameIndex=i;
            useFound=true;
          }
        }
    }

    let defaultHumanName=new HumanNameDt(this.nameList[defaultNameIndex]);


    //accordionLabel=(this.nameList[defaultNameIndex].given!==undefined?" "+this.nameList[defaultNameIndex].given.join(" "):'')+(this.nameList[defaultNameIndex].family!==undefined?" "+this.nameList[defaultNameIndex].family:'');
    accordionLabel=defaultHumanName.getGiven().length>0?defaultHumanName.getGiven().join(" ")+" "+defaultHumanName.family:"";
    //accordionSubLabel=this.nameList[defaultNameIndex].use;
    accordionSubLabel=defaultHumanName.use;
    //accordionIcon=this.mapIconNameUse[this.nameList[defaultNameIndex].use];
    accordionIcon=this.mapIconNameUse[defaultHumanName.use];


    // RENDER ITEMS
    //if(this.showAllNames===true && this.patient.name.length>1){
      let items=[];

      for(let i=0;this.showAllNames===true && i<this.nameList.length;i++){
        let currentHumanName=new HumanNameDt(this.nameList[i]);

        let icon=this.mapIconNameUse[currentHumanName.use];
        let humanNameDt=this.nameList[i];
        let renderedName=(currentHumanName.given.length>0?currentHumanName.given.join(" "):'')+(" "+currentHumanName.getFamilyElement().value);
        let renderedUse=currentHumanName.use;
        let isNoEditing=this.editable && this.editableItemUse!==currentHumanName.use;

        if(i!==defaultNameIndex || this.hideDefault===false){
           if(isNoEditing===true){
            items.push(html`
            <span class="layout horizontal wrap">
               <mwc-icon style="opacity:0.38; margin-right:32px;vertical-align:middle">${icon}</mwc-icon>
               <span class="layout vertical wrap" style="font-family:Roboto;" >
                 <span><span style="/*vertical-align: super;*/">${renderedName}</span></span>
                 <span style="text-transform: capitalize;opacity:0.36;font-size: smaller;align-self: flex-start;">${renderedUse}</span>
               </span>
               <span style="vertical-align:middle;margin-left:auto;align-self:flex-end">
               <span style="margin-left:auto">
               <mwc-button icon="edit" class="light" style="align-self:center;" @click=${(e)=>this.editNameHandler(currentHumanName)}></mwc-button></span>
               <mwc-button icon="delete" dense class="light" style="align-self:center;" @click=${(e)=>this.removeNameHandler(i,currentHumanName)}></mwc-button>
               </span>
            </span>
            `);
           }else{
            items.push(html`
            <span class="layout vertical wrap" style="font-family:Roboto;">
                <span class="layout horizontal wrap">
                <mwc-icon style="opacity:0.38; margin-right:32px;vertical-align:middle">${icon}</mwc-icon>
                <mwc-textfield label="Name Given" value=${currentHumanName.given.join(" ")}

                @blur=${(e)=>this.editNameHandler(currentHumanName)}
                @input=${(e)=>{this.updateNameHandler(currentHumanName,"given",e.target.value)}} ></mwc-textfield>
                <mwc-textfield label="Name Family" value=${currentHumanName.family} style="margin-left:56px"
                @blur=${(e)=>this.editNameHandler(currentHumanName)}
                @input=${(e)=>this.updateNameHandler(currentHumanName,"family",e.target.value)}></mwc-textfield>

                </span>
                <span style="text-transform: capitalize;opacity:0.36;font-size: smaller;align-self: flex-start;">${renderedUse}</span>
                <span class="layout horizontal" style="margin-bottom:24px">
                  <!--<mwc-button icon="save" outlined dense class="light" label="save" style="align-self:center;margin-left:auto" @click=${(e)=>this.editNameHandler(humanNameDt)}></mwc-button>-->
                  <mwc-button icon="close" dense class="light" style="align-self:center;margin-left:auto" @click=${(e)=>this.cancelEditingNameHandler(currentHumanName)}></mwc-button>
                </span>
            </span>
            `);
           }
        }
      }
      // RENDER ROOT WC
        showAccordion=this.nameList.length>1 && this.showAllNames===true
      if(showAccordion){
        return html`<mwc-list-item style="font-family:Roboto;" accordion
          icon="supervised_user_circle">

      <span slot="primary-text" style="font-size:x-large">${accordionLabel}</span>
      <span slot="secondary-text" style="text-transform:capitalize">${accordionSubLabel}</span>
         <p slot="content" style="margin-left:16px;margin-right:16px">${items}</p>
      </mwc-list-item>`;
      }
      else{
        return html`<mwc-list-item style="font-family:Roboto;"
          icon="supervised_user_circle">

      <span slot="primary-text" style="font-size:x-large;">${accordionLabel}
      <!-- <mwc-button icon="add_box" dense class="light" style="align-self:center;margin-left:auto" @click=${(e)=>{this.nameList.push({given:[],family:"",use:"temp"});this.totalCount++;
      }}></mwc-button> -->
      </span>
      <span slot="secondary-text" style="text-transform:capitalize">${accordionSubLabel}</span>
         <p slot="content" style="margin-left:16px;margin-right:16px">${items}</p>
      </mwc-list-item>`;
      }


  }



  render(){
    this.totalCount=this.nameList.length;
    return html`
   <!-- template content -->
       ${this.renderListItemForHumanName}
  `;
  }
}


customElements.define('fhir-mwc-human-name-list-item', HumanNameListItem);



  /**
   * This method is the template logic to build the name use tab when there is more than only one humanName registered for the patient. Then call to render name to
   * use the HumanName template for the selected HumanNameDt.
   */
 /* get renderTabsForHumanName(){
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
/**
 * This method is the template logico to show patient humanName as a select
 * TODO: FINISH JOB
 */
 /* get renderSelectForHumanName(){
    console.log({showAllNames:this.showAllNames});
    console.log({patient:this.patient});
    if(this.showAllNames===true && this.patient.name.length>1){
      let items=[];
      for(let i=0;i<this.patient.name.length;i++){
        let icon=this.mapIconNameUse[this.patient.name[i].use];
        let humanNameDt=this.patient.name[i];
        let selectValue=this.patient.name[i].use;
        let selectLabel=this.patient.name[i].use;

         items.push(html`<mwc-list-item label="label" value="value" text="text" icon=${icon}
         @click=${(event)=> this.dispatchEvent(new CustomEvent(this.mapEvents.showHumanNameByUse.key
         ,{bubbles:this.mapEvents.showHumanNameByUse.bubbles
         ,composed:this.mapEvents.showHumanNameByUse.composed
         ,detail:{data:humanNameDt}}
         ))}><p slot="text">text</p>${selectLabel}</mwc-list-item>`);
      }

      return html`<mwc-select label="Patient names ..."><mwc-menu slot="menu">${items}</mwc-menu></mwc-select>`;
    }else{
      return html``;
    }
  }*/