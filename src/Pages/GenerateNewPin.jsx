import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { SMAYAContext } from "../Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function GenerateNewPin() {
  const { loca, appname } = useContext(SMAYAContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const navigate = useNavigate();

  const mobSchema = z
    .object({
      password: z
        .string()
        .nonempty({ message: "Password is required" })
        .min(4, { message: "Password must be at least 6 characters long." })
        .max(20, { message: "Password must not exceed 20 characters." }),
      confirmPassword: z
        .string()
        .nonempty({ message: "Confirm Password is required" }),
    })
    .refine((p) => p.password === p.confirmPassword, {
      message: "passwords does not matched!",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(mobSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });


  const { register, handleSubmit } = form;
  useEffect(() => {
    if (localStorage.getItem("isPasswordReset") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = (data) => {
    // console.log("jeklo");

    // if (data.password !== data.confirmPassword) {
    //   setError("Passwords do not match!");
    //   return;
    // }

    setBtnLoading(true);

    const payload = {
      user_name: localStorage.getItem("mobile"),
      password: data.password,
      application: appname,
    };

    axios
      .post(`${loca}/lom/set/createnewpassword`, payload, {
        headers: { Application: appname },
      })
      .then((res) => {
        const data = res.data;
        if (data.Error) {
          setError(data.Error);
        } else {
          localStorage.setItem("isPasswordReset", false);
          navigate("/login");
        }
        setBtnLoading(false);
      })
      .catch(() => {
        setError("Something went wrong. Try again.");
        setBtnLoading(false);
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card w-100" style={{ maxWidth: "400px" }}>
        <div className="card-header text-center">
          <h4 className="card-title">Set a New Password</h4>
          <p className="text-muted">
            Choose a strong password to secure your account.
          </p>
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
            {/* Password */}
            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                   className={`form-control ${
                    form.formState.errors.password ? "is-invalid" : ""
                  }`}
                placeholder="Enter password"
                {...register("password")}
              />
              <div className="invalid-feedback">
                {form.formState.errors.password?.message}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                   className={`form-control ${
                    form.formState.errors.confirmPassword ? "is-invalid" : ""
                  }`}
                placeholder="Confirm password"
                {...register("confirmPassword")}
              />
              <div className="invalid-feedback">
                {form.formState.errors.confirmPassword?.message}
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
              className="btn btn-primary w-100 mb-3"
              disabled={btnLoading}
            >
              {btnLoading ? "Submitting..." : "Submit"}
            </button>

            <div className="text-center">
              Remembered your password? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
