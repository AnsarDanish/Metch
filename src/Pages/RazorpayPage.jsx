import React, { useContext, useEffect, useRef, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { SMAYAContext } from "../Context";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { AppProperties } from "../../AppProperties";

import axios from "axios";
import AlertCompo from "../Components/AlertCompo";

import Loader from "../Global/Loader";

export default function RazorpayPage() {
  const { loca, appcode, token, appname, userInfo, getShareDetails } =
    useContext(SMAYAContext);
  const data = useLocation().state || null;
  const { Razorpay } = useRazorpay();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");
  const cid = searchParams.get("cid");

  const getAmount = () => {
    axios
      .get(`${loca}/api/form/fee/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Application: appcode,
        },
      })
      .then((res) => setAmount(res.data.formFee))
      .catch((err) => console.error(err));
  };

  const pay = async (jso) => {
    setLoading(true);
    let resObj = {
      order_id: "",
      amount: 0,
      rid: "",
      description: jso.description,
      investmentType: jso.investmentType,
      shares: jso.shares,
      propertyId: data.propertyId,
    };

    await axios
      .post(`${loca}/lom/payment/pay`, jso, {
        headers: {
          authorization: "Bearer " + token,
          application: appcode,
        },
      })
      .then((response) => {
        let res = response.data;
        if (res.Error || res.error) {
          resObj = res;
        } else {
          if (res.type === "record") {
            let rcd = res.formRecord[2].record;
            let uniIdObj = rcd.find((obj) => obj.name === "uni_id");
            let orderObj = rcd.find((obj) => obj.name === "razorpay_order_id");
            let amountObj = rcd.find((obj) => obj.name === "amount");
            resObj.rid = uniIdObj.value;
            resObj.order_id = orderObj.value;
            resObj.amount = Number(amountObj.value) * 100;
          } else if (res.type === "new") {
            let rcd = res.formRecord[2].record;
            resObj.rid = rcd.uni_id;
            resObj.order_id = rcd.razorpay_order_id;
            resObj.amount = Number(rcd.amount) * 100;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
    return resObj;
  };

  const handlePayment = async (jso) => {
    pay(jso)
      .then(async (res) => {
        if (!res.Error && !res.error) {
          hideError();
          const options = {
            key: AppProperties.razorpay_key,
            amount: res.amount,
            currency: "INR",
            name: appname,
            description: `${appname} Transaction`,
            // image: favicon,
            orderId: res.order_id,
            handler: function (response) {
              if (response) {
                res.id = response.razorpay_payment_id;
                capturePayment(res);
                //to remove style applied by razorpay
                document.body.removeAttribute("style");
              }
            },
            prefill: {
              name: userInfo.name,
              email: userInfo.email,
              contact: userInfo.userId,
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: function () {
                //This will trigger if user closes the Razorpay modal
                showError("Payment was cancelled by the user.");
                document.body.removeAttribute("style");
              },
            },
          };
          var rzp1 = new Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            alert("Something went wrong");
          });
          rzp1.open();
        } else {
          showError(res.Error || res.error || res.error?.code);
        }
      })
      .catch((err) => {
        console.log(err);
        showError("Error occured from Razorpay Client");
      });
  };

  const capturePayment = (json) => {
    setLoading(true);
    axios
      .post(`${loca}/lom/payment/capture`, json, {
        headers: {
          authorization: "Bearer " + token,
          application: appcode,
        },
      })
      .then((response) => {
        let res = response.data;
        let paymentId = res.formRecord[2].record.uni_id;
     

        if (paymentId) {
          // saveShareDetails(json);
          setLoading(false);
        }
        navigate(`/admission/form/invoice?rid=${rid}`, {
          state: {
            data: res.formRecord[2].record,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const saveShareDetails = (jso) => {
    jso.amount = String(jso.amount / 100);

    axios
      .post(`${loca}/api/save/share-data`, jso, {
        headers: {
          Authorization: `Bearer ${token}`,
          application: appcode,
        },
      })
      .then((res) => {
        if (res.data.success) {
          getShareDetails();
          localStorage.setItem("showAnim", "true");
          navigate("/my-shares", { replace: true, state: { success: true } });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showError = (msg) => {
    setHasError(true);
    setError(msg);
  };
  const hideError = () => {
    if (hasError) {
      setHasError(false);
      setError("");
    }
  };

  useEffect(() => {
    getAmount();
    if (data) {
      if (
        data.description &&
        amount &&
        amount >= 1
        // data.shares &&
        // data.investmentType
      ) {
        // setAmount(data.amount);
        hideError();
        handlePayment({
          amount: amount,
          shares: data.shares,
          investmentType: data.investmentType,
          description: data.description,
        });
        // handlePayment({ amount: data.amount, description: data.description });
      } else {
        if (!data.description)
          showError("Description of payment is not defined!");
        if (!amount || amount < 100) showError("Payment amount is invalid!");
        if (!data.shares) showError("Please enter the number of shares");
        if (!data.investmentType) showError("Please define investment type");
      }
    } else {
      showError("Payment details does not exist!");
    }
  }, [data, amount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="font-semibold text-red-600 mt-2">
            Don't go back or refresh the page
          </p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="d-flex flex-column align-items-center gap-2">
          <AlertCompo type={"error"} msg={error} cancellable={false} />
          <button
            className="bg-light py-2 px-4 d-flex align-items-center justify-content-center rounded"
            onClick={() => {
              navigate(-1, {
                replace: true,
                state: {
                  amount,
                  shares: data.shares,
                  investmentType: data.investmentType,
                  propertyId: data.propertyId,
                },
              });
            }}
          >
            <FaArrowLeft className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
}
