import React, { Component } from "react";
import { AppProperties } from "../AppProperties";
import axios from "axios";

export default class ExternalApi extends Component {
  state = {
    apiName: "",
    httpName: "",
    response: null,
    error: null,
    loca: AppProperties.loca,
    postBody: {},
  };

  constructor(apiName = null, httpName = null) {
    super();
    if (apiName != null && httpName != null) {
      this.state.apiName = apiName;
      this.state.httpName = httpName;
    } else if (apiName == null && httpName != null) {
      this.state.httpName = httpName;
    } else if (apiName != null && httpName == null) {
      this.state.apiName = apiName;
    }
  }

  getApiName() {
    return this.state.apiName;
  }

  setApiName(apiName) {
    this.state.apiName = apiName;
  }

  getHttpName() {
    return this.state.httpName;
  }

  setHttpName(httpName) {
    this.state.httpName = httpName;
  }

  setPostBody(key, value) {
    this.state.postBody = { ...this.state.postBody, [key]: value };
  }

  async call() {
    let tt = await axios
      .get(`${this.state.loca}/lom/external/api/${this.state.apiName}/${this.state.httpName}`, {
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

  async postCall() {
    console.log(this.state.postBody);

    let tt = await axios
      .post(`${this.state.loca}/lom/external/api/${this.state.apiName}/${this.state.httpName}`, this.state.postBody, {
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

  getResponse() {
    return this.state.response;
  }

  getError() {
    return this.state.error;
  }

  render() {
    return <div>Exrternal Api</div>;
  }
}
