import React, {
  Component,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { SMAYAContext } from "../Context";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ApForm from "../UiScript/ApForm";
import MayaAjax from "../UiScript/MayaAjax";

// import RestApi from "../UiScript/RestApiJS";
// import ExternalApiJS from "../UiScript/ExternalApiJS";

import Select from "react-select";
import Loader from "../Global/Loader";
import { ArrowLeft } from "lucide-react";
import { Button } from "react-bootstrap";
// import SearchNSelect from "./SearchNSelect";

const ExternalFormAdmission = () => {
  const { type } = useLocation().state || {};
  const [record, setRecord] = useState([]);
  const [formrecord, setFormRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page_error, setPage_error] = useState(false);
  const [error, setError] = useState();
  const [page_message, setpage_message] = useState(false);
  const [message, setMessage] = useState();
  const { loca, appcode, userInfo, token } = useContext(SMAYAContext);
  const [ap_form, setap_form] = useState();
  const [ap_user, setap_user] = useState();
  const [uiScript, setUiScript] = useState([]);
  // const [clientProp, setClientProp] = useState([]);
  const [searchParams] = useSearchParams();
  const tableName = "scm_admission_form";
  const cid = searchParams.get("cid");
  const title = searchParams.get("title");
  const navigate = useNavigate();
  useEffect(() => {
    getFormRecord();
  }, [tableName]);

  const editRecord = useLocation()?.state?.data || null;

  const getFormRecord = async () => {
    try {
      setLoading(true);

      // ------- MAIN API CALL -------
      const resp = await axios.get(`${loca}/lom/get/blankrecord/${tableName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mltpgrecord = resp.data;

      if ("Error" in mltpgrecord) {
        setPage_error(true);
        setError(mltpgrecord.Error);
        setLoading(false);
        return;
      }

      let mmm = mltpgrecord.formRecord[2].record;

      if (editRecord) {
        mmm = mmm.map((m) => ({
          ...m,
          value: editRecord[m.name] ?? m.value,
        }));

        mmm.forEach((m) => {
          mltpgrecord.formRecord[4].uiscript.forEach(
            ({ field, script, type }) => {
              if (
                field.name === m.name &&
                (type === "onchange" || type === "onchange_and_onload")
              ) {
                let fn = new Function(
                  ["ap_user", "ap_form", "val", "obj", "MayaAjax"],
                  script
                );

                fn(
                  ap_user,
                  new ApForm(mmm, setRecord, {}, null),
                  m.value,
                  m,
                  MayaAjax
                );
              }
            }
          );
        });
      }

      //for uiscripttt
      mltpgrecord.formRecord[4].uiscript.forEach(({ field, script, type }) => {
        if (type === "onload") {
          let fn = new Function(
            ["ap_user", "ap_form", "val", "obj", "MayaAjax"],
            script
          );

          fn(ap_user, new ApForm(mmm, setRecord, {}, null), "", "", MayaAjax);
        }
      });

      let script = mltpgrecord.formRecord[4].uiscript;

      mmm = mmm.map((item) => ({ ...item, verified: "initial" }));

      setUiScript(script);
      setRecord(mmm);
      setFormRecord(mltpgrecord);
      setap_form(new ApForm(mmm, setRecord, {}, null));

      //Client API
      // const res = await axios.get(`${loca}/api/get/clientProperties/${cid}`, {
      //   headers: {
      //     Application: appcode,
      //   },
      // });

      // let clientProp = res.data;
      // if (clientProp?.properties) {
      //   clientProp?.properties?.forEach((c) => {
      //     let r = mmm.find((f) => f.name.includes(c.name));
      //     if (r) {
      //       for (let key in r.uivalid) {
      //         if (c.hasOwnProperty(key) && r.uivalid[key] != c[key]) {
      //           r.uivalid[key] = c[key];
      //         }
      //       }
      //     }
      //   });
      //   setRecord([...mmm]);
      // } else {
      //   setRecord(mmm);
      // }
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
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
      if (vl === "" || vl == null) {
        return "initial";
      }
      return /[a-zA-Z0-9]/.test(vl) ? "verified" : "unverified";
    }

    if (type === "int") {
      if (/^(0|[1-9][0-9]*)$/.test(vl)) {
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

  const validationfn = (vl, index, fieldName) => {
    var formrecord = record;
    formrecord.forEach((field) => {
      if (field.name !== fieldName) return;

      const minLength = field?.uivalid?.min_length || 0;

      if (minLength !== 0 && vl.length < minLength) {
        field.verified = "unverified";
      } else {
        if (vl !== "") {
          field.verified = fieldverify(field.type, vl);
        } else {
          field.verified = "initial";
        }
      }
    });
    setRecord(formrecord);
  };

  const onChange = (func, val, obj) => {
    let fn = new Function(
      ["ap_user", "ap_form", "val", "obj", "MayaAjax"],
      func
    );
    fn(ap_user, ap_form, val, obj, MayaAjax);
  };

  const formChangefn = (vl, index, fieldName, obj) => {
    var frecord = record;

    frecord.forEach((field) => {
      if (field.name !== fieldName) return;

      if (field.type === "String" && vl !== "") {
        if (field.validation === "number") {
          if (/^[0-9]{0,10}$/.test(vl)) field.value = vl;
        } else if (field.validation === "character") {
          if (/^[a-zA-Z\s]+$/.test(vl)) field.value = vl;
        } else if (field.validation === "withoutSpecialCharacter") {
          if (/^[_A-z0-9\s]*((-|\s)*[_A-z0-9])*$/.test(vl)) field.value = vl;
        } else if (field.validation === "zipCode") {
          if (/^[0-9]{5}(?:-[0-9]{4})?$/.test(vl)) field.value = vl;
        } else if (field.validation === "decimal") {
          if (/^\d*\.?\d*$/.test(vl)) field.value = vl;
        } else if (field.validation === "ipAddress") {
          if (/((([0-9a-fA-F]){1,4}):){7}([0-9a-fA-F]){1,4}$/.test(vl))
            field.value = vl;
        } else {
          field.value = vl;
        }
      } else if (field.type === "table_lookup" && vl !== "None") {
        const lookup = field.lookup || [];
        const lookupItem = lookup.find((el) => el.value === vl);

        if (lookupItem && lookupItem.app_props) {
          const showPField = lookupItem.app_props.password === "manual";
          frecord.forEach((el) => {
            if (el.name === "password") {
              el.uivalid.visible = showPField ? "true" : "false";
            }
          });
        }

        field.value = vl;
      } else {
        field.value = vl;
      }
    });

    setRecord([...frecord]);

    uiScript.forEach(({ field, script, type }) => {
      if (
        field.name === fieldName &&
        (type === "onchange" || type === "onchange_and_onload")
      ) {
        onChange(script, vl, obj);
      }
    });
  };

  const submitFormRecord = () => {
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
            mandatory.push(rcd[i].label.name);
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
            unverified.push(rcd[i].label.name);
          }
        }
      }
    }

    if (mandatory.length === 0 && unverified.length === 0) {
      var frcd = formrecord;
      let client = record.find((c) => c.name === "cid_id");
      if (client) {
        client.value.id = cid;
      }

      // if (editRecord) {
      //   setRecord((prev) => [{ uni_id: editRecord.uni_id }, ...prev]);
      //   frcd.formRecord[2].record = record;
      // } else {
      // }
      frcd.formRecord[2].record = record;
      let url = `${loca}/lom/insert/record`;
      if (editRecord) {
        url = `${loca}/api/update/admission/form`;
      }
      setLoading(true);
      axios
        .post(url, editRecord ? { record, uni_id: editRecord.uni_id } : frcd, {
          headers: {
            authorization: "Bearer " + token,
            Application: appcode,
          },
        })
        .then((resp) => {
          var registerrcd = resp.data;
          if ("Error" in registerrcd) {
            setPage_error(true);
            setError(registerrcd.Error);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            setpage_message(true);
            setMessage(
              editRecord
                ? registerrcd.message
                : registerrcd.formRecord[3].message
            );
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });

            //paymentPAge
            navigate(
              editRecord
                ? `/admission/form/payment?rid=${editRecord.uni_id}&cid=${editRecord.cid_id.id}`
                : `/admission/form/payment?rid=${registerrcd.formRecord[2].record?.uni_id}&cid=${registerrcd.formRecord[2].record?.cid_id.id}`,
              {
                state: {
                  // amount: 100
                  description: "Admission Form Fee",
                },
              }
            );
          }
        });
    } else {
      setPage_error(true);
      setError(
        ` Check field :   ${mandatory.length === 0 ? unverified : mandatory} `
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveFormRecord = () => {
    let rcd = record;
    setError("");
    setPage_error(false);
    setMessage("");
    setpage_message(false);
    let unverified = [];
    for (var i = 0; i < rcd.length; i++) {
      if (rcd[i].uivalid.visible === "true") {
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
            unverified.push(rcd[i].label.name);
          }
        }
      }
    }

    if (unverified.length === 0) {
      let checkField = record
        .filter((f) => typeof f.value !== "object")
        .filter((f) => f.name !== "u_academic_year")
        .filter((f) => f.name !== "active")
        .some((r) => r.value !== "" && r.value !== "0");
      if (!checkField) {
        setPage_error(true);
        setError("At least one field is required to save this form.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        var frcd = formrecord;
        let client = record.find((c) => c.name === "cid_id");
        if (client) {
          client.value.id = cid;
        }
        frcd.formRecord[2].record = record;
        let url = `${loca}/lom/insert/record`;
        if (editRecord) {
          url = `${loca}/api/update/admission/form`;
        }
        // setLoading(true);
        axios
          .post(
            url,
            editRecord ? { record, uni_id: editRecord.uni_id } : frcd,
            {
              headers: {
                authorization: "Bearer " + token,
                Application: appcode,
              },
            }
          )
          .then((resp) => {
            var registerrcd = resp.data;
            if ("Error" in registerrcd) {
              setPage_error(true);
              setError(registerrcd.Error);
              setLoading(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setpage_message(true);
              setMessage(
                editRecord
                  ? registerrcd.message
                  : registerrcd.formRecord[3].message
              );
              setLoading(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                navigate(`/admission/process?userId=${userInfo.userId}`);
              }, 1000);
            }
          });
      }
    } else {
      setPage_error(true);
      setError(` Check field :  ${unverified} `);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className=" py-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-3 text-center text-dark">Admission Application</h1>
          <p className="text-center text-muted mb-4">
            Enter your details to apply for admission.
          </p>
          <div className="mb-4 d-flex align-items-center">
            <div className="d-flex align-items-center" style={{ gap: "2px" }}>
              <Button variant="link" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
                Change
              </Button>
            </div>

            <div
              className="text-center flex-grow-1 fw-semibold fs-5 text-decoration-underline"
              style={{ marginRight: "5rem" }}
            >
              {title}
            </div>
          </div>
          <div className="container">
            {loading === true || record.length === 0 ? (
              <Loader />
            ) : (
              <div
                className="row justify-content-center"
                // style={{ width: "600px" }}
              >
                {/* <div className="box-shadoww card p-2"> */}
                {/* <div>
            <i
              className="fa-solid fa-arrow-left ms-2 mt-2"
              style={{
                color: "gray",
                marginTop: "6px",
                marginRight: "4px",
                cursor: "pointer",
                fontSize: "20px",
              }}
            ><ArrowLeft className="mb-3 mt-0"/></i>
          </div> */}
                {/* <div>
              <div>{"Admission Application"}</div>
            </div> */}
                {page_error === true && (
                  <div className="px-2">
                    <div
                      className="alert alert-danger d-flex justify-content-between align-items-start mb-2"
                      role="alert"
                      style={{
                        maxWidth: "px",
                        padding: "0.5rem 0.5rem",
                        marginBottom: "0px",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setPage_error(false)}
                      ></button>
                    </div>
                  </div>
                )}
                {page_message === true && (
                  <div
                    className="alert alert-success d-flex justify-content-between align-items-start mb-2"
                    role="alert"
                    style={{
                      padding: "0.5rem 0.5rem",
                      marginBottom: "0px",
                    }}
                  >
                    {message}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setpage_message(false)}
                    ></button>
                  </div>
                )}
                <div className="row gx-3">
                  {[...record]
                    .sort(
                      (a, b) => Number(a.formView.pn) - Number(b.formView.pn)
                    )
                    .map(
                      (obj, index) =>
                        obj.uivalid.visible === "true" && (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="inppd h-100">
                              {obj.type === "String" ? (
                                <div className="col-md-6-group objpdg ">
                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="text-black fw-semibold mb-1">
                                      {obj.label.name}
                                    </span>
                                  </div>
                                  <input
                                    placeholder={obj.label.name}
                                    type={
                                      obj.validation === "number"
                                        ? "tel"
                                        : "text"
                                    }
                                    className="form-control inps-register"
                                    value={obj.value}
                                    disabled={obj.uivalid.read_only === "true"}
                                    maxLength={obj.uivalid.max_length}
                                    onChange={(e) => {
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      );
                                    }}
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                  ></input>
                                </div>
                              ) : null}

                              {obj.type === "int" ||
                              obj.type === "decimal" ||
                              obj.type === "long" ? (
                                <div className="form-group">
                                  {obj.verified === "unverified" && (
                                    <div
                                      className="alert alert-danger"
                                      role="alert"
                                      style={{
                                        padding: "0.2rem 0.2rem",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      {obj.type === "decimal"
                                        ? "Please verify your decimal number!"
                                        : "Please verify your integer number!"}
                                    </div>
                                  )}

                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="text-black fw-semibold mb-1">
                                      {obj.label.name}
                                    </span>
                                  </div>
                                  <input
                                    placeholder={obj.label.name}
                                    disabled={obj.uivalid.read_only === "true"}
                                    type="text"
                                    className={
                                      obj.verified === "unverified"
                                        ? "form-control formpadd_danger"
                                        : "form-control inps-register"
                                    }
                                    value={obj.value}
                                    maxLength={obj.uivalid.max_length}
                                    readOnly={obj.uivalid.read_only === "true"}
                                    onChange={(e) =>
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                  ></input>
                                </div>
                              ) : null}

                              {obj.type === "email" ? (
                                <div className=" emailpadd form-group">
                                  {obj.verified === "unverified" && (
                                    <div
                                      className="alert alert-danger"
                                      role="alert"
                                      style={{
                                        padding: "0.2rem 0.2rem",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      please verify your email
                                    </div>
                                  )}

                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="text-black fw-semibold mb-1">
                                      {obj.label.name}
                                    </span>
                                  </div>
                                  <input
                                    placeholder={obj.label.name}
                                    disabled={obj.uivalid.read_only === "true"}
                                    type="email"
                                    className={
                                      obj.verified === "unverified"
                                        ? "form-control formpadd_danger"
                                        : "form-control inps-register"
                                    }
                                    value={obj.value}
                                    maxLength={obj.uivalid.max_length}
                                    readOnly={obj.uivalid.read_only === "true"}
                                    onChange={(e) =>
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                  ></input>
                                </div>
                              ) : null}

                              {obj.type === "choice" ? (
                                <div className="form-group ">
                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="text-black fw-semibold mb-1">
                                      {obj.label.name}
                                    </span>
                                  </div>
                                  <select
                                    value={obj.value}
                                    className="form-control form-select inps-register "
                                    aria-label="Default select example"
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    onChange={(e) =>
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    maxLength={obj.uivalid.max_length}
                                    readOnly={obj.uivalid.read_only === "true"}
                                  >
                                    <option value="None">
                                      Select {obj.label.name}
                                    </option>
                                    {obj.choice.map(
                                      (ch, chi) =>
                                        ch.label !== "None" && (
                                          <option key={chi} value={ch.value}>
                                            {ch.label}
                                          </option>
                                        )
                                    )}
                                  </select>
                                </div>
                              ) : null}
                              {obj.type === "date" ? (
                                <div className=" form-group">
                                  {obj.verified === "unverified" && (
                                    <div
                                      className={
                                        obj.verified === "unverified"
                                          ? "form-control formpadd_danger"
                                          : "form-control inps-register"
                                      }
                                      role="alert"
                                      style={{
                                        padding: "0.2rem 0.2rem",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      please verify your date of birth!
                                    </div>
                                  )}
                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="text-black fw-semibold mb-1">
                                      {obj.label.name}
                                    </span>
                                  </div>
                                  <input
                                    type="date"
                                    className="form-control inps-register"
                                    value={obj.value}
                                    maxLength={obj.uivalid.max_length}
                                    readOnly={obj.uivalid.read_only === "true"}
                                    onChange={(e) =>
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                  ></input>
                                </div>
                              ) : null}
                              {obj.type === "boolean" ? (
                                <div
                                  className="form-check h-100 d-flex align-items-center justify-content-start mt-2"
                                  style={{ paddingLeft: "2px" }}
                                >
                                  <span className="text-black fw-semibold">
                                    {obj.label.name}
                                  </span>
                                  <input
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "2px",
                                      marginLeft: "4px",
                                    }}
                                    type="checkbox"
                                    className=""
                                    // className="form-control checkpadd"
                                    maxLength={obj.uivalid.max_length}
                                    value={obj.value === "true" ? true : false}
                                    readOnly={obj.uivalid.read_only === "true"}
                                    onChange={(e) =>
                                      formChangefn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                    onBlur={(e) =>
                                      validationfn(
                                        e.target.value,
                                        index,
                                        obj.name
                                      )
                                    }
                                  ></input>
                                </div>
                              ) : null}

                              {obj.type === "table_lookup" ? (
                                <div className="form-group ">
                                  <div className="d-flex align-items-center">
                                    {obj.uivalid.mandatory === "true" && (
                                      <i
                                        className={`fs-4 ${
                                          obj.value === ""
                                            ? "text-danger"
                                            : "text-muted"
                                        } `}
                                      >
                                        *
                                      </i>
                                    )}
                                    <span className="register-text">
                                      {obj.label.name.name}
                                    </span>
                                  </div>
                                  {/* <SearchNSelect
                              obj={obj}
                              formChangefn={formChangefn}
                              index={index}
                            /> */}
                                </div>
                              ) : null}
                              {/* {obj.type === "table_lookup" ? (
                          <div className="form-group ">
                            <div className="d-flex align-items-center">
                              {obj.uivalid.mandatory === "true" &&
                                obj.value !== "None" &&
                                obj.value !== "" && (
                                  <i className="fa fa-asterisk mndtryfalse me-1 mt-1"></i>
                                )}

                              {obj.uivalid.mandatory === "true" &&
                                (obj.value === "None" || obj.value === "") && (
                                  <i className="fa fa-asterisk mndtrytrue me-1"></i>
                                )}
                              <span className="register-text">{obj.label.name}</span>
                            </div>
                            <select
                              className="form-control form-select inps-register "
                              aria-label="Default select example"
                              onBlur={(e) =>
                                validationfn(e.target.value, index, obj.name)
                              }
                              onChange={(e) =>
                                formChangefn(e.target.value, index, obj.name)
                              }
                              maxLength={obj.uivalid.max_length}
                              readOnly={obj.uivalid.read_only === "true"}
                              value={obj.value}
                            >
                              <option value="None">None</option>
                              {obj.lookup
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((ch, chi) => (
                                  <option key={chi} value={ch.value}>
                                    {ch.value}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ) : null} */}
                            </div>
                          </div>
                        )
                    )}
                </div>
                <div className="d-flex justify-content-between  align-items-center text-center gap-2 my-3">
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={saveFormRecord}
                    title="Save Record"
                  >
                    {editRecord ? "Save Tentative" : "Save Tentative"}
                  </Button>

                  <Button
                    className="w-100"
                    onClick={submitFormRecord}
                    title="Submit Record"
                  >
                    {editRecord ? "Submit" : "Submit"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExternalFormAdmission;
