import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  Asterisk,
  Calendar1Icon,
  CalendarCheck,
  Eye,
  EyeOff,
  GalleryVerticalEnd,
  IdCard,
  ListOrdered,
  Lock,
  LockIcon,
  Mail,
  School,
  School2Icon,
  Text,
  University,
  User,
  X,
} from "lucide-react";

import { ChevronDownIcon } from "lucide-react";
import Select from "react-select";

import image from "../assets/image.png";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SMAYAContext } from "../Context";

import { format } from "date-fns";
// import ApForm from "../UiScript/ApForm";

import Loader from "../Global/Loader";
import { useLocation } from "react-router-dom";
import { object } from "zod/v3";
import ApForm from "../UiScript/ApForm";

export default function AdmissionPage() {
  const [showError, setShowError] = useState(false);
  // const [isPending, setIsPending] = useState(false);
  const [rcd, setRcd] = useState([]);
  const [script, setScript] = useState([]);
  const [apForm, setApForm] = useState();
  const [clientProp, setClientProp] = useState([]);
  const [school, setSchool] = useState([]);
  const [name, setName] = useState(null);
  const [show, setShow] = useState(false);
  const [cid, setCid] = useState(null);
  const [allSet, setAllSet] = useState(false);

  const { loca, appcode, token } = useContext(SMAYAContext);

  function buildSchema(fields) {
    const shape = {};
    fields.forEach((field) => {
      const isVisible = field.uivalid.visible === "true";
      if (isVisible) {
        const isMandatory = field.uivalid.mandatory === "true";
        const isReadOnly = field.uivalid.read_only === "true";
        let validator;
        switch (field.type) {
          case "String":

          case "choice":
          case "int":
          case "decimal":
          case "long":
          case "date":
          case "boolean":
            if (isReadOnly) {
              validator = z.preprocess((val) => {
                return String(val);
              }, z.string().optional());
            } else if (isMandatory) {
              validator = z.string().nonempty(`${field.label} is required`);
            } else {
              validator = z.string().optional();
            }

            if (
              field.name.trim().toLowerCase().includes("mobile") ||
              field.name.trim().toLowerCase().includes("contact") ||
              field.name.trim().toLowerCase().includes("phone")
            ) {
              validator = isMandatory
                ? z
                    .string()
                    .nonempty(`${field.label} is required`)
                    .regex(/^[0-9]+$/, {
                      message: `${field.label} must contain only digits`,
                    })
                    .min(10, {
                      message: `${field.label} must be at least 10 digits`,
                    })
                : z.union([
                    z.literal(""),
                    z
                      .string()
                      .regex(/^[0-9]+$/, {
                        message: `${field.label} must contain only digits`,
                      })
                      .min(10, {
                        message: `${field.label} must be at least 10 digits`,
                      })

                      .optional(),
                  ]);
            }
            break;

          case "email":
            validator = isMandatory
              ? z
                  .string()
                  .nonempty(`${field.label} is required`)
                  .email(`Enter valid ${field.label}`)
              : z.union([
                  z.literal(""),
                  z.email(`Enter valid ${field.label}`).optional(),
                ]);
            break;

          default:
            return;
        }

        shape[field.name] = validator;
      }
    });
    return z.object(shape);
  }

  const { data } = useQuery({
    queryKey: ["admissionRecord"],
    queryFn: () =>
      axios.get(`${loca}/lom/external/scm_admission_form`).then((res) => {
        if ("Error" in res.data) {
          throw new Error();
        }

        setRcd(res.data.formRecord[2].record);
        setScript(res.data.formRecord[3].uiscript);
        setApForm(new ApForm(res.data.formRecord[2].record, setRcd, {}, null));

        return res.data;
      }),
    enabled: !!cid,
    refetchOnWindowFocus: false,

    // staleTime: 5 * 60 * 1000,
  });

  const getSchool = useQuery({
    queryKey: ["school"],
    queryFn: () =>
      axios
        .get(`${loca}/api/get/schools`, {
          headers: {
            // authorization: "Bearer " + token,
            Application: appcode,
          },
        })
        .then((res) => {
          setSchool(res.data.record);
          return res.data;
        }),
    enabled: !cid,
  });

  const clientData = useQuery({
    queryKey: ["props"],
    queryFn: () =>
      axios
        .get(`${loca}/api/get/clientProperties/${cid}`, {
          headers: {
            // authorization: "Bearer " + token,
            Application: appcode,
          },
        })
        .then((res) => {
          setClientProp(res.data);
          return res.data;
        }),
    enabled: !!cid,
  });

  //set Client popertiees
  useEffect(() => {
    if (clientProp.length === 0) return;
    clientProp?.properties?.forEach((c) => {
      let r = rcd.find((f) => f.name === c.name);
      if (r) {
        for (let key in r.uivalid) {
          if (c.hasOwnProperty(key) && r.uivalid[key] != c[key]) {
            r.uivalid[key] = c[key];
          }
        }
      }
    });
    setRcd([...rcd]);
    setAllSet(true);
  }, [clientProp]);

  const signupSchema = useMemo(() => {
    if (allSet) {
      return buildSchema(rcd);
    }
    return z.object({}); // fallback empty schema
  }, [allSet, rcd]);

  const defaultValues = useMemo(() => {
    if (allSet) {
      return rcd.reduce((obj, field) => {
        obj[field.name] = field.value || "";
        return obj;
      }, {});
    }
  }, [allSet, rcd]);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  useEffect(() => {
    if (allSet) {
      form.reset(defaultValues, {});
    }
  }, [allSet, defaultValues]);

  const onChange = (func, val, name) => {
    if (!rcd) return;

    let fn = new Function(["ap_user", "ap_form", "val", "name"], func);
    fn(null, apForm, val, name);
  };

  const handleChange = (value, name) => {
    rcd.forEach((r) => {
      if (r.name === name) {
        r.value = value;
      }
    });
    const field = script.find(
      (s) =>
        s.field.name === name &&
        (s.type === "onchange_and_onload" || s.type === "onchange")
    );
    if (field) {
      onChange(field.script, value, name);
    }
  };
  const {
    mutate: admissionFn,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload) =>
      axios
        .post(
          `${loca}/lom/create/externalrecord`,
          payload,
          {
          headers: { Application: appcode },
        }
        )
        .then((res) => res.data),
    onSuccess: (res, data) => {setCid(null)},
    onError: (error) => {
      setShowError(true);
    },
  });

  const onSubmit = (values) => {
    rcd.forEach((r) => {
      if (values.hasOwnProperty(r.name)) {
        r.value = values[r.name];
      }
    });
    let client = rcd.find((c) => c.name === "cid_id");
    if (client) {
      client.value.id = cid;
    }
    data.formRecord[2].record = rcd;
    console.log(data);

    admissionFn(data);
  };

  // useEffect(() => {
  //   console.log("🔍 RHF Internal State Snapshot:");
  //   console.log({
  //     rcd: rcd,
  //     defaultValues: defaultValues,
  //     values: form.getValues(),
  //     errors: form.formState.errors,
  //     isDirty: form.formState.isDirty,
  //     dirtyFields: form.formState.dirtyFields,
  //     isValid: form.formState.isValid,
  //     isSubmitting: form.formState.isSubmitting,
  //     isSubmitted: form.formState.isSubmitted,
  //     submitCount: form.formState.submitCount,
  //     touchedFields: form.formState.touchedFields,
  //   });
  // }, [form.watch(), form.formState]);

  // if (isLoading) return <Loader />;
  // if (!rcd) return <div>Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-3 text-center">Admission Application</h1>
          <p className="text-center text-muted mb-4">
            {cid
              ? "Enter your details to apply for admission."
              : "Select your school to apply for admission."}
          </p>
          {showError && isError && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error?.message || "Something went wrong"}
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowError(false)}
              ></button>
            </div>
          )}
          {!cid ? (
            <Select
              className="mb-4"
              placeholder="Select School"
              options={school.map((s) => ({
                value: s.cid_id.id,
                label: s.u_name,
              }))}
              onChange={(selectedOption) => setCid(selectedOption?.value || "")}
              // isSearchable
            />
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="row gx-3">
                {[...rcd]
                  .sort((a, b) => Number(a.formView.pn) - Number(b.formView.pn))
                  .map(
                    (obj, index) =>
                      obj.uivalid.visible === "true" && (
                        <div className="col-md-6" key={index}>
                          {[
                            "String",
                            "int",
                            "decimal",
                            "long",
                            "email",
                          ].includes(obj.type) && (
                            <div className="mb-3">
                              <label className="form-label mb-0 text-black fw-semibold">
                                {obj.label}
                                {obj.uivalid.mandatory === "true" && (
                                  <span
                                    className={`${
                                      form.watch(obj.name)
                                        ? "text-muted"
                                        : "text-danger"
                                    }`}
                                  >
                                    *
                                  </span>
                                )}
                              </label>
                              <input
                                type={obj.type === "email" ? "text" : "text"}
                                className={`form-control ${
                                  form.formState.errors[obj.name]
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder={obj.label}
                                {...form.register(obj.name, {
                                  onChange: (e) =>
                                    handleChange(e.target.value, obj.name), // merged automatically
                                })}
                                disabled={obj.uivalid.read_only === "true"}
                                maxLength={obj.uivalid.max_length}
                              />
                              <div className="text-danger small">
                                {form.formState.errors[obj.name]?.message}
                              </div>
                            </div>
                          )}

                          {obj.type === "choice" && (
                            <div className="mb-3">
                              <label className="form-label  mb-0 text-black fw-semibold">
                                {obj.label}
                                {obj.uivalid.mandatory === "true" && (
                                  <span
                                    className={`${
                                      obj.value ? "text-muted" : "text-danger"
                                    }`}
                                  >
                                    *
                                  </span>
                                )}
                              </label>
                              <select
                                className={`form-select ${
                                  form.formState.errors[obj.name]
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...form.register(obj.name, {
                                  onChange: (e) =>
                                    handleChange(e.target.value, obj.name),
                                })}
                              >
                                <option value="">Select {obj.label}</option>
                                {obj.choice.map((ch, idx) => (
                                  <option key={idx} value={ch.value}>
                                    {ch.label}
                                  </option>
                                ))}
                              </select>
                              <div className="text-danger small">
                                {form.formState.errors[obj.name]?.message}
                              </div>
                            </div>
                          )}

                          {obj.type === "boolean" && (
                            <div className="form-check  mb-0 text-black fw-semibold">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={obj.name}
                                {...form.register(obj.name, {
                                  onChange: (e) =>
                                    handleChange(
                                      String(e.target.checked),
                                      obj.name
                                    ),
                                })}
                                // checked={form.watch(obj.name) === "true"}
                                disabled={obj.uivalid.read_only === "true"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={obj.name}
                              >
                                {obj.label}
                                {obj.uivalid.mandatory === "true" && (
                                  <span
                                    className={`${
                                      obj.value ? "text-muted" : "text-danger"
                                    }`}
                                  >
                                    *
                                  </span>
                                )}
                              </label>
                            </div>
                          )}

                          {obj.type === "date" && (
                            <div className="mb-3">
                              <label className="form-label mb-0 text-black fw-semibold">
                                {obj.label}
                                {obj.uivalid.mandatory === "true" && (
                                  <span
                                    className={`${
                                      obj.value ? "text-muted" : "text-danger"
                                    }`}
                                  >
                                    *
                                  </span>
                                )}
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                {...form.register(obj.name, {
                                  onChange: (e) =>
                                    handleChange(e.target.value, obj.name),
                                })}
                              />
                              <div className="text-danger small">
                                {form.formState.errors[obj.name]?.message}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                  )}
              </div>

              <button type="submit" className="btn btn-primary mt-3 w-100">
                {isPending ? <Loader /> : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
