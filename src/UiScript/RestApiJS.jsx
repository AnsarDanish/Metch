import axios from "axios";
import React, { Component } from "react";
import { AppProperties } from "../AppProperties";

export default class RestApi extends Component {
  state = {
    url: "",
    method: "",
    header: null,
    postBody: {},
    response: null,
    error: null,
    loca: AppProperties.loca,
    token: "",
    appCode: "",
  };

  constructor(url = null) {
    super();
    if (url != null) {
      this.state.url = url;
    }
    this.state.token = localStorage.getItem("autoToken");
  }

  getUrl() {
    return this.state.url;
  }

  setUrl(url) {
    this.state.url = url;
  }


  async call() {

    let tt = await axios
      .get(this.state.loca + "/api/" + this.state.url, {
        headers: {
          authorization: "Bearer " + this.state.token,
          "Content-Type": "application/json",
        },
      })
      .then(
        (res) => {
          if ("Error" in res.data) {
            this.state.error = res.data.Error;
          } else {
            this.state.response = res.data;
          }
          return;
        },
        (error) => {
          console.log(error);

          this.state.error = error;
          return;
        }
      );
  }

  async post() {
    console.log(this.state.url, this.state.postBody , this.state.appCode);

    let tt = await axios
      .post(this.state.loca + "/api/" + this.state.url, this.state.postBody, {
        headers: {
          authorization: "Bearer " + this.state.token,
          "Content-Type": "application/json",
          "Application": this.state.appCode,
        },
      })
      .then(
        (res) => {
          console.log(res);

          if ("Error" in res.data) {
            this.state.error = res.data.Error;
          } else {
            this.state.response = res.data;
          }
          return;
        },
        (error) => {
          console.log(error);

          this.state.error = error;
          return;
        }
      );
  }

  getResponse() {

    return this.state.response;
  }

  getError() {
    return this.state.error;
  }

  setPostBody(key, value) {
    this.state.postBody = { ...this.state.postBody, [key]: value };
  }

  setAppCode(appCode) {
    this.state.appCode = appCode;
  }

  render() {
    return <div> RestApi </div>;
  }
}
