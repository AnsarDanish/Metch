import React, { useState, useRef, useEffect, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { SMAYAContext } from "../Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OTPVerification() {
  const { loca, appname } = useContext(SMAYAContext);
  const [otp, setOtp] = useState(true);
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(0);

  const otpLength = 4;
  const inputRefs = useRef([]);
  inputRefs.current = Array(otpLength)
    .fill()
    .map((_, i) => inputRefs.current[i] || React.createRef());

  const registerStatus = localStorage.getItem("register");
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: Object.fromEntries(
      Array.from({ length: otpLength }, (_, i) => [`digit${i}`, ""])
    ),
  });

  const { watch, setValue, handleSubmit } = methods;
  const watchedValues = watch();

  // Handle backspace
  const handleKeyDown = (index, e) => {
    const currentValue = watchedValues[`digit${index}`];
    if (e.key === "Backspace" && !currentValue && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, otpLength);
    pasted.split("").forEach((char, i) => {
      if (/^\d$/.test(char)) {
        setValue(`digit${i}`, char);
      }
    });
    const lastIndex = Math.min(pasted.length - 1, otpLength - 1);
    inputRefs.current[lastIndex]?.current?.focus();
  };

  const handleInputChange = (index, value) => {
    const val = value.replace(/\D/g, "");
    setValue(`digit${index}`, val);

    if (val && index < otpLength - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const GenerateNewpinfn = (value) => {
    const otpValue = Array.from({ length: otpLength })
      .map((_, i) => value[`digit${i}`] || "")
      .join("");
    if (otpValue.length !== otpLength) {
      setError(`Please enter all ${otpLength} digits`);
      return;
    }

    let mobile = localStorage.getItem("mobile");
    if (!mobile) {
      setError("Mobile number not found...");
      return;
    }

    setBtnLoading(true);
    const payload =
      registerStatus === "false"
        ? { user_name: mobile, application: appname, otp: otpValue }
        : { mobile: mobile, application: appname, otp: otpValue };

    const url =
      registerStatus === "false"
        ? loca + "/lom/set/matchOtp"
        : loca + "/lom/set/mobile/matchOtp/external";

    axios
      .post(url, payload)
      .then((resp) => {
        const otpResp = resp.data;
        if ("Error" in otpResp) {
          setError(otpResp.Error);
        } else {
          setError("");
          if (registerStatus === "false") {
            localStorage.setItem("isPasswordReset", "true");
            navigate("/new-pin");
          } else {
            navigate("/login", { state: { registered: true } });
          }
        }
        setBtnLoading(false);
      })
      .catch(() => setBtnLoading(false));
  };

  const resendOTP = () => {
    setError("");
    const mobile = localStorage.getItem("mobile");
    if (!mobile) return;

    const url =
      registerStatus === "false"
        ? loca + "/lom/set/forgetpassword"
        : loca + "/lom/set/resend/otp/external";
    const payload =
      registerStatus === "false"
        ? { user_name: mobile, application: appname, resend_otp: "true" }
        : { mobile: mobile, application: appname };

    axios.post(url, payload).then((resp) => {
      const otpResp = resp.data;
      if ("Error" in otpResp || "Message" in otpResp) {
        setError(otpResp.Error || otpResp.Message);
        otpResp.Message && (setShowTimer(true),setSeconds(59))
      } else {
        setError("");
        setShowTimer(true);
        setSeconds(59);
      }
    });
  };

  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => s - 1);
      } else {
        if (minutes === 0) {
          setShowTimer(false);
          clearInterval(interval);
        } else {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, minutes, showTimer]);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card w-100" style={{ maxWidth: "400px" }}>
        <div className="card-header text-center">
          <h4 className="card-title">Enter Verification Code</h4>
          <p className="card-text">We've sent a {otpLength}-digit code to your phone number</p>
          <p className="card-text"><strong>+91{localStorage.getItem("mobile")}</strong></p>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(GenerateNewpinfn)} className="text-center">
              <div className="d-flex justify-content-center gap-2 mb-3">
                {Array.from({ length: otpLength }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control text-center"
                    style={{ width: "3rem", height: "3rem", fontSize: "1.5rem" }}
                    maxLength={1}
                    ref={inputRefs.current[index]}
                    value={watchedValues[`digit${index}`]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-2" disabled={btnLoading}>
                {btnLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </FormProvider>

          <div className="text-center">
            {showTimer ? (
              <p className="text-muted">Resend in {seconds.toString().padStart(2, "0")}s</p>
            ) : (
              <button className="btn btn-link" onClick={resendOTP}>
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
