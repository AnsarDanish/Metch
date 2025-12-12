import React, { Component, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
// import ExternalApiJS from "../HelperClasses/ExternalApiJS";
// import ApForm from "../HelperClasses/ApForm";
// import RestApi from "../HelperClasses/RestApiJS";
import Select from "react-select";
import { SMAYAContext } from "../SMAYAContext";
import { SMAYAContext } from "../Context";
// import SearchNSelect from "./SearchNSelect";

const ExternalForm = ({ tableName }) => {
  const { token, loca, servemayaUrl } = useContext(SMAYAContext);
  const { type } = useLocation().state || {};
  const [record, setRecord] = useState([]);
  const [formrecord, setFormRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page_error, setPage_error] = useState(false);
  const [error, setError] = useState();
  const [page_message, setpage_message] = useState(false);
  const [message, setMessage] = useState();
  const [ap_form, setap_form] = useState();
  const [ap_user, setap_user] = useState();
  const [uiScript, setUiScript] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    getFormRecord();
  }, [tableName]);

  const logincall = () => {
    navigation("/login");
  };

  const getFormRecord = () => {
    setLoading(true);
    axios

      .get(`${loca}/lom/external/${tableName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const mltpgrecord = resp.data;
        console.log(mltpgrecord);

        if ("Error" in mltpgrecord) {
          setLoading(false);
          setPage_error(true);
          setError(mltpgrecord.Error);
        } else {
          var mmm = mltpgrecord.formRecord[2].record;
          var script = mltpgrecord.formRecord[3].uiscript;
          for (var i = 0; i < mmm.length; i++) {
            mmm[i].verified = "initial";
          }
          setLoading(false);
          setUiScript(script);
          setRecord(mmm);
          setFormRecord(mltpgrecord);

          // setap_form(new ApForm(mmm, setRecord, {}, null));
        }
        setLoading(false);
      });
  };

  const fieldverify = (type, vl) => {
    if (type === "email") {
      if (/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(vl)) {
        return "verified";
      } else {
        return "unverified";
      }
    }
    if (type === "String") {
      if (/[a-zA-Z0-9]/g.test(vl)) {
        return "verified";
      } else {
        return "unverified";
      }
    }

    if (type === "int") {
      if (/^[0-9]*[1-9][0-9]*$/.test(vl)) {
        return "verified";
      } else {
        return "unverified";
      }
    }
    if (type === "decimal") {
      // Regex: optional digits before decimal, decimal point, at least one digit after
      if (/^[0-9]+(\.[0-9]+)?$/.test(vl)) {
        return "verified";
      } else {
        return "unverified";
      }
    }
    if (type === "choice" || type === "table_lookup") {
      if (vl !== "None") {
        return "verified";
      } else {
        return "unverified";
      }
    }
    if (type === "date") {
      return "verified";
    }
  };

  const validationfn = (vl, index, ob) => {
    var formrecord = record;
    var minLength = formrecord[index].uivalid.min_length;
    if (minLength !== 0 && vl.length < minLength) {
      formrecord[index].verified = "unverified";
    } else {
      if (formrecord[index].name === ob) {
        if (vl !== "") {
          formrecord[index].verified = fieldverify(formrecord[index].type, vl);
        } else {
          formrecord[index].verified = "initial";
        }
      }
    }
    setRecord(formrecord);
  };

  const onChange = (func, val, obj) => {
    let fn = new Function(
      ["ap_user", "ap_form", "val", "obj", "ExternalApiJS", "RestApi"],
      func
    );
    fn(ap_user, ap_form, val, obj, ExternalApiJS, RestApi);
  };

  const formChangefn = (vl, index, ob, obj) => {
    setError("");
    setPage_error(false);
    setMessage("");
    setpage_message(false);

    var frecord = record;
    /* if (frecord[index].name === ob) {
      frecord[index].value = vl;
    }
    setRecord([...frecord]); */
    if (frecord[index].name === ob) {
      if (frecord[index].type === "String" && vl !== "") {
        if (frecord[index].validation === "number") {
          if (/^[0-9]*$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
          }
        } else if (frecord[index].validation === "character") {
          if (/^[a-zA-Z\s]+$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
          }
        } else if (frecord[index].validation === "withoutSpecialCharacter") {
          if (/^[_A-z0-9\s]*((-|\s)*[_A-z0-9])*$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
          }
        } else if (frecord[index].validation === "zipCode") {
          if (/^[0-9]{5}(?:-[0-9]{4})?$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
          }
        } else if (frecord[index].validation === "decimal") {
          if (/^\d*\.?\d*$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
          }
        } else if (frecord[index].validation === "ipAddress") {
          if (/((([0-9a-fA-F]){1,4})\\:){7}([0-9a-fA-F]){1,4}$/.test(vl)) {
            frecord[index].value = vl;
            setRecord([...frecord]);
            //Ipv4 = (([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])
            //Ipv6 = ((([0-9a-fA-F]){1,4})\\:){7}([0-9a-fA-F]){1,4}
          }
        } else {
          // if (/^[a-zA-Z0-9_\s]*$/.test(vl)) {
          frecord[index].value = vl;
          setRecord([...frecord]);
          // }
        }
      } else if (frecord[index].type === "table_lookup" && vl != "None") {
        let lookup = frecord[index].lookup;
        let lookupIndex = -1;
        for (let p = 0; p < lookup.length; p++) {
          const element = lookup[p];

          if (element.value === vl) {
            lookupIndex = p;
            break;
          }
        }

        if ("app_props" in frecord[index].lookup[lookupIndex]) {
          let showPField =
            frecord[index].lookup[lookupIndex].app_props.password === "manual";
          for (let k = 0; k < frecord.length; k++) {
            const element = frecord[k];
            if (element.name === "password") {
              if (showPField) {
                element.uivalid.visible = "true";
              } else {
                element.uivalid.visible = "false";
              }
            }
          }
        }
        frecord[index].value = vl;
        setRecord([...frecord]);
      } else {
        frecord[index].value = vl;
        setRecord([...frecord]);
      }
    }

    for (let i = 0; i < uiScript.length; i++) {
      let field = uiScript[i].field.name;
      let func = uiScript[i].script;
      let type = uiScript[i].type;
      if (field === ob && type === "onchange") {
        onChange(func, vl, obj);
      }
    }
  };

  const saveFormRecord = () => {
    var rcd = record;
    setError("");
    setPage_error(false);
    setMessage("");
    setpage_message(false);
    var mandatory = [];
    var unverified = [];
    for (var i = 0; i < rcd.length; i++) {
      if (rcd[i].uivalid.visible === "true") {
        if (rcd[i].uivalid.mandatory === "true") {
          if (rcd[i].value === "" || rcd[i].value === "None") {
            mandatory.push(rcd[i].name);
          }
        }
        if (
          rcd[i].type === "int" ||
          rcd[i].type === "long" ||
          rcd[i].type === "decimal" ||
          rcd[i].type === "String" ||
          (rcd[i].type === "email" && rcd[i].value) ||
          (rcd[i].type === "date" && rcd[i].value)
        ) {
          var veri = fieldverify(rcd[i].type, rcd[i].value);
          if (veri === "unverified") {
            unverified.push(rcd[i].name);
          }
        }
      }
    }
    if (mandatory.length === 0 && unverified.length === 0) {
      var frcd = formrecord;
      frcd.formRecord[2].record = record;

      setLoading(true);
      axios
        .post(loca + "/lom/create/externalrecord", frcd, {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          var registerrcd = resp.data;
          console.log("registerrcd ", registerrcd);

          if ("Error" in registerrcd) {
            setPage_error(true);
            setError(registerrcd.Error);
            setLoading(false);
          } else {
            setpage_message(true);
            // setMessage(registerrcd.formRecord[2].message); 
            setMessage("Turf registration successful! Please review and configure all turf-related information in Servemaya.")
            setLoading(false);
            // handleSubmit();
          }
        });
    } else {
      setPage_error(true);
      setError(" Check Mandatory fields not set:" + mandatory);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  };

   const handleSubmit = () => {
    window.open(servemayaUrl, "_blank")
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {loading === true ? (
        <></>
      ) : (
        <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Turf Registration Form
          </h2>

          <div className="space-y-6">
            {/* Error & Success Messages */}
            {page_error && (
              <div className="bg-red-100 text-black-700 text-sm rounded p-1 mb-1 break-words">
                {error}
              </div>
            )}
            {page_message && (
              <div className="bg-green-100 text-black-700 text-sm rounded p-1 mb-1">
                {message}
              </div>
            )}
            
            {record.length === 0 && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {record.map(
              (obj, index) =>
                obj.uivalid.visible === "true" && (
                  <div key={index} className="w-full">
                    {/* String */}
                    {obj.type === "String" && (
                      <div>
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            obj.value === "" && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                          value={obj.value}
                          maxLength={obj.uivalid.max_length}
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                        />
                      </div>
                    )}

                    {(obj.type === "int" ||
                      obj.type === "decimal" ||
                      obj.type === "long") && (
                      <div>
                        {obj.verified === "unverified" && (
                          <div className="bg-red-100 text-red-600 text-xs rounded p-1 mb-1">
                            {obj.type === "decimal"
                              ? "Please verify your decimal number!"
                              : "Please verify your integer number!"}
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            obj.value === "" && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <input
                          type="text"
                          className={`w-full rounded-md px-3 py-2 text-base border ${
                            obj.verified === "unverified"
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          } outline-none`}
                          // className={`w-full rounded px-2 py-1 text-sm ${
                          //   obj.verified === "unverified"
                          //     ? "border border-red-400 bg-red-50"
                          //     : "border focus:ring focus:ring-blue-300"
                          // }`}
                          value={obj.value}
                          maxLength={obj.uivalid.max_length}
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                        />
                      </div>
                    )}

                    {/* Email */}
                    {obj.type === "email" && (
                      <div>
                        {obj.verified === "unverified" && (
                          <div className="bg-red-100 text-red-600 text-xs rounded p-1 mb-1">
                            please verify your email
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            obj.value === "" && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <input
                          type="email"
                          // className={`w-full rounded px-2 py-1 text-sm ${
                          //   obj.verified === "unverified"
                          //     ? "border border-red-400 bg-red-50"
                          //     : "border focus:ring focus:ring-blue-300"
                          // }`}
                          className={`w-full rounded-md px-3 py-2 text-base border ${
                            obj.verified === "unverified"
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          } outline-none`}
                          value={obj.value}
                          maxLength={obj.uivalid.max_length}
                          readOnly={obj.uivalid.read_only === "true"}
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                        />
                      </div>
                    )}

                    {/* Choice */}
                    {obj.type === "choice" && (
                      <div>
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "None" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            (obj.value === "None" || obj.value === "") && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <select
                          value={obj.value}
                          // className="w-full border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-300"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          maxLength={obj.uivalid.max_length}
                          readOnly={obj.uivalid.read_only === "true"}
                        >
                          <option value="None">None</option>
                          {obj.choice.map((ch, chi) => (
                            <option key={chi} value={ch.value}>
                              {ch.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Date */}
                    {obj.type === "date" && (
                      <div>
                        {obj.verified === "unverified" && (
                          <div className="bg-red-100 text-red-600 text-xs rounded p-1 mb-1">
                            please verify your date of birth!
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            obj.value === "" && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <input
                          type="date"
                          // className="w-full border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-300"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                          value={obj.value}
                          maxLength={obj.uivalid.max_length}
                          readOnly={obj.uivalid.read_only === "true"}
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                        />
                      </div>
                    )}

                    {/* Boolean */}
                    {obj.type === "boolean" && (
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          {obj.label}
                        </span>
                        <input
                          type="checkbox"
                          // className="w-4 h-4 border rounded"
                          className="w-5 h-5 accent-green-600"
                          checked={obj.value === "true"}
                          readOnly={obj.uivalid.read_only === "true"}
                          onChange={(e) =>
                            formChangefn(e.target.checked, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.checked, index, obj.name)
                          }
                        />
                      </div>
                    )}

                    {obj.type === "long_description" && (
                      <div>
                        <div className="flex items-center space-x-1">
                          {obj.uivalid.mandatory === "true" &&
                            obj.value !== "" && (
                              <i className="fa fa-asterisk text-gray-400 text-[10px]"></i>
                            )}
                          {obj.uivalid.mandatory === "true" &&
                            obj.value === "" && (
                              <i className="fa fa-asterisk text-red-500 text-[10px]"></i>
                            )}
                          <span className="text-sm font-medium text-gray-700">
                            {obj.label}
                          </span>
                        </div>
                        <textarea
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                          value={obj.value}
                          maxLength={obj.uivalid.max_length}
                          onChange={(e) =>
                            formChangefn(e.target.value, index, obj.name)
                          }
                          onBlur={(e) =>
                            validationfn(e.target.value, index, obj.name)
                          }
                        />
                      </div>
                    )}
                  </div>
                )
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center mt-10">
            <button
              onClick={saveFormRecord}
              className="cursor-pointer bg-accent-500 text-white font-semibold py-3 px-12 rounded-md shadow-sm transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ExternalForm;
