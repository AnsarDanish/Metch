import React, { useRef } from "react";
import { SMAYAContext } from "../Context";
import { AppProperties } from "../../AppProperties";
import { useEffect, useState } from "react";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useRoutesStore } from "../store/useRoutesStore";

export default function WebWrapper() {
  const loca = AppProperties.loca;
  const imageloca = AppProperties.imageloca;
  const tokenName = AppProperties.tokenName;
  const appname = AppProperties.appname;
  const appcode = AppProperties.appcode;
  const parentAppCode = AppProperties.parentAppCode;
  const subscribeTopic = AppProperties.subscribeTopic;
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState();
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const mayaObject = useLocation().state || {};
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userDetails");
    return saved ? JSON.parse(saved) : null;
  });
  const [noTemplate, setNoTemplate] = useState(false);
  // const responseStore = useRef({});
  const mayaNavigate = (path, obj = {}) => {
    navigate(path, {
      state: obj,
    });
  };

  const getMayaObject = () => mayaObject;

  const verifyRecord = () => {
    let token = localStorage.getItem(tokenName);
    if (token !== "" && token !== null) {
      axios
        .get(`${loca}/verify`, {
          headers: {
            authorization: "Bearer " + token,
            Application: appcode,
          },
        })
        .then((res) => {
          var userInfoData = {
            userId: res.data[4].userId,
            username: res.data[3].name,
          };
          var rsp = res.data[0].response;
          if (rsp === "verified") {
            setToken(token);
            localStorage.setItem("userDetails", JSON.stringify(userInfoData));
            setUserInfo(userInfoData);
          } else if (rsp === "refereshed") {
            setToken(token);
            localStorage.setItem(tokenName, res.data[1].token);
            localStorage.setItem("userDetails", JSON.stringify(userInfoData));
            this.loading.current = true;
          } else if (rsp === "fail" || rsp === "not_verified") {
            setToken(null);
            localStorage.setItem(tokenName, "");
            localStorage.removeItem("userDetails");
            setUserInfo(null);
          }
        })
        .catch((err) => {
          setToken(null);
          localStorage.setItem(tokenName, "");
          localStorage.removeItem("userDetails");
          setUserInfo(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setToken(null);
      setLoading(false);
      return "no token";
    }
  };

  const logOut = (e) => {
    localStorage.removeItem(tokenName);
    localStorage.removeItem("userDetails");
    setUserInfo(null);
    setToken(null);
    setNoTemplate(false);
    navigate("/");
  };
  useEffect(() => {
    verifyRecord();
  }, []);

  if (!loading) {
    return (
      <div className="font-poppins-font">
        <SMAYAContext.Provider
          value={{
            loca,
            imageloca,
            tokenName,
            appname,
            appcode,
            parentAppCode,
            subscribeTopic,
            token,
            setToken,
            verifyRecord,
            logOut,
            userInfo,
            setUserInfo,
            setPolicyData,
            screenWidth,
            screenHeight,
            mayaNavigate,
            getMayaObject,
            noTemplate,
            setNoTemplate,
          }}
        >
          <ScrollRestoration />

          <Outlet />
          {/* </div> */}
        </SMAYAContext.Provider>
      </div>
    );
  }
}
