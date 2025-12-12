import { SMAYAContext } from "../Context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import convertJsonToRoutes from "../store/convertJsonToRoutes";
import axios from "axios";
import NotFoundError from "../Pages/NotFoundError";

export default function TemplateWrapper() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, loca, appcode } = useContext(SMAYAContext);
  function create_mayaRouter(routes) {
    const tree = convertJsonToRoutes(routes);
    const final = [
      ...tree,
      {
        path: "*",
        element: <NotFoundError />,
      },
    ];
    setRoutes(final);
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const res = await axios.get(`${loca}/lom/landing-template`, {
          headers: {
            authorization: "Bearer " + token,
            Application: appcode,
          },
        });
        if (res.data.Error) {
           setLoading(false);
          return <Navigate to="/" replace />;
        }
        console.log(res.data);
        let fn = new Function(["create_mayaRouter"], res.data.record);

        fn(create_mayaRouter);
      } catch (e) {
        console.error("Error", e);
      } finally{setLoading(false)}
    };

    getTemplate();
  }, [token]);

  if(!loading && !routes.length) return <NotFoundError/>

  const element = useRoutes(routes);

  return element;
}
