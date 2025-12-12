import React, { useContext } from "react";
import "../css/Invoice.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SMAYAContext } from "../Context";
import { Button, Container } from "react-bootstrap";
export default function InvoicePage() {
  const { loca, appcode, token, appname, userInfo, } =
    useContext(SMAYAContext);
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid") || "";
  const rc = useLocation().state?.data || null;
  const navigate = useNavigate();

  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container py-4">
      <div className="col-md-12">
        {rid && rc ? (
          <div className="invoice">
            <div className="d-flex flex-column justify-content-between align-items-center flex-md-row gap-2 gap-md-0">
              <div className="pull-right hidden-print order-1 order-md-2">
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 mb-2"
                      onClick={() =>
                        navigate(`/admission/process?userId=${userInfo.userId}`)
                      }
                    >
                      {" "}
                      View Application status
                    </Button>
                  </div>
                  <div>
                    <a
                      onClick={() => window.print}
                      className="btn btn-sm btn-white"
                    >
                      <i className="fa fa-print fa-fw fa-lg"></i> Print
                    </a>
                  </div>
                </div>
              </div>
              <div className="invoice-company order-2 order-md-1">
                <span className="border-bottom">Acknowledgement Receipt</span>
              </div>
            </div>

            <div className="invoice-header">
              <div className="invoice-from">
                <small>from</small>
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">{userInfo.username}</strong>
                  <br />
                  <small>Phone: {rc.contact}</small>
                  <br />
                  <small>Vpa: {rc.vpa}</small>
                </address>
              </div>
              <div className="invoice-to">
                <small>to</small>
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">CloudsMaya Services</strong>
                  <br />
                  <small>Phone: (123) 456-7890</small>
                </address>
              </div>
              <div className="invoice-date">
                <div className="date text-inverse m-t-5">
                  {" "}
                  Admission Application
                </div>
                <div className="invoice-detail">
                  <small className="application-id">
                    {" "}
                    Application ID : {rid}
                  </small>
                  <br />
                  <small>
                    Status:{" "}
                    <span
                      className="border rounded px-2 text-uppercase"
                      style={{
                        backgroundColor: "#ccc",
                      }}
                    >
                      {rc.status}
                    </span>
                  </small>
                  <br />
                  <small>{`${formatted} ${
                    rc.created.split(" ")[1].split(".")[0]
                  }`}</small>
                  <br />
                </div>
              </div>
            </div>

            <div className="invoice-content">
              <div className="table-responsive">
                <table className="table table-invoice">
                  <thead>
                    <tr>
                      <th className="text-uppercase">Billing Description</th>
                      <th className="text-center" width="10%">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="text-inverse">{rc?.description}</span>
                      </td>
                      {/* <td className="text-center">$50.00</td>
                    <td className="text-center">50</td> */}
                      <td className="text-center">₹{`${rc.amount}.00/-`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="invoice-price ">
                <div className="invoice-price-left">
                  <div className="invoice-price-row">
                    <div className="sub-price">
                      <small>SUBTOTAL</small>
                      <span className="text-inverse">
                        {" "}
                        ₹{`${rc.amount}.00/-`}
                      </span>
                    </div>
                    <div className="sub-price">
                      <i className="fa fa-plus text-muted"></i>
                    </div>
                    <div className="sub-price">
                      <small className="text-uppercase">
                        convinience fee (0.0%)
                      </small>
                      <span className="text-inverse">₹0.00/-</span>
                    </div>
                  </div>
                </div>
                <div className="invoice-price-right">
                  <small>TOTAL</small>{" "}
                  <span className="f-w-600"> ₹{`${rc.amount}.00/-`}</span>
                </div>
              </div>
            </div>

            <div className="invoice-footer d-flex flex-column justify-content-center align-items-center">
              <div>
                <p className="text-center m-b-5 f-w-600">THANK YOU!</p>
              </div>
              <div>
                <p className="d-flex justify-content-center align-items-center gap-1 gap-md-3text-center">
                  <span className="">
                    <i className="fa fa-fw fa-lg fa-globe"></i>cloudsmaya.com
                  </span>
                  <span className="">
                    <i className="fa fa-fw fa-lg fa-phone"></i> Tel:016-18192302
                  </span>
                  <span className="">
                    <i className="fa fa-fw fa-lg fa-envelope"></i>{" "}
                    support@cloudsmaya.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Container className="py-5 text-center">
            <div className="p-5 bg-light border rounded shadow-sm">
              <h4 className="text-danger mb-3">
                📄No Invoice Records Available
              </h4>
              <p className="text-muted mb-4">
                There are currently no invoices linked to your account.
                Generated invoices will be displayed here.
              </p>

              <Button
                variant=""
                size="sm"
                onClick={() => window.history.back()}
              >
                ← Go Back
              </Button>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
}
