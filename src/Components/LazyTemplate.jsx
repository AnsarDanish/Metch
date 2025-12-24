import React, { lazy, Suspense, useContext, useMemo } from "react";
import axios from "axios";
import { SMAYAContext } from "../Context";
import Template from "../JSX/Template";

import NotFoundError from "../Pages/NotFoundError";
import { useLocation } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import { Spinner } from "react-bootstrap";

//mayaRequest {"template" ,}
export default function LazyTemplate({ name }) {
  const { appcode, token, loca, getMayaObject } =
    useContext(SMAYAContext);

  const payload = getMayaObject();

  const Component = useMemo(
    () =>
      lazy(async () => {
        const res = await axios.post(
          `${loca}/lom/template-name/${name}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}`, application: appcode },
          }
        );
        if (res.data.Error) {
          return { default: () => <NotFoundError /> };
        }
        const jsxData = res.data;
        const LazyComp = () => <Template json={jsxData} />;
        return { default: LazyComp };
      }),
    [name]
  );
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center mt-4">
         <Spinner animation="border" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
