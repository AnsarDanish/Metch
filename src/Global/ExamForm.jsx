import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { SMAYAContext } from "../Context";
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import AlertCompo from "../Components/AlertCompo";
import ExamTable from "./ExamTable";
import "../css/Exam.css";
import {
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
  TbHexagonNumber4Filled,
} from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import js from "@eslint/js";
export default function ExamForm() {
  const [formData, setFormData] = useState({
    // title: "",
    // startDate: "",
    // endDate: "",
    examsPerDay: 1,
    defaultSlots: [{ from: "10:00", to: "12:00" }],
    skipDates: [],
    overrides: {},
    isSame: true,
  });

  const [customDate, setCustomDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [customSlots, setCustomSlots] = useState([{ from: "", to: "" }]);
  const [showPreview, setShowPreview] = useState(false);
  const { loca, appcode } = useContext(SMAYAContext);
  const [json, setJson] = useState({});
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    msg: "",
  });
  const [dataSource, setDataSource] = useState("form");
  const [selectedSkipDate, setSelectedSkipDate] = useState(null);
  const [selectedCustomDate, setSelectedCustomDate] = useState(null);

  const showAlert = (msg, type = "info") => {
    setAlert({ show: true, msg, type });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  const getExamRecord = () => {
    axios
      .get(`${loca}/api/exam/subject/${rid}`, {
        headers: { application: appcode },
      })
      .then((res) => setJson(res.data))
      .catch((e) => console.error("Error: ", e));
  };
  useEffect(() => {
    getExamRecord();
  }, [rid]);

  // useEffect(() => {
  //   setShowTable(false);
  // }, [formData]);

  const handleGenerate = () => {
    // const noSlots = formData.defaultSlots.some(({ from, to }) => !from || !to);

    // if (noSlots) {
    //   showAlert("All default slots must have start and end times.", "warning");
    //   return;
    // }

    // hideAlert();
    setLoading(true);

    setFormData((prev) => ({ ...prev, timeTable: timetable, json, rid }));

    setDataSource("form");

    setTimeout(() => {
      setLoading(false);
      setShowTable(true);
    }, 100);
  };

  const getAllDates = () => {
    if (!json.startDate || !json.endDate) return [];
    const start = new Date(json.startDate);
    const end = new Date(json.endDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d).toISOString().split("T")[0];
      let day = new Date(date).getDay();
      let isWeekend = [0, 6].includes(day);

      if (
        !formData.skipDates.includes(date) &&
        !(formData.weekends && isWeekend)
      ) {
        dates.push(date);
      }
    }

    if (formData.alternateDays) {
      let final = [];
      let take = true;
      let lastDate = null;

      for (let i = 0; i < dates.length; i++) {
        const current = new Date(dates[i]);

        if (lastDate) {
          const diffDays =
            (current - new Date(lastDate)) / (1000 * 60 * 60 * 24);

          // If gap > 1 (like after weekend), reset pattern
          if (diffDays > 1) take = true;
        }

        if (take) final.push(dates[i]);
        take = !take; // flip for next valid day
        lastDate = dates[i];
      }

      return final;
    }

    return dates;
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.defaultSlots];
    updatedSlots[index][field] = value;
    setFormData({ ...formData, defaultSlots: updatedSlots });
  };

  // const handleAddSlot = () => {
  //   setFormData({
  //     ...formData,
  //     defaultSlots: [...formData.defaultSlots, { from: "", to: "" }],
  //   });
  // };

  // const handleRemoveSlot = (index) => {
  //   const updated = formData.defaultSlots.filter((_, i) => i !== index);
  //   setFormData({ ...formData, defaultSlots: updated });
  // };

  const handleAddSkipDate = (date) => {
    let d = new Date(date).getFullYear();

    if (String(d).length === 4) {
      if (date && !formData.skipDates.includes(date)) {
        setFormData({ ...formData, skipDates: [...formData.skipDates, date] });
      }
    }
  };

  const handleCustomSlotChange = (index, field, value) => {
    const updated = [...customSlots];
    updated[index][field] = value;
    setCustomSlots(updated);
  };

  const handleAddCustomSlot = () => {
    setCustomSlots([...customSlots, { from: "", to: "" }]);
  };

  const handleRemoveCustomSlot = (index) => {
    setCustomSlots(customSlots.filter((_, i) => i !== index));
  };

  const handleRemoveSkipDates = (date) => {
    const updated = formData.skipDates.filter((d) => d !== date);
    setFormData({ ...formData, skipDates: updated });
  };

  const handleEditCustomSlots = (date) => {
    const slots = formData.overrides[date];
    setCustomDate(date);
    setShowModal(true);
    setCustomSlots(slots);
  };
  const handleSaveCustomSlots = () => {
    if (customDate) {
      setFormData({
        ...formData,
        overrides: { ...formData.overrides, [customDate]: [...customSlots] },
      });
      setShowModal(false);
      setCustomSlots([{ from: "", to: "" }]);
      setCustomDate("");
    }
  };

  const handleRemoveCustomDates = (date) => {
    // console.log(Object.entries(formData.overrides).filter((_, i) => i === date));

    // const updated = Object.entries(formData.overrides).filter((_, i) => i !== index);
    setFormData((prev) => {
      const updated = { ...prev.overrides };
      delete updated[date];
      return { ...prev, overrides: updated };
    });
  };
  const allDates = getAllDates();

  //preview
  const buildTimetable = () => {
    return allDates?.map((date) => {
      const isCustom = formData.overrides[date];
      const slots = isCustom ? formData.overrides[date] : formData.defaultSlots;
      return { date, slots };
    });
  };

  const timetable = buildTimetable();

  return Object.keys(json).length > 1 ? (
    <Container className="py-4">
      <h3 className="text-center mb-4 border-bottom">Exam Timetable Setup</h3>

      {/* SECTION 1: BASIC INFO */}
      <section className="mb-3 bg-light p-2">
        <h5 className="border-bottom pb-2 mb-3 d-flex align-items-center justify-content-start gap-2">
          <TbHexagonNumber1Filled size={24} /> Basic Details
        </h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Exam</Form.Label>
            <Form.Control
              type="text"
              disabled={json.title}
              // placeholder="Enter  title"
              value={json.title || ""}
              // onChange={(e) =>
              //   setFormData({ ...formData, title: e.target.value })
              // }
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  disabled={json.startDate}
                  value={json.startDate}
                  // onChange={(e) =>
                  //   setFormData({ ...formData, startDate: e.target.value })
                  // }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  disabled={json.endDate}
                  value={json.endDate}
                  // onChange={(e) =>
                  //   setFormData({ ...formData, endDate: e.target.value })
                  // }
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Default Exams Per Day</Form.Label>
            <Form.Select
              value={formData.examsPerDay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  examsPerDay: Number(e.target.value),
                  defaultSlots: Array.from(
                    { length: Number(e.target.value) },
                    () => ({ from: "", to: "" })
                  ),
                })
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </section>
      <Form.Check
        className="mb-4 ms-1"
        type="checkbox"
        label="Same Subjects on the Same Day for All Standards"
        checked={formData.isSame}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            isSame: e.target.checked,
          }))
        }
      />
      {alert.show && (
        <AlertCompo type={alert.type} msg={alert.msg} close={hideAlert} />
      )}
      {/* SECTION 2: DEFAULT TIME SLOTS */}
      <section className="mb-5 bg-light p-2">
        <h5 className="border-bottom pb-2 mb-3 d-flex align-items-center justify-content-start gap-2">
          <TbHexagonNumber2Filled size={24} /> Default Time Slots
        </h5>
        {formData.defaultSlots.map((slot, index) => (
          <Row key={index} className="align-items-center mb-2">
            <Col xs={5}>
              <Form.Control
                type="time"
                value={slot.from}
                onChange={(e) =>
                  handleSlotChange(index, "from", e.target.value)
                }
              />
            </Col>
            <Col xs={5}>
              <Form.Control
                type="time"
                value={slot.to}
                onChange={(e) => handleSlotChange(index, "to", e.target.value)}
              />
            </Col>
            {/* <Col xs="auto">
              {formData.defaultSlots.length > 1 && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleRemoveSlot(index)}
                >
                  ❌
                </Button>
              )}
            </Col> */}
          </Row>
        ))}
        {/* <Button
          size="sm"
          variant="outline-primary"
          onClick={handleAddSlot}
          className="mt-2"
        >
          ➕ Add Time Slot
        </Button> */}
      </section>
      {loading && <Loader />}
      {showTable && (
        <div className="mb-3">
          <ExamTable
            setFormData={setFormData}
            formData={formData}
            setLoading={setLoading}
            dataSource={dataSource}
          />
        </div>
      )}
      {/* SECTION 3: SKIP DATES */}
      <section className="mb-5 bg-light p-2">
        <h5 className="border-bottom pb-2 mb-3 d-flex align-items-center justify-content-start gap-2">
          {" "}
          <TbHexagonNumber3Filled size={24} /> Skip Dates
        </h5>
        <Row className="d-flex align-items-center justify-content-start gap-0 gap-md-3">
          <Col xs={6} md={4}>
            <Form.Control
              type="date"
              onChange={(e) => handleAddSkipDate(e.target.value)}
            />
          </Col>
          <Col
            xs={6}
            md={4}
            className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-center gap-0 gap-md-4"
          >
            <Form.Check
              className=""
              type="checkbox"
              label="Weekends"
              checked={formData.weekends}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  weekends: e.target.checked,
                }))
              }
            />
            <Form.Check
              className="text-nowrap"
              type="checkbox"
              label="Alternate Days"
              checked={formData.alternateDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alternateDays: e.target.checked,
                }))
              }
            />
          </Col>
          {/* <Col xs={6} md={4}>
            <Form.Check 
            className="me-3"
              type="checkbox"
              label="Alternate Days"
              checked={formData.alternateDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alternateDays: e.target.checked,
                }))
              }
            />
          </Col> */}
        </Row>
        <div className="mt-3">
          {/* ✅ One outer container for all selected dates */}
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div
              className="border rounded p-2 w-100"
              style={{
                height: "120px",
                overflowY: "auto",
                backgroundColor: "",
                cursor: "pointer",
              }}
            >
              {formData.weekends === true && (
                <div>
                  <strong>Weekends:</strong> Saturday Sunday
                </div>
              )}
              {formData.alternateDays === true && (
                <div>
                  <strong>Alternate Days Applied</strong>
                </div>
              )}
              {!formData.weekends &&
              !formData.alternateDays &&
              formData.skipDates.length === 0 ? (
                <div className="text-muted text-center ">
                  No skip dates selected
                </div>
              ) : (
                formData.skipDates.map((date, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-start justify-content-between  mb-1 ${
                      selectedSkipDate === date ? "bg-secondary" : "bg-light"
                    }`}
                    onClick={() => {
                      // setFormData((prev) => ({
                      //   ...prev,
                      //   selectedDate: prev.selectedDate === date ? null : date,
                      // }));
                      setSelectedSkipDate((prev) =>
                        prev === date ? null : date
                      );
                    }}
                  >
                    {/* Left side: date + weekday */}
                    <div
                      className="d-flex align-items-center gap-4 flex-wrap"
                      style={{
                        color: selectedSkipDate === date ? "white" : "",
                      }}
                    >
                      <div>
                        <strong>Date:</strong>{" "}
                        {date.split("-").reverse().join("-")}
                      </div>
                      <div>
                        <strong>Day:</strong>{" "}
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </div>
                    </div>

                    {/* Right-side delete icon */}
                    {/* {selectedDate === date && (
                      <div
                        className="fw-bold "
                        style={{
                          cursor: "pointer",
                          backgroundColor: "black",
                        }}
                        title="Remove Date"
                        onClick={() => handleRemoveSkipDates(index)}
                      >
                        <HiOutlineXMark size={24} className="text-danger" />
                      </div>
                    )} */}
                  </div>
                ))
              )}
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center  gap-2">
              <Button
                className="p-0 text-black  border-0"
                disabled={!selectedSkipDate}
                onClick={() => {
                  handleRemoveSkipDates(selectedSkipDate);
                  setSelectedSkipDate(null);
                }}
              >
                <HiOutlineXMark
                  title="Remove Date"
                  className="border p-1"
                  size={34}
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </Button>
              <Button
                className="p-0 text-black  border-0"
                disabled={
                  formData.skipDates.length === 0 &&
                  !formData.weekends &&
                  !formData.alternateDays
                }
              >
                <MdDelete
                  title="Remove All"
                  className="text-danger border p-1"
                  size={34}
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      skipDates: [],
                      weekends: false,
                      alternateDays: false,
                    }));
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CUSTOM DATE SLOTS */}
      <section className="mb-3 bg-light p-2 ">
        <h5 className="border-bottom pb-2 mb-3 d-flex align-items-center justify-content-start gap-2">
          <TbHexagonNumber4Filled size={24} /> Custom Time / Extra Exams for
          Specific Dates
        </h5>
        <Row className="align-items-center">
          <Col xs={6} md={4}>
            <Form.Control
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={!customDate}
              onClick={() => setShowModal(true)}
            >
              Time Slots
            </Button>
          </Col>
        </Row>

        <div className="mt-3">
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div
              className="border rounded p-2 w-100"
              style={{
                height: "120px",
                // minHeight: "112px",
                overflowY: "auto",
                backgroundColor: "",
                cursor: "pointer",
              }}
            >
              {Object.keys(formData.overrides).length === 0 ? (
                <div className="text-muted text-center ">
                  No custom dates selected
                </div>
              ) : (
                Object.entries(formData.overrides).map(
                  ([date, slots], index) => (
                    <div>
                      <div
                        key={index}
                        className={`d-flex align-items-start justify-content-between mb-1 ${
                          selectedCustomDate === date
                            ? "bg-secondary"
                            : "bg-light"
                        }`}
                        onClick={() => {
                          // setFormData((prev) => ({
                          //   ...prev,
                          //   selectedDate:
                          //     prev.selectedDate === date ? null : date,
                          // }));
                          setSelectedCustomDate((prev) =>
                            prev === date ? null : date
                          );
                        }}
                      >
                        {/* Left side: date + weekday */}
                        <div
                          className="d-flex align-items-center gap-2 gap-md-4 flex-wrap"
                          style={{
                            color: selectedCustomDate === date ? "white" : "",
                          }}
                        >
                          <div>
                            <strong>Date:</strong>{" "}
                            {date.split("-").reverse().join("-")}
                          </div>
                          <div>
                            <strong>Day:</strong>{" "}
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </div>

                          <div className="d-flex gap-0 gap-md-3 flex-wrap">
                            {slots.map((s, i) => (
                              <span key={i}>
                                <small>
                                  <strong>Time Slot{` ${i + 1}`}: </strong>
                                </small>
                                {s.from} - {s.to}
                                {/* {i < slots.length - 1 && " |  "} */}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right-side delete icon */}
                        {/* <div>
                        {selectedDate && (
                          <div className="fw-bold">
                            <div className="d-flex justify-content-center align-items-center gap-3">
                              <RiEditBoxFill
                                size={24}
                                className="text-white"
                                title="Edit Slot"
                                style={{
                                  backgroundColor: "black",
                                }}
                                onClick={() => {
                                  handleEditCustomSlots(date);
                                }}
                              />
                              <HiOutlineXMark
                                size={24}
                                style={{
                                  backgroundColor: "black",
                                }}
                                title="Remove Date"
                                className="text-danger"
                                onClick={() => {
                                  handleRemoveCustomDates(date);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div> */}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center  gap-2">
              <Button
                className="p-0 text-black  border-0"
                disabled={!selectedCustomDate}
                onClick={() => {
                  handleEditCustomSlots(selectedCustomDate);
                }}
              >
                <IoMdInformationCircleOutline
                  title="Edit Slot"
                  className="border p-1"
                  size={34}
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </Button>
              <Button
                className="p-0 text-black  border-0"
                disabled={!selectedCustomDate}
                onClick={() => {
                  handleRemoveCustomDates(selectedCustomDate);
                  setSelectedCustomDate(null);
                }}
              >
                <HiOutlineXMark
                  title="Remove Slot"
                  className="border p-1"
                  size={34}
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </Button>
              <Button
                className="p-0 text-black  border-0"
                disabled={Object.keys(formData.overrides).length === 0}
              >
                <MdDelete
                  title="Remove All"
                  className="text-danger border p-1"
                  size={34}
                  style={{
                    backgroundColor: "#f1f1f1",
                  }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      overrides: {},
                    }));
                    setSelectedCustomDate(null);
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
        {/* MODAL FOR CUSTOM DATE SLOTS */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="d-flex flex-row align-items-center justify-content-center">
                <div>
                  <div className="responsive-text text-nowrap">
                    <span className="text-muted"> Time Slots for : </span>
                    <span className="responsive-text text-nowrap">
                      {`${customDate} (${new Date(
                        customDate
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                      })})`}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {customSlots.map((slot, index) => (
              <Row
                key={index}
                className="align-items-center justify-content-start mb-2 w-auto text-nowrap  gx-1"
              >
                <Col xs={5}>
                  <Form.Control
                    type="time"
                    value={slot.from}
                    onChange={(e) =>
                      handleCustomSlotChange(index, "from", e.target.value)
                    }
                  />
                </Col>
                {"--"}
                <Col xs={5}>
                  <Form.Control
                    type="time"
                    value={slot.to}
                    onChange={(e) =>
                      handleCustomSlotChange(index, "to", e.target.value)
                    }
                  />
                </Col>
                <Col xs="auto">
                  {customSlots.length > 1 && (
                    <Button
                      className=""
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleRemoveCustomSlot(index)}
                    >
                      ❌
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              size="sm"
              variant="outline-primary"
              onClick={handleAddCustomSlot}
            >
              ➕ Add Time Slot
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveCustomSlots}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* ACTION BUTTONS */}
      <div className="text-center d-flex justify-content-center gap-2 gap-md-3 mb-2">
        <Button
          className="btn-responsive"
          variant="outline-success"
          // size="sm"
          onClick={() => {
            handleGenerate();
          }}
        >
          Generate Timetable
        </Button>
        <Button
          className="btn-responsive"
          variant="outline-info"
          // size="sm"
          onClick={() => {
            setShowPreview(true);
          }}
          disabled={!json.endDate}
        >
          Preview Slots
        </Button>

        <Button
          className="btn-responsive"
          variant="outline-secondary"
          // size="sm"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              rid,
              fetchTentative: true,
            }));
            setDataSource("api");
            setShowTable(true);
          }}
          disabled={""}
        >
          Get Tentative Table
        </Button>
      </div>

      {/* PREVIEW MODAL */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="responsive-text">
            📅 {json.title || "Exam Timetable"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {timetable.length === 0 ? (
            <p className="text-muted">
              Please fill all fields to generate timetable.
            </p>
          ) : (
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Exam Slots</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map(({ date, slots }) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td>
                      {slots.map((s, i) => (
                        <div key={i}>
                          🕒 {s.from} - {s.to}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  ) : (
    <Container className="py-5 text-center">
      <div className="p-5 bg-light border rounded shadow-sm">
        <h4 className="text-danger mb-3">⚠️ Standards Not Approved</h4>
        <p className="text-muted mb-4">
          You can’t generate the exam timetable until all standards for this
          exam are approved.
        </p>
        <Button variant="" size="sm" onClick={() => window.history.back()}>
          ← Go Back
        </Button>
      </div>
    </Container>
  );
}
