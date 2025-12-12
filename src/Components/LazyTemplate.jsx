import React, { lazy, Suspense, useContext, useMemo } from "react";
import axios from "axios";
import { SMAYAContext } from "../Context";
import Template from "../JSX/Template";

import NotFoundError from "../Pages/NotFoundError";

//mayaRequest {"template" ,}
export default function LazyTemplate({ name }) {
  const { appcode, token, loca, setWidgetContext } = useContext(SMAYAContext);
  const Component = useMemo(
    () =>
      lazy(async () => {
        let payload =
          Object.keys(setWidgetContext.current).length > 0
            ? setWidgetContext.current
            : JSON.parse(localStorage.getItem("payload")) || {};
        if (Object.keys(payload).length > 0) {
          localStorage.setItem("payload", JSON.stringify(payload));
        }
        console.log("umarpayload", setWidgetContext.current);

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
          Loading....
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
