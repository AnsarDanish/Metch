import React, { Component } from "react";
import axios from "axios";

import { AppProperties } from "../../AppProperties";

export class MayaAjax extends Component {
  state = {
    scriptIncludeName: "",
    req: [],
    res: [],
    loca: AppProperties.loca,
  };
  rqq = [];
  token = localStorage.getItem("scmtoken");

  constructor(scriptIncludeName) {
    super(scriptIncludeName);
    this.state.scriptIncludeName = scriptIncludeName;
  }

  addParam = (key, value) => {
    // let rq=this.state.req;
    this.rqq.push({ key: key, value: value });
  };

  callAsync = (callBack) => {
    let obj = {
      request: this.rqq,
      scriptIncludeName: this.state.scriptIncludeName,
    };
    if (this.token) {
      axios
        .post(this.state.loca + "/lom/maya/ajax", obj, {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          let response = res.data;
          callBack(response);
        })
        .catch((err) => {});
    }
  };

  printPostBody = (inp) => {
    let obj = {
      request: this.rqq,
      scriptIncludeName: this.state.scriptIncludeName,
    };
  };
  // sync way
  callSync = () => {
    let obj = {
      request: this.rqq,
      scriptIncludeName: this.state.scriptIncludeName,
    };
    let lock = true;
    let res = {};
    if (this.token) {
      // axios.post( this.state.loca +
      //   "/lom/maya/ajax" ,
      //   obj,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       authorization: "Bearer " + this.token,
      //     },
      //   }).then((response)=>{
      //     console.log("res came ",response.data);

      //     res= response.data;
      //     lock=false;
      //   }).catch(()=>{
      //      lock=false;
      //   })
      // it wil wait for result;
      // while(lock)
      // {

      // }
      //  return  res;

      let url = this.state.loca + "/lom/maya/ajax";

      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, false); // false makes it synchronous
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
      xhr.send(JSON.stringify(obj));
      if (xhr.status === 200) {
        return xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } else {
        throw new Error(`Request failed with status: ${xhr.status}`);
      }
    }
  };

  apiRequest = (callBack) => {
    let obj = {
      request: this.rqq,
      scriptIncludeName: this.state.scriptIncludeName,
    };
    var token = localStorage.getItem("token");

    if (token) {
      axios
        .post(this.state.loca + "/lom/maya/ajax", obj, {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          let response = res.data;
          if (callBack) callBack(response);
        })
        .catch((err) => {});
    }
  };

  redirectOnUI = (callBack) => {
    callBack();
  };

  render() {
    return <div>ApUser</div>;
  }
}

export default MayaAjax;
