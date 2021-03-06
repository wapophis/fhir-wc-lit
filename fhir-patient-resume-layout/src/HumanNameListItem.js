import { LitElement, html, css } from 'lit-element';
import { Layouts, Alignment } from 'lit-flexbox-literals';
export class HumanNameListItem extends LitElement {
  get TAG() {
    return "HumanNameListItem" + ":" + new Date();
  }
  static get properties() {
    return {
      /// RENDERED INFO
      nameList: { type: Array, hasChanged: (value, oldValue) => true },
      /// OPTIONS
      // NAME OPTIONS
      showAllNames: { type: Boolean },
      defaultNameUse: { type: String },
      hideDefault: { type: Boolean },
      // WC OPTIONS
      editable: { type: Boolean },
      showIcons: { type: Boolean },
      editableItemUse: { type: String },
      totalCount: { type: Number } // Total count of names present in the array.
    };
  }
  constructor() {
    // Always call super() first
    super();
    // Initialize properties
    console.log("CONSTRUCTOR OF HumaNameListItem");
    if (this.hideDefault === undefined) {
      this.hideDefault = false;
    }
    this.editableItemUse === undefined ? this.editableItemUse = null : '';
    // NAME USE ICON MAP
    // USE THIS ICON MAP TO MAP MATERIAL ICONS TO FHIR SUPPORTED USES FOR HUMANNAMEDT
    // TODO: SELECT ICONS.
    this.mapIconNameUse = {
      usual: "face",
      official: "verified_user",
      temp: "polymer",
      nickname: "polymer",
      anonymous: "voice_over_off",
      old: "event_seat",
      maiden: "pets"
    };
    // EVENTS MAP
    // USE THIS MAP TO MANTAIN CLEAR THE EVENTS AND THE BUBBLING OF THE COMPONENT IN AN ORDER MANNER FASHION. BELOW THE LISTENERS
    this.mapEvents = {
      loadStarted: {
        key: "load-started",
        bubbles: true,
        composed: true,
        details: { data: "datetime for example" }
      },
      loadCompleted: {
        key: "load-complete",
        bubbles: true,
        composed: true,
        details: { data: "Patient resource" }
      },
      showHumanNameByUse: {
        key: "human-name-use-selected",
        bubbles: true,
        composed: true,
        details: { data: "HumanNameDt expected" }
      },
      onEditName: {
        key: "onEditName",
        bubbles: false,
        composed: false,
        details: { data: "HumanNameDt expected" }
      },
      beforeEditName: {
        key: "beforeEditName",
        bubbles: true,
        composed: true,
        details: { data: "HumanNameDt expected" }
      },
      afterEditName: {
        key: "afterEditName",
        bubbles: true,
        composed: true,
        details: { data: "HumanNameDt expected" }
      },
      onRemoveName: {
        key: "onRemoveName",
        bubbles: false,
        composed: false,
        details: { data: "HumanNameDt removed expected" }
      }
    };
    this.addEventListener('human-name-use-selected', async (e) => {
      await this.requestUpdate();
    });
    this.addEventListener('load-complete', async (e) => {
      await this.requestUpdate();
    });
    /**
     * This listener launch the lifecycle to update and existing name.
     */
    this.addEventListener(this.mapEvents.onEditName.key, async (e) => {
      console.log({ TAG: this.TAG, msg: this.mapEvents.onEditName.key + "Listener", payload: e.detail.data });
      this.dispatchEvent(new CustomEvent(this.mapEvents.beforeEditName.key, {
        bubbles: this.mapEvents.beforeEditName.bubbles, composed: this.mapEvents.beforeEditName.composed,
        detail: { data: e.detail.data }
      }));
      await this.requestUpdate();
    });
    /**
     * This listener launch the lifecycle to update and existing name.
     */
    this.addEventListener(this.mapEvents.beforeEditName.key, async (e) => {
      console.log({ TAG: this.TAG, msg: this.mapEvents.beforeEditName.key + "Listener", payload: e.detail.data });
      this.editableItemUse = e.detail.data.use;
      this.dispatchEvent(new CustomEvent(this.mapEvents.afterEditName.key, {
        bubbles: this.mapEvents.afterEditName.bubbles, composed: this.mapEvents.afterEditName.composed,
        detail: { data: e.detail.data }
      }));
      await this.requestUpdate();
    });
    /**
   * This listener launch the lifecycle to update and existing name.
   */
    this.addEventListener(this.mapEvents.afterEditName.key, async (e) => {
      console.log({ TAG: this.TAG, msg: this.mapEvents.afterEditName.key + "Listener", payload: e.detail.data });
      //this.editableItemUse=null;
      await this.requestUpdate();
    });
  } // END OF THE CONSTRUCTOR
  /**
 *
 * @param {*} use type use for the human name dt.
 * It's launch event onEditName with humannamedt attached
 */
  editNameHandler(humanNameDt) {
    this.dispatchEvent(new CustomEvent(this.mapEvents.onEditName.key, {
      bubbles: this.mapEvents.onEditName.bubbles, composed: this.mapEvents.onEditName.composed,
      detail: { data: humanNameDt }
    }));
  }
  /**
   * It's stop the editing of the fields
   * @param {*} humanNameDt
   */
  cancelEditingNameHandler(humanNameDt) {
    this.editableItemUse = null;
  }
  /**
   * It's removes the item from the list, updating the date range accordly.
   * @param {*} index
   * @param {*} humanNameDt
   */
  removeNameHandler(index, humanNameDt) {
    console.log(humanNameDt);
    if (humanNameDt.period !== undefined) { // PROCESS PERIOD DATA
      if (humanNameDt.period.end === undefined) {
        humanNameDt.period.end = new Date();
      }
    }
    this.nameList.splice(index, 1);
    // Updates the defaultNameUse, this force ui update
    if (this.defaultNameUse === humanNameDt.use) {
      this.defaultNameUse = this.nameList[0].use;
    }
    this.totalCount--;
    this.dispatchEvent(new CustomEvent(this.mapEvents.onRemoveName.key, {
      bubbles: this.mapEvents.onRemoveName.bubbles,
      composed: this.mapEvents.onRemoveName.composed,
      detail: { data: humanNameDt }
    }));
  }
  /**
   * Method to update the humanNameDt provided in dest field
   * @param {*} dest HumanName
   * @param {*} field given (will be splitted by spaces)| family
   * @param {*} value value to set in the field.
   */
  updateNameHandler(dest, field, value) {
    if (field === "given") {
      dest[field] = value.split(" ");
    }
    if (field === "family") {
      dest[field] = value;
    }
  }
  updated(changedProperties) {
    console.log({ tag: this.TAG, function: "updated:changedProperties", args: changedProperties });
  }
  static get styles() {
    return [Layouts, Alignment,
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
  get renderListItemForHumanName() {
    console.log({ TAG: this.TAG, msg: "renderListItemForHumanName" });
    let showAccordion = false;
    let accordionLabel = null;
    let accordionSubLabel = null;
    let accordionIcon = null;
    let defaultNameIndex = 0;
    // Search for default name to show
    if (this.defaultNameUse !== undefined) {
      let useFound = false;
      for (let i = 0; i < this.nameList.length && useFound === false; i++) {
        if (this.nameList[i].use === this.defaultNameUse) {
          defaultNameIndex = i;
          useFound = true;
        }
      }
    }
    accordionLabel = (this.nameList[defaultNameIndex].given !== undefined ? " " + this.nameList[defaultNameIndex].given.join(" ") : '') + (this.nameList[defaultNameIndex].family !== undefined ? " " + this.nameList[defaultNameIndex].family : '');
    accordionSubLabel = this.nameList[defaultNameIndex].use;
    accordionIcon = this.mapIconNameUse[this.nameList[defaultNameIndex].use];
    // RENDER ITEMS
    //if(this.showAllNames===true && this.patient.name.length>1){
    let items = [];
    for (let i = 0; this.showAllNames === true && i < this.nameList.length; i++) {
      let icon = this.mapIconNameUse[this.nameList[i].use];
      let humanNameDt = this.nameList[i];
      let renderedName = (this.nameList[i].given !== undefined ? " " + this.nameList[i].given.join(" ") : '') + (this.nameList[i].family !== undefined ? " " + this.nameList[i].family : '');
      let renderedUse = humanNameDt.use;
      let isNoEditing = this.editable && this.editableItemUse !== humanNameDt.use;
      if (i !== defaultNameIndex || this.hideDefault === false) {
        if (isNoEditing === true) {
          items.push(html`
            <span class="layout horizontal wrap">
               <mwc-icon style="opacity:0.38; margin-right:32px;vertical-align:middle">${icon}</mwc-icon>
               <span class="layout vertical wrap" style="font-family:Roboto;" >
                 <span><span style="/*vertical-align: super;*/">${renderedName}</span></span>
                 <span style="text-transform: capitalize;opacity:0.36;font-size: smaller;align-self: flex-start;">${renderedUse}</span>
               </span>
               <span style="vertical-align:middle;margin-left:auto;align-self:flex-end">
               <span style="margin-left:auto">
               <mwc-button icon="edit" class="light" style="align-self:center;" @click=${(e) => this.editNameHandler(humanNameDt)}></mwc-button></span>
               <mwc-button icon="delete" dense class="light" style="align-self:center;" @click=${(e) => this.removeNameHandler(i, humanNameDt)}></mwc-button>
               </span>
            </span>
            `);
        }
        else {
          items.push(html`
            <span class="layout vertical wrap" style="font-family:Roboto;">
                <span class="layout horizontal wrap">
                <mwc-icon style="opacity:0.38; margin-right:32px;vertical-align:middle">${icon}</mwc-icon>
                <mwc-textfield label="Name Given" value=${humanNameDt.given.join(" ")}

                @blur=${(e) => this.editNameHandler(humanNameDt)}
                @input=${(e) => { console.log(e); this.updateNameHandler(humanNameDt, "given", e.target.value); }} ></mwc-textfield>
                <mwc-textfield label="Name Family" value=${humanNameDt.family} style="margin-left:56px"
                @blur=${(e) => this.editNameHandler(humanNameDt)}
                @input=${(e) => this.updateNameHandler(humanNameDt, "family", e.target.value)}></mwc-textfield>

                </span>
                <span style="text-transform: capitalize;opacity:0.36;font-size: smaller;align-self: flex-start;">${renderedUse}</span>
                <span class="layout horizontal" style="margin-bottom:24px">
                  <!--<mwc-button icon="save" outlined dense class="light" label="save" style="align-self:center;margin-left:auto" @click=${(e) => this.editNameHandler(humanNameDt)}></mwc-button>-->
                  <mwc-button icon="close" dense class="light" style="align-self:center;margin-left:auto" @click=${(e) => this.cancelEditingNameHandler(humanNameDt)}></mwc-button>
                </span>
            </span>
            `);
        }
      }
    }
    // RENDER ROOT WC
    showAccordion = this.nameList.length > 1 && this.showAllNames === true;
    if (showAccordion) {
      return html`<mwc-list-item style="font-family:Roboto;" accordion
          icon="supervised_user_circle">

      <span slot="primary-text" style="font-size:x-large">${accordionLabel}</span>
      <span slot="secondary-text" style="text-transform:capitalize">${accordionSubLabel}</span>
         <p slot="content" style="margin-left:16px;margin-right:16px">${items}</p>
      </mwc-list-item>`;
    }
    else {
      return html`<mwc-list-item style="font-family:Roboto;"
          icon="supervised_user_circle">

      <span slot="primary-text" style="font-size:x-large">${accordionLabel}
      <mwc-button icon="add_box" dense class="light" style="align-self:center;margin-left:auto" @click=${(e) => {
          this.nameList.push({ given: [], family: "", use: "temp" });
          this.totalCount++;
        }}></mwc-button>
      </span>
      <span slot="secondary-text" style="text-transform:capitalize">${accordionSubLabel}</span>
         <p slot="content" style="margin-left:16px;margin-right:16px">${items}</p>
      </mwc-list-item>`;
    }
  }
  render() {
    this.totalCount = this.nameList.length;
    return html`
   <!-- template content -->
       ${this.renderListItemForHumanName}
  `;
  }
}
