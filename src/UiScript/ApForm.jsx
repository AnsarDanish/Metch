import React, { Component } from "react";

export class ApForm extends Component {
  state = {
    record: [],
    sr: null,
    tabRelation: {},
    setTabRelation: null,
    setVerifyError: null,
    jsonArray: [],
  };

  constructor(
    record,
    setRecord,
    tabRelation,
    setTabRelation,
    setVerifyError,
    jsonArray
  ) {
    super(record);
    this.state.record = record;
    this.state.sr = setRecord;
    this.state.tabRelation = tabRelation;
    this.state.setTabRelation = setTabRelation;
    this.state.setVerifyError = setVerifyError;
    this.state.jsonArray = jsonArray;
  }

  getShowAllValue() {
    if (this.state.tabRelation?.showAll === "true") return true;
    else if (this.state.tabRelation?.showAll === "false") return false;

    return false;
  }
  getApplicationName() {
    if (
      Array.isArray(this.state.jsonArray) &&
      this.state.jsonArray.length > 2 &&
      this.state.jsonArray[0]?.application?.name
    ) {
      return this.state.jsonArray[0]?.application?.name;
    }

    return "";
  }

  getApplicationId() {
    if (
      Array.isArray(this.state.jsonArray) &&
      this.state.jsonArray.length > 2 &&
      this.state.jsonArray[0]?.application?.id
    ) {
      return this.state.jsonArray[0]?.application?.id;
    }
    return "";
  }

  getTableName() {
    if (
      Array.isArray(this.state.jsonArray) &&
      this.state.jsonArray.length > 2 &&
      this.state.jsonArray[0]?.table?.name
    ) {
      return this.state.jsonArray[0]?.table?.name;
    }
    return "";
  }

  getTableId() {
    if (
      Array.isArray(this.state.jsonArray) &&
      this.state.jsonArray.length > 2 &&
      this.state.jsonArray[0]?.table?.id
    ) {
      return this.state.jsonArray[0]?.table?.id;
    }
    return "";
  }

  getFieldValue(name) {
    const frecord = this.state.record;

    for (let i = 0; i < frecord.length; i++) {
      if (frecord[i].name === name) {
        return frecord[i].value;
      }
    }
  }

  setFieldValue(name, value) {

    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].type === "dynamic_key_value") {
        if (frecord[i].name === name) {
          frecord[i].value = JSON.parse(value);
          this.state.sr([...frecord]);
        }
      } else {
        if (frecord[i].name === name) {
          frecord[i].value = String(value);
          this.state.sr([...frecord]);
        }
      }
    }
  }

  setFieldValue(name, value, id) {
    const frecord = this.state.record;

    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].type === "reference") {
        if (frecord[i].name === name) {
          frecord[i].value.name = value;
          if (!id) {
            frecord[i].value.id = "0";
          } else {
            frecord[i].value.id = id;
          }
          // this.state.sr([...frecord]);
        }
      } else if (frecord[i].type === "dynamic_key_value") {
        if (frecord[i].name === name) {
          frecord[i].value = JSON.parse(value);
          // this.state.sr([...frecord]);
        }
      } else {
        if (frecord[i].name === name) {
          frecord[i].value = value;
          this.state.sr([...frecord]);
        }
      }
    }
  }

  setFieldLabel(name, label) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name) {
        frecord[i].label.name = label;
        this.state.sr([...frecord]);
      }
    }
  }

  getFieldType(name) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (frecord[i].name === name) {
        return frecord[i].type;
      }
    }
  }

  setFieldType(name, type) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }

      if (type === "multi_select" || type === "reference") {
        break;
      }
      if (frecord[i].name === name) {
        frecord[i].type = type;
        if (type === "dynamic_key_value") {
          let str = frecord[i].value;
          let startChar = str.charAt(0);
          let endChar = str.charAt(str.length - 1);
          if (startChar === "[" && endChar === "]") {
            frecord[i].value = JSON.parse(frecord[i].value);
          } else {
            frecord[i].value = [{}];
          }
        }

        this.state.sr([...frecord]);
      }
    }
  }

  setMandatory(name, value) {
    const frecord = this.state.record;
    if (typeof value === "boolean") {
      if (value) value = "true";
      else value = "false";
    }
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name) {
        frecord[i].uivalid.mandatory = value;
        // for choice type which do not have none in choice array, mandatory should be false for that field
        if (frecord[i]?.type === "choice") {
          if (
            frecord[i]?.choice[0]?.name !== "none" &&
            frecord[i]?.choice[0]?.name !== ""
          ) {
            frecord[i].uivalid.mandatory = "false";
          }
        }
        this.state.sr([...frecord]);
      }
    }
  }

  isMandatory(name) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name) {
        let val = frecord[i].uivalid.mandatory;
        if (val === "true") {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  setReadOnly(name, value) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name) {
        frecord[i].uivalid.read_only = value;
        this.state.sr([...frecord]);
      }
    }
  }

  setVisible(name, value) {

    if (typeof value === "boolean") {
      if (value) value = "true";
      else value = "false";
    }
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].formView.in_view === "true") {
        if (frecord[i].name === name) {
          frecord[i].uivalid.visible = value;
          let type = frecord[i].type;
          if (value === "false") {
            if (type === "filter") {
              this.setFieldValue(name, {
                filter: [
                  {
                    co: "",
                    cl: "",
                    mc: "",
                    an: "",
                    ct: "",
                    af: "",
                    rf: { id: "", value: "" },
                    dc: { id: "", value: "" },
                    ch: [],
                  },
                ],
                timeline: "",
              });
            } else if (type === "depend_table") {
              this.setFieldValue(name, { name: "", id: "0" });
            } else if (type === "boolean") {
              this.setFieldValue(name, "false");
            } else if (type === "dynamic_key_value") {
              this.setFieldValue(name, "[{}]");
            } else {
              this.setFieldValue(name, "");
            }
          }
          this.state.sr([...frecord]);
        }
      }
    }
  }

  setFilter(value, field, op) {
    const frecord = this.state.record;
    let filt = "";
    for (let i = 0; i < frecord.length; i++) {
      if (frecord[i].name === field) {
        let type = frecord[i].type;
        let label = frecord[i].label;

        filt =
          '{"co": "' +
          field +
          '", "cl": "' +
          label +
          '", "mc": "' +
          op +
          '","ct": "' +
          type +
          '","af": ""';
        if (type === "reference") {
          filt +=
            ',"an": ""' +
            ',"rf": { "id": "' +
            value.id +
            '", "value": "' +
            value.name +
            '" }}';
        } else {
          filt += ',"an": "' + value + ',"rf": { "id": "", "value": "" }}';
        }
        break;
      }
    }
    return JSON.parse(filt);
  }

  addOption(value, label, name) {
    const frecord = this.state.record;

    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }

      if (frecord[i].name === name && frecord[i].type === "choice") {
        frecord[i].choice.push({ name: value, label: label });
        this.state.sr([...frecord]);
        break;
      }
    }
  }

  removeOption(label, name) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name && frecord[i].type === "choice") {
        for (let j = 0; j < frecord[i].choice.length; j++) {
          if (frecord[i].choice[j].label === label) {
            frecord[i].choice.splice(j, 1);
            this.state.sr([...frecord]);
            break;
          }
        }
        break;
      }
    }
  }

  removeAllOption(name) {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "uni_id" ||
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name && frecord[i].type === "choice") {
        frecord[i].choice = [];
        this.state.sr([...frecord]);
        break;
      }
    }
  }

  setRelationListVisible(name, visible) {
    const frecord = this.state.tabRelation;
    if (frecord) {
      if ("relation" in frecord) {
        for (let i = 0; i < frecord.relation.length; i++) {
          if (
            name === "uni_id" ||
            name === "id" ||
            name === "created" ||
            name === "created_by" ||
            name === "updated" ||
            name === "updated_by"
          ) {
            break;
          }
          let tabName = frecord.relation[i].formRecordList[1].table.name;

          if (tabName === name) {
            frecord.relation[i].visible = visible;
          }
        }
        this.state.setTabRelation({ ...frecord });
      }
    }
  }

  setVerifyError(verified, name, error_String = "") {
    const frecord = this.state.record;
    for (let i = 0; i < frecord.length; i++) {
      if (
        name === "id" ||
        name === "created" ||
        name === "created_by" ||
        name === "updated" ||
        name === "updated_by"
      ) {
        break;
      }
      if (frecord[i].name === name) {
        frecord[i].verified = verified === "true" ? "verified" : "unverified";
        this.state.sr([...frecord]);
        this.state.setVerifyError(error_String);
        break;
      }
    }
  }

  render() {
    return <div>ApForm</div>;
  }
}

export default ApForm;
