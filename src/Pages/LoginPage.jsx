import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Loader from "../Global/Loader";
import { SMAYAContext } from "../Context";
import image from "../assets/imageLogin.png";
import {
  Eye,
  EyeOff,
  GalleryVerticalEnd,
  Phone,
  X,
  XCircle,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { tokenName, appname, loca, verifyRecord } = useContext(SMAYAContext);
  const message = location.state?.message;

  const loginSchema = z.object({
    mobile: z.string().nonempty({ message: "Mobile is required" }),
    // .regex(/^[0-9]+$/, {
    //   message: "Mobile number must contain only digits.",
    // })
    // .min(10, { message: "Mobile number must be at least 10 digits." }),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(4, { message: "Password must be at least 6 characters long." })
      .max(20, { message: "Password must not exceed 20 characters." }),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: "", password: "" },
  });

  useEffect(() => {
    if (message) {
      setShowError(true);
      setErrorMessage(message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const onSubmit = (values) => {
    setIsLoading(true);
    setShowError(false);
    axios
      .post(
        loca + "/authenticate",
        {
          username: values.mobile,
          password: values.password,
          application: appname,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((resp) => {
        const data = resp.data;

        if (data?.Error) throw new Error(data.Error);

        if (data.authenticated) {
          localStorage.setItem(tokenName, data.token);
          verifyRecord();
          navigate("/");
        } else {
          setErrorMessage(data?.error || "Invalid credentials ❌");
          setShowError(true);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setShowError(true);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="container-fluid g-0 min-vh-100 d-flex">
      <div className="row g-0 w-100">
        {/* Left: Form */}
        <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center p-3">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            <div className="text-center mb-4">
              <a
                href="/"
                className="d-flex justify-content-center align-items-center gap-2 mb-3 text-decoration-none"
              >
                <div
                  className="bg-primary text-white d-flex align-items-center justify-content-center rounded"
                  style={{ width: 40, height: 40 }}
                >
                  <GalleryVerticalEnd />
                </div>
                <span className="fw-semibold text-black fs-5">SchoolMaya</span>
              </a>
              <h1 className="h5 mb-1">Login to your account</h1>
              <p className="text-muted">Enter your mobile & password below</p>
            </div>

            {showError && errorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
                <button
                  type="button"
                  className="btn-close btn-danger"
                  onClick={() => setShowError(false)}
                ></button>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="d-flex flex-column gap-3"
            >
              {/* Mobile */}
              <div className="">
                <label className="form-label mb-0 fw-semibold">Mobile No</label>
                <input
                  type="text"
                  autoFocus
                  className={`form-control ${
                    formState.errors.mobile ? "is-invalid" : ""
                  }`}
                  placeholder="Enter mobile number"
                  {...register("mobile")}
                  maxLength={20}
                />
                <span
                  className="position-absolute top-50 mt-3 start-0 translate-middle-y ps-3 text-muted"
                  // style={{ fontSize: "1rem" }}
                >
                  {/* <Phone /> */}
                </span>
                <div className="invalid-feedback">
                  {formState.errors.mobile?.message}
                </div>
              </div>

              {/* Password */}
              <div className="position-relative">
                <label className="form-label d-flex justify-content-between mb-0">
                  <span className="fw-semibold">Password</span>
                  <a href="/forget" className="text-decoration-underline">
                    Forgot your password?
                  </a>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    formState.errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter password"
                  {...register("password")}
                />
                <div className="invalid-feedback">
                  {formState.errors.password?.message}
                </div>
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="showPassword">
                    Show Password
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {/* {isLoading && <Loader />} */}

              <div className="text-center  mt-2">
                Don't have an account?{" "}
                <a href="/signup" className="text-decoration-underline">
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Image */}
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <img
            src={image}
            alt="Login"
            className="position-fit top-0 start-0 w-100 vh-100 object-fit-cover object-position-top"
            style={{ filter: "brightness(0.8)" }}
          />
        </div>
      </div>
    </div>
  );
}
