import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SMAYAContext } from "../Context";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import image from "../assets/image.png";
import { GalleryVerticalEnd } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { appname, loca, appcode } = useContext(SMAYAContext);

  const signupSchema = z
    .object({
      mobile: z
        .string()
        .nonempty({ message: "Mobile is required" })
        .regex(/^[0-9]+$/, {
          message: "Mobile number must contain only digits.",
        })
        .min(10, { message: "Mobile number must be at least 10 digits." }),
      firstName: z
        .string()
        .nonempty({ message: "First name is required" })
        .min(2, { message: "First Name must be at least 2 characters long." })
        .max(10, { message: "First Name must not exceed 10 characters long." }),
      lastName: z
        .string()
        .max(10, { message: "Last Name must not exceed 10 characters long." }),
      email: z.union([
        z.literal(""),
        z.string().email("Enter valid Email").optional(),
      ]),
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
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      mobile: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: registerData } = useQuery({
    queryKey: ["signupFormData", loca, appcode],
    queryFn: () =>
      axios
        .get(`${loca}/lom/registration/user`, {
          headers: { Application: appcode },
        })
        .then((res) => {
          if (res.data?.Error) throw new Error(res.data.Error);
          return res.data;
        }),
    retry: false,
  });

  const registerFn = (data) => {
    const rcd = data.formRecord[2].record;
    setLoading(true);
    axios
      .post(`${loca}/lom/create/externalrecord/user`, data, {
        headers: { Application: appcode },
      })
      .then((res) => {
        let resp = res.data;
        if (
          resp?.isUserPresent ||
          resp?.Error?.includes("User is already exist.")
        ) {
          setLoading(false);
          navigate("/login", {
            state: {
              message:
                "You are already registered user! Please login to continue",
            },
          });
          return;
        }
        if (resp?.Error) {
          setShowError(true);
          setErrorMessage(resp?.Error);
          setLoading(false);
          return;
        }
        const mobNo = rcd.find((x) => x.name === "contact_number")?.value || "";
        localStorage.setItem("register", "true");
        localStorage.setItem("mobile", mobNo);
        setLoading(false);
        navigate("/otpverify");
      })
      .catch((error) => {
        setShowError(true);
        setErrorMessage(error || error?.message);
        setLoading(false);
      });
  };

  // const {
  //   mutate: registerFn,
  //   isPending,
  //   isError,
  //   error,
  // } = useMutation({
  //   mutationFn: (data) =>
  //     axios
  //       .post(`${loca}/lom/create/externalrecord/user`, data, {
  //         headers: { Application: appcode },
  //       })
  //       .then((res) => res.data),
  //   onSuccess: (resp, data) => {
  //     const rcd = data.formRecord[2].record;
  //     if (
  //       resp?.isUserPresent ||
  //       resp?.Error?.includes("User is already exist.")
  //     ) {
  //       navigate("/login", {
  //         state: {
  //           message:
  //             "You are already registered user! Please login to continue",
  //         },
  //       });
  //       return;
  //     }
  //     if (resp?.Error) {
  //       setShowError(true);
  //       setErrorMessage(resp?.Error);
  //       return;
  //     }
  //     const mobNo = rcd.find((x) => x.name === "contact_number")?.value || "";
  //     localStorage.setItem("register", "true");
  //     localStorage.setItem("mobile", mobNo);
  //     navigate("/otpverify");
  //   },
  //   onError: () => {
  //     setShowError(true);
  //     setErrorMessage(error?.message);
  //   },
  // });

  const onSubmit = (values) => {
    if (!registerData) return;
    let mmm = registerData.formRecord[2].record;
    mmm.forEach((item) => {
      switch (item.name) {
        case "first_name":
          item.value = values.firstName;
          break;
        case "last_name":
          item.value = values.lastName;
          break;
        case "name":
          item.value = values.firstName;
          break;
        case "contact_number":
        case "user_name":
          item.value = values.mobile;
          break;
        case "password":
          item.value = values.password;
          break;
        case "email_id":
          item.value = values.email ?? "";
          break;
        case "type":
          item.value = "noClient";
          break;
        case "application":
          item.value = appname;
          break;
      }
    });
    registerData.formRecord[2].record = mmm;
    registerFn(registerData);
  };

  return (
    <div className="container-fluid g-0 min-vh-100 d-flex">
      <div className="row g-0 w-100 ">
        {/* Left Column - Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-3">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            <div className="text-center  mb-4">
              <a
                onClick={() => navigate("/")}
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
              <h1 className="h5">Sign up and get started</h1>
              <p className="text-muted small">
                Enter your details to create an account.
              </p>
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

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label text-black mb-0 fw-semibold">
                  Mobile No
                </label>
                <input
                  type="tel"
                  autoFocus
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    form.setValue("mobile", value);
                  }}
                  className={`form-control ${
                    form.formState.errors.mobile ? "is-invalid" : ""
                  }`}
                  placeholder="Enter mobile number"
                  {...form.register("mobile")}
                  maxLength={10}
                />
                {form.formState.errors.mobile && (
                  <div className="form-text text-danger">
                    {form.formState.errors.mobile.message}
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label   mb-0 fw-semibold">
                    First Name
                  </label>
                  <input
                    id="nextField"
                    type="text"
                    className={`form-control ${
                      form.formState.errors.firstName ? "is-invalid" : ""
                    }`}
                    placeholder="First Name"
                    {...form.register("firstName")}
                  />
                  {form.formState.errors.firstName && (
                    <div className="form-text text-danger">
                      {form.formState.errors.firstName.message}
                    </div>
                  )}
                </div>
                <div className="col mb-3">
                  <label className="form-label   mb-0 fw-semibold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      form.formState.errors.lastName ? "is-invalid" : ""
                    }`}
                    placeholder="Last Name"
                    {...form.register("lastName")}
                  />
                  {form.formState.errors.lastName && (
                    <div className="form-text text-danger">
                      {form.formState.errors.lastName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label   mb-0 fw-semibold">
                  Email (optional)
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    form.formState.errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Email Address"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <div className="form-text text-danger">
                    {form.formState.errors.email.message}
                  </div>
                )}
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label  mb-0 fw-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    form.formState.errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <div className="form-text text-danger">
                    {form.formState.errors.password.message}
                  </div>
                )}
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label mb-0 fw-semibold">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    form.formState.errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm password"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <div className="form-text text-danger">
                    {form.formState.errors.confirmPassword.message}
                  </div>
                )}
              </div>

              <div className="form-check mb-3">
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

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Signing..." : "Sign Up"}
              </button>

              <div className="text-center mt-3">
                Already have an account?{" "}
                <a onClick={() => navigate("/login")}>Login</a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src={image}
            alt="Signup"
            className="position-fit  w-100 vh-100 object-fit-cover"
          />
        </div>
      </div>
    </div>
  );
}
