import React, { useContext, useEffect, useState } from "react";

import Select from "react-select";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SMAYAContext } from "../Context";

import ExternalFormAdmission from "./ExternalFormAdmission";
import { ArrowLeft } from "lucide-react";
import { Button } from "react-bootstrap";
import ApplicationProcess from "./ApplicationProcess";
import { useNavigate } from "react-router-dom";
import "../css/School.css";

export default function School() {
  const [showError, setShowError] = useState(false);
  const [school, setSchool] = useState([]);
  const [cid, setCid] = useState(null);
  const [title, setTitle] = useState(null);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [nearby, setNearby] = useState([]);
  const { loca, appcode, userInfo, token } = useContext(SMAYAContext);
  const navigate = useNavigate();

  const getSchool = useQuery({
    queryKey: ["school"],
    queryFn: () =>
      axios
        .get(`${loca}/api/get/schools`, {
          headers: {
            authorization: "Bearer " + token,
            Application: appcode,
          },
        })
        .then((res) => {
          setSchool(res.data.record);
          return res.data;
        }),
    enabled: !cid,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLong(pos.coords.longitude);
      },
      (err) => console.log(err)
    );
    if (lat && long) {
      axios
        .get(`${loca}/api/nearby/schools?lat=${lat}&long=${long}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Application: appcode,
          },
        })
        .then((res) => setNearby(res.data.record))
        .catch((err) => console.error(err));
    }
  }, [lat, long]);

  return (
    <>
      <div className="content-header">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="mb-3 text-center text-dark">
              Admission Application
            </h1>
            <p className="text-center text-muted mb-4">
              Select your school to apply for admission.
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
            <div className="px-3">
              <div className="">
                <Button
                  variant="link"
                  className="p-0 mb-2"
                  onClick={() =>
                    navigate(`/admission/process?userId=${userInfo.userId}`)
                  }
                >
                  {" "}
                  View Your Application Status
                </Button>
              </div>
              <div>
                <Select
                  className="mb-4"
                  placeholder="Select School"
                  options={school.map((s) => ({
                    value: s.cid_id.id,
                    label: s.u_name,
                  }))}
                  onChange={(selectedOption) => {
                    setCid(selectedOption?.value || "");
                    setTitle(selectedOption?.label);
                    navigate(
                      `/admission/form?title=${selectedOption?.label}&cid=${selectedOption?.value}`
                    );
                  }}
                  // isSearchable
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2"
        style={{
          backgroundColor: "#fbfcfcff",
        }}
      >
        <div className="container my-4">
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1 border-bottom"></div>
            <h5 className="px-3 m-0 text-muted">Nearby Institutions</h5>
            <div className="flex-grow-1 border-bottom"></div>
          </div>

          {nearby.length > 0 ? (
            // <div className="border shadow-sm bg-light p-2">
            nearby.map((n, i) => (
              <div
                key={i}
                className="border-bottom mb-3 p-2 suggestion-card bg-light rounded"
                // style={{ cursor: "pointer", transition: "0.2s" }}
              >
                <div
                  className="-body"
                  onClick={() =>
                    navigate(
                      `/admission/form?title=${n.u_name}&cid=${n.cid_id.id}`
                    )
                  }
                >
                  <h6 className="text-uppercase mb-1 ">
                    {i + 1}.{" "}
                    <span className="text-decoration-underline text-success">
                      {n.u_name}
                    </span>
                  </h6>
                  <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                    📍 {n.address.name}, {n.address.city.name},{" "}
                    {n.address.pincode}, {n.address.city.state}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // </div>
            <div className="text-center text-muted">
              No nearby institutions found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
