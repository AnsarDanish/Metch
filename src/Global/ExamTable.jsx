import axios from "axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SMAYAContext } from "../Context";
import AlertCompo from "../Components/AlertCompo";
import { Alert, Button } from "react-bootstrap";
import { GrDocumentPdf } from "react-icons/gr";
import { useReactToPrint } from "react-to-print";
import "../css/TablePrint.css";
const ExamTable = ({ formData, setFormData, setLoading, dataSource }) => {
  const { loca, appcode } = useContext(SMAYAContext);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    msg: "",
  });
  const [editCell, setEditCell] = useState({ rowIndex: null, colKey: null });
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const tableRef = useRef();


  const handleDoubleClick = (rowIndex, colKey) => {
    if (["standard", "division"].includes(colKey)) return;

    const subjectKeys = Object.keys(rows[rowIndex]).filter((key) =>
      key.includes("_")
    );

    const rowSubjects = subjectKeys
      .map((key) => rows[rowIndex][key])
      .filter((f) => f !== "-");
    setEditCell({
      rowIndex,
      colKey,
      options: rowSubjects,
    });
  };

  const handleChange = (rowIndex, colKey, subjectId) => {
    const updated = [...rows];
    const currentRow = { ...updated[rowIndex] };
    const newSubject = editCell.options.find((s) => s.id === subjectId) || "";
    const existingColKey = Object.keys(currentRow).find(
      (key) => key.includes("_") && currentRow[key]?.id === subjectId
    );
    //swappiing
    if (existingColKey) {
      const temp = currentRow[colKey];
      currentRow[colKey] = newSubject;
      currentRow[existingColKey] = temp;
    } else {
      currentRow[colKey] = newSubject;
    }
    if (newSubject) {
      updated[rowIndex] = currentRow;
      setRows(updated);
    }
    setEditCell(null);
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ show: true, msg, type });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (dataSource === "form") {
      const hdrs = [
        { key: "standard", label: "Standard" },
        { key: "division", label: "Division" },
        ...generateHeaders(formData.timeTable),
      ];
      setHeaders(hdrs);
      const rws = generateRows(formData.json.records, hdrs, formData.isSame);
      setRows(rws);
    } else if (formData.fetchTentative && dataSource === "api") {
      getTentativeTable();
    }
  }, [formData, dataSource]);

  const payload = useMemo(() => {
    return rows.map((row) => {
      const record = {
        exam: formData.rid,
        standard: row.standard,
        division: row.division,
        schedule: [],
      };

      headers
        .filter((h) => h.key.includes("_"))
        .forEach((h) => {
          const [date, time] = h.key.split("_");
          const [from, to] = time.split("-");

          record.schedule.push({
            date,
            from: `${from}:00`,
            to: `${to}:00`,
            subject: row[h.key] || null, // full subject object or null
          });
        });

      return record;
    });
  }, [rows, headers]);

  const saveTable = () => {
    axios
      .post(`${loca}/api/exam/subject/record`, payload, {
        headers: { application: appcode },
      })
      .then((res) => {
        if (res.data.Error) {
          showAlert(res.data.Error, "error");
        } else {
          showAlert(res.data.message, "success");
        }
      })
      .catch((e) => console.error("error: ", e));
  };

  const tentativPayload = useMemo(() => {
    return {
      exam_uni_id: formData.rid,
      headers,
      rows,
      formData,
    };
  }, [headers, rows]);

  const saveTentativeTable = () => {
    axios
      .post(`${loca}/api/tentative/exam/table`, tentativPayload, {
        headers: { application: appcode },
      })
      .then((res) => {
        if (res.data.Error) {
          showAlert(res.data.Error, "error");
        } else {
          showAlert(res.data.message, "success");
        }
      })
      .catch((e) => console.log("error: ", e));
  };

  const getTentativeTable = () => {
    setLoading(true);
    axios
      .get(`${loca}/api/tentative/exam/table/${formData.rid}`, {
        headers: { application: appcode },
      })
      .then((res) => {
        if (res.data.Error) {
          showAlert(res.data.Error, "error");
        } else {
          let json = JSON.parse(res.data?.json) || {};
          setHeaders(json.headers);
          setRows(json.rows);
          setFormData({ ...json.formData, fetchTentative: false });
        }
      })
      .catch((e) => console.error("Error: ", e))
      .finally(() => setLoading(false));
  };

  // useEffect(() => {
  //   if (formData.fetchTentative && dataSource === "api") {
  //     getTentativeTable();
  //   }
  // }, [formData, dataSource]);
  const downloadPDF = useReactToPrint({
    contentRef: tableRef,
    // documentTitle: `${
    //   formData.json?.title || "Exam Time Table"
    // } - From: ${formData.json?.startDate
    //   .split("-")
    //   .reverse()
    //   .join("-")}  To: ${formData.json?.endDate
    //   .split("-")
    //   .reverse()
    //   .join("-")}`,
    pageStyle: `
    @page {
      size: landscape;
      margin: 10mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust:exact;
      }
      .table-responsive {
        overflow: visible !important;
        height: auto !important;
      }
      #header {
    background-color: white !important;
    position: static !important;
  }
      table {
        width: 100% !important;
      }
    }
  `,
  });
  return (
    <div>
      {alert.show && (
        <AlertCompo type={alert.type} msg={alert.msg} close={hideAlert} />
      )}
      <div ref={tableRef}>
        {/* for ui */}
        <div id="timetable" className="table-responsive mt-4">
          <table className="table table-bordered table-striped text-center table-hover align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                {headers.map((h) => (
                  <th
                    id="header"
                    key={h.key}
                    // className="px-4"
                    style={{
                      position: "sticky",
                      top: 0,
                      minWidth: "160px",
                      zIndex: 10,
                      backgroundColor: "rgba(146, 163, 172, 1)",
                      fontStyle: "normal",
                      borderColor: "gray",
                    }}
                  >
                    {h.label.split("\n").map((line, i) => (
                      <div className="" key={i}>
                        {line}
                      </div>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((col) => (
                    <td
                      key={col.key}
                      onDoubleClick={() => handleDoubleClick(rowIndex, col.key)}
                      className="py-2 px-3"
                      style={{
                        fontStyle: "normal",
                        borderColor: "gray",
                      }}
                    >
                      {editCell &&
                      editCell.rowIndex === rowIndex &&
                      editCell.colKey === col.key ? (
                        <select
                          value={row[col.key]?.id || ""} // ensure empty default
                          onChange={(e) =>
                            handleChange(rowIndex, col.key, e.target.value)
                          }
                          onBlur={() => setEditCell(null)}
                        >
                          <option value="">Select subject</option>

                          {Array.isArray(editCell.options) &&
                            editCell.options.map((subject, idx) => (
                              <option key={idx} value={subject.id}>
                                {subject.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        row[col.key]?.name || "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* only for print - First 5 columns */}
        <div className="print-only">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h3 style={{ fontWeight: "semibold", color: "#333" }}>
              {formData.json?.title || "Exam Time Table"}
            </h3>
            <p>
              From:{" "}
              <b>{formData.json?.startDate?.split("-").reverse().join("-")}</b>{" "}
              &nbsp; To:{" "}
              <b>{formData.json?.endDate?.split("-").reverse().join("-")}</b>
            </p>
          </div>
          <div className="page-split">
            <table className="table table-bordered table-striped text-center align-middle">
              <thead>
                <tr>
                  {headers.slice(0, 5).map((h) => (
                    <th key={h.key}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {headers.slice(0, 5).map((h) => (
                      <td key={h.key}>{row[h.key]?.name || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {headers.slice(5, 10).length > 0 && (
            <>
              <div className="page-break" />
              <div className="page-split">
                {/* Next 5 columns */}
                <table className="table table-bordered table-striped text-center align-middle">
                  <thead>
                    <tr>
                      {headers.slice(5, 10).map((h) => (
                        <th key={h.key}>{h.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {headers.slice(5, 10).map((h) => (
                          <td key={h.key}>{row[h.key]?.name || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>{" "}
            </>
          )}
          {headers.slice(10).length > 0 && (
            <>
              <div className="page-break" />

              <div className="page-split">
                {/* Remaining columns */}
                <table className="table table-bordered table-striped text-center align-middle">
                  <thead>
                    <tr>
                      {headers.slice(10).map((h) => (
                        <th key={h.key}>{h.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {headers.slice(10).map((h) => (
                          <td key={h.key}>{row[h.key]?.name || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-cneter mt-2 gap-4">
        <Button
          className="px-4"
          size="sm"
          variant="outline-primary"
          onClick={() => saveTentativeTable()}
        >
          Save Tentative
        </Button>
        <Button
          className="px-4"
          variant="outline-success"
          size="sm"
          onClick={() => {
            saveTable();
          }}
          disabled={""}
        >
          Approve
        </Button>
        <Button variant="outline-danger" size="sm" onClick={downloadPDF}>
          <span className="p-1">
            <GrDocumentPdf />
          </span>
          print
        </Button>
      </div>
    </div>
  );
};

export default ExamTable;

const generateHeaders = (timeTable) => {
  const headers = [];

  timeTable.forEach((day, dayIndex) => {
    const date = day.date;
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    day.slots.forEach((slot, slotIndex) => {
      const key = `${date}_${slot.from}-${slot.to}_${dayIndex}_${slotIndex}`;
      const label = `${date.split("-").reverse().join("-")}\n${dayName} ${
        slot.from
      } - ${slot.to}`;
      headers.push({ key, label });
    });
  });

  return headers;
};

function generateRows(records, headers, sameSubjectsSameDay) {
  //Get all subject names for each record
  const subjectSets = records.map(
    (rec) => new Set(rec.subject.map((s) => s.name))
  );

  //Count frequency of each subject
  const subjectFrequency = {};
  subjectSets.forEach((set) => {
    set.forEach((name) => {
      subjectFrequency[name] = (subjectFrequency[name] || 0) + 1;
    });
  });

  //Subjects that appear in 2+ standards
  const sharedSubjects = Object.keys(subjectFrequency).filter(
    (name) => subjectFrequency[name] > 1
  );
  //Build rows
  const rows = records.map((rec) => {
    const row = {
      standard: rec.std,
      division: rec.div,
    };

    // subject list
    const recordSubjects = rec.subject.map((s) => s.name);

    let combinedSubjects = [];

    if (sameSubjectsSameDay) {
      // Shared first (preserve this record's actual objects)
      const shared = sharedSubjects
        .filter((name) => recordSubjects.includes(name))
        .map((name) => rec.subject.find((s) => s.name === name));

      // Unique ones (only this standard has them)
      const unique = rec.subject.filter(
        (s) => !sharedSubjects.includes(s.name)
      );

      combinedSubjects = [...shared, ...unique];
    } else {
      combinedSubjects = rec.subject;
    }
    //Map subjects to table slots
    let subjectIndex = 0;
    headers.forEach((h) => {
      if (h.key.includes("_")) {
        row[h.key] = combinedSubjects[subjectIndex] || "-";
        subjectIndex++;
      }
    });

    return row;
  });

  return rows;
}
