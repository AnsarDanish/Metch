import React, { useContext, useEffect, useState } from "react";
import "../css/ApplicationProcess.css";
import { Button, Container } from "react-bootstrap";
import { SMAYAContext } from "../Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";
import { MdOutlinePendingActions } from "react-icons/md";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { SiGoogleforms } from "react-icons/si";
import { RiProgress5Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import Loader from "../Global/Loader";
import { ArrowLeft } from "lucide-react";
export default function ApplicationProcess() {
  const { loca, token, appcode } = useContext(SMAYAContext);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const getForms = () => {
    axios
      .get(`${loca}/api/edit/form/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Application: appcode,
        },
      })
      .then((res) => setForm(res.data.record || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getForms();
  }, [userId]);

  const filteredForms = form.filter((f) => {
    const val = search.toLowerCase();
    return (
      f.uni_id?.toLowerCase().includes(val) ||
      f.school?.toLowerCase().includes(val) ||
      `${f.u_first_name} ${f.u_last_name}`.toLowerCase().includes(val) ||
      f.u_state?.toLowerCase().includes(val)
    );
  });

  const steps = {
    pending: { id: 1, title: "Pending", icon: MdOutlinePendingActions },
    tentative_selected: {
      id: 2,
      title: "Tentative Selected",
      icon: BiSolidSelectMultiple,
    },
    in_progress: { id: 3, title: "In Progress", icon: RiProgress5Line },

    task: { id: 4, title: "Tasks Completed", icon: SiGoogleforms },
    accepted: { id: 5, title: "Accepted", icon: FaCheckCircle },
    rejected: { id: 6, title: "Rejected", icon: CgCloseO },
  };
  if (loading) return <Loader />;
  return (
    <div className="py-4">
      <h4
        className="text-center border-bottom mb-md-4"
        style={{
          borderBottom: "1px",
        }}
      >
        Application Process
      </h4>

      <div className="container">
        <div className="mb-3">
          <div className="d-flex align-items-center p-0">
            <Button className="p-0" variant="link" onClick={() => navigate("/admission")}>
              <ArrowLeft size={24} />
              Back
            </Button>
          </div>
          <div>
            <h5 className="p-2">Search Application...</h5>
            <div className="d-flex justify-content-between align-items-center gap-0 gap-md-2">
              <input
                type="text"
                className="form-control w-full"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <button className="btn btn-primary">Search</button> */}
            </div>
          </div>
        </div>
      </div>
      {form.length > 0 ? (
        filteredForms.map((f, i) => {
          return (
            <div className="mb-4" key={i}>
              <div className="container padding-bottom bg-light mb-1">
                <div className="mb-2">
                  <h5 className="border-bottom pb-2 mb-3 pt-2 d-flex align-items-center justify-content-start gap-2 px-2 px-md-0">
                    <span>{i + 1}.</span> Application ID -{" "}
                    <span className="text-small">{f.uni_id}</span>
                  </h5>

                  <div className="card mb-1">
                    <div className="p-2 text-center text-white text-lg bg-lite-dark rounded-top">
                      <span className="text-uppercase">
                        Admission Application of -{" "}
                      </span>{" "}
                      <span className="text-medium text-uppercase fw-bold">
                        {f.school}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 bg-lite-white">
                        {/* <div className="w-100 text-center py-1 px-2">
                          <span className="text-medium">Application Fee:</span>{" "}
                          <strong className="text-uppercase">
                            {`${f.u_first_name} ${f.u_last_name}`}
                          </strong>
                        </div> */}
                      <div className="w-100 text-center py-1 px-2">
                        <span className="text-medium">Name:</span>{" "}
                        <strong className="text-uppercase">
                          {`${f.u_first_name} ${f.u_last_name}`}
                        </strong>
                      </div>
                      <div className="w-100 text-center py-1 px-2">
                        <span className="text-medium ">Status:</span>{" "}
                        <strong className="text-decoration-underline text-uppercase">
                          {" "}
                          {f.u_state}
                        </strong>
                      </div>
                      <div className="w-100 text-center py-1 px-2">
                        <span className="text-medium">Submitted At:</span>{" "}
                        <strong className="text-decoration-underline">
                          {`${f.updated
                            .split(" ")[0]
                            .split("-")
                            .reverse()
                            .join("-")} ${f.updated
                            .split(" ")[1]
                            .replace(".0", "")}`}
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="card-body position-relative ">
                        {/*Banner */}

                        {["accepted", "rejected"].includes(f.u_state) && (
                          <div
                            className="position-absolute d-flex justify-content-center align-items-center start-50 translate-middle-x w-100 h-50"
                            style={{
                              marginTop: "4px",
                              zIndex: 9999,
                              backgroundColor:
                                f.u_state === "accepted"
                                  ? "#021264ff"
                                  : "#b40f0f",
                            }}
                          >
                            <div className="p-2 d-flex justify-content-center align-items-center fw-bold gap-1 text-white text-uppercase">
                              {f.u_state === "accepted" ? (
                                <span>
                                  <FaCheckCircle size={24} />
                                </span>
                              ) : (
                                <span>
                                  <MdCancel size={28} />
                                </span>
                              )}

                              {f.u_state}
                            </div>
                          </div>
                        )}

                        <div
                          className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x"
                          style={{ position: "relative", zIndex: 1 }}
                        >
                          {Object.values(steps)
                            .filter((step) => {
                              if (f.u_state === "accepted")
                                return step.title !== "Rejected";
                              if (f.u_state === "rejected")
                                return step.title !== "Accepted";
                              return true;
                            })
                            .map((step, index) => {
                              let currentSt =
                                steps[f.u_state.split(" ").join("_")];
                              let Badge = step.icon;
                              const isCompleted = index < currentSt?.id;
                              return (
                                <div
                                  key={step.id}
                                  className={`step ${
                                    isCompleted
                                      ? f.u_state === "accepted"
                                        ? "accepted"
                                        : f.u_state === "rejected"
                                        ? "rejected"
                                        : "completed"
                                      : ""
                                  }`}
                                >
                                  <div className="step-icon-wrap">
                                    <div
                                      className="step-icon"
                                      style={{
                                        marginTop: "px",
                                        zIndex: 9999,
                                      }}
                                    >
                                      <Badge
                                        className="text-center mb-3"
                                        size={38}
                                      />
                                    </div>
                                  </div>
                                  <h4 className="step-title">{step.title}</h4>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap flex-md-nowrap justify-content-end align-items-center">
                  {/* <div className="custom-control custom-checkbox gap-2 mr-3"> */}
                  {/* <input
                    className="custom-control-input"
                    type="checkbox"
                    id="notify_me"
                    defaultChecked
                  />
                  <label className="custom-control-label" htmlFor="notify_me">
                    Notify me when order is delivered
                  </label> */}
                  {/* </div> */}
                  <div className="text-end text-sm-right px-2 mb-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={!["pending"].includes(f.u_state)}
                      onClick={() =>
                        navigate(
                          `/admission/form?title=${f?.school}&cid=${f?.cid_id?.id}`,
                          { state: { data: f } }
                        )
                      }
                    >
                      Edit Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Container className="py-5 text-center">
          <div className="p-5 bg-light border rounded shadow-sm">
            <h4 className="text-danger mb-3">📄 No Applications Found</h4>
            <p className="text-muted mb-4">
              You currently don’t have any applications to track or monitor
              progress. Once you submit an application, you’ll see its status
              here.
            </p>
{/* 
            <Button variant="" size="sm" onClick={() => window.history.back()}>
              ← Go Back
            </Button> */}
          </div>
        </Container>
      )}
    </div>
  );
}
