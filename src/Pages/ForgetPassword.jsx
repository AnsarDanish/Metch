import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { SMAYAContext } from "../Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";

export default function ForgetPassword() {
  const { loca, appname } = useContext(SMAYAContext);
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      mobile: "",
    },
  });

  const { register, handleSubmit } = form;

  const onSubmit = async (values) => {
    if (!values.mobile || values.mobile.length < 10) {
      setError("Enter a valid mobile number");
      return;
    }

    setBtnLoading(true);
    const payload = {
      user_name: values.mobile,
      resend_otp: "false",
      application: appname,
    };
    axios
      .post(loca + "/lom/set/forgetpassword", payload)
      .then((res) => {
        const data = res.data;
        if (data.Error) {
          setError(data.Error);
        } else {
          localStorage.setItem("mobile", data.email || values.mobile);
          localStorage.setItem("register", false);
          navigate("/otpverify");
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        console.log("err", err);

        setError("Something went wrong. Try again.");
        setBtnLoading(false);
      });
    // try {
    //   const payload = {
    //     user_name: values.mobile,
    //     resend_otp: "false",
    //     application: appname,
    //   };
    //   const res = await axios.post(loca + "/lom/set/forgetpassword", payload);

    //   if (res.data?.Error) {
    //     setError(res.data.Error);
    //   } else {
    //     localStorage.setItem("mobile", values.mobile);
    //     localStorage.setItem("register", "false");
    //     navigate("/otpverify");
    //   }
    // } catch (e) {
    //   setError("Something went wrong");
    // } finally {
    //   setBtnLoading(false);
    // }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card w-100"
        style={{ maxWidth: "400px", maxHeight: "400px" }}
      >
        <div className="card-header text-center">
          <h4 className="card-title">Forgot Password?</h4>
          <p className="text-muted">Enter your registered mobile number.</p>
        </div>

        <div className="card-body">
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Mobile No</label>
              <input
                type="tel"
                className="form-control ps-5 d-flex justify-content-between"
                placeholder="Enter mobile number"
                {...register("mobile")}
                maxLength={10}
              />
              {/* <div className="d-flex justify-content-between"></div> */}
              <span
                className="position-absolute top-50 mt-3 start-0 translate-middle-y ps-3 text-muted"
                // style={{ fontSize: "1rem" }}
              >
                <Phone />
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={btnLoading}
            >
              {btnLoading ? "Sending OTP..." : "Verify OTP"}
            </button>

            <div className="text-center d-flex justify-content-center g-2">
              Remembered your password?{" "}
              <a className="btn btn-link p-0 d-flex "
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/login");
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
