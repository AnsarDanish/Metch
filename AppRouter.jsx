import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WebWrapper from "./src/Wrappers/WebWrapper";
import { Children } from "react";
import LandingPage from "./src/Pages/LandingPage";
import NavbarFooterComponent from "./src/Components/NavbarFooterComponent";
import Dashboard from "./src/Unused Components/Dashboard";
import NonPrivateWrapper from "./src/Wrappers/NonPrivateWrapper";
import PrivateWrapper from "./src/Wrappers/PrivateWrapper";

// import Testt from "./src/Pages/Testtt";
import SignupPage from "./src/Pages/SignupPage";
import LoginPage from "./src/Pages/LoginPage";
import OtpVerification from "./src/Pages/OtpVerification";
import ForgetPassword from "./src/Pages/ForgetPassword";
import GenerateNewPin from "./src/Pages/GenerateNewPin";
import AdmissionPage from "./src/Unused Components/AdmissionPage";

// import DashboardPage from "./src/Pages/Testtt";
import AchievementsPage from "./src/DashboardCompo/AchievementsPage";
import DashboardPage from "./src/DashboardCompo/DashboardPage";
import FeesPage from "./src/DashboardCompo/FeesPage";
import AcademicCalendar from "./src/DashboardCompo/AcademicCalendar";
import EventsPage from "./src/DashboardCompo/EventsPage";
import AttendancePage from "./src/DashboardCompo/AttendancePage";
import TeachersPage from "./src/DashboardCompo/TeachersPage";
import Testing from "./src/Global/Testing";
import School from "./src/Pages/School";
import Loader from "./src/Global/Loader";
import ExamForm from "./src/Global/ExamForm";
import ExternalFormAdmission from "./src/Pages/ExternalFormAdmission";
import ApplicationProcess from "./src/Pages/ApplicationProcess";
import PaymentPage from "./src/Pages/InvoicePage";
import RazorpayPage from "./src/Pages/RazorpayPage";
import LazyTemplate from "./src/Components/LazyTemplate";
import TemplateWrapper from "./src/Wrappers/TemplateWrapper";
import { useRoutesStore } from "./src/store/useRoutesStore";
import NotFoundError from "./src/Pages/NotFoundError";
// import ExamTable from "./src/Global/ExamTable";

const AppRouter = () => {
  const routes = createBrowserRouter([
    {
      element: <WebWrapper />,
      children: [
        {
          element: <NonPrivateWrapper />,
          children: [
            {
              path: "/login",
              element: <LoginPage />,
            },
            {
              path: "/signup",
              element: <SignupPage />,
            },
            {
              path: "/forget",
              element: <ForgetPassword />,
            },

            {
              path: "/otpverify",
              element: <OtpVerification />,
            },
            {
              path: "/new-pin",
              element: <GenerateNewPin />,
            },
            {
              path: "/loading",
              element: <Loader />,
            },
          ],
        },

        {
          path: "*",
          element: <TemplateWrapper />,
        },

        {
          element: <NavbarFooterComponent />,
          children: [
            {
              path: "/",
              element: <LandingPage />,
            },
            {
              path: "/test",
              element: <AdmissionPage />,
            },
            {
              path: "/exam",
              element: <ExamForm />,
            },
            {
              element: <PrivateWrapper />,

              children: [
                {
                  path: "/admission",
                  element: <School />,
                },
                {
                  path: "/admission/form",
                  element: <ExternalFormAdmission />,
                },
                {
                  path: "/admission/process",
                  element: <ApplicationProcess />,
                },

                {
                  path: "/admission/form/payment",
                  element: <RazorpayPage />,
                },
                {
                  path: "/admission/form/invoice",
                  element: <PaymentPage />,
                },
              ],
            },

            // {
            //   path: "/dashboard",
            //   element: <Dashboard />,
            //   children: [
            //     {
            //       index: true,
            //       element: <DashboardPage />,
            //     },
            //     {
            //       path: "teachers",
            //       element: <TeachersPage />,
            //     },
            //     {
            //       path: "students",
            //       element: <p>Student Section</p>,
            //     },

            //     {
            //       path: "events",
            //       element: <EventsPage />,
            //     },
            //     {
            //       path: "fees",
            //       element: <FeesPage />,
            //     },
            //     {
            //       path: "attendance",
            //       element: <AttendancePage />,
            //     },
            //     {
            //       path: "achievements",
            //       element: <AchievementsPage />,
            //     },
            //     {
            //       path: "parents",
            //       element: <p>Parents Section</p>,
            //     },
            //     {
            //       path: "calendar",
            //       element: <AcademicCalendar />,
            //     },
            //   ],
            // },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRouter;
