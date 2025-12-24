import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Babel from "@babel/standalone";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { SMAYAContext } from "../Context";
import axios from "axios";
import * as Bootstrap from "react-bootstrap";
function flattenNodes(nodes = []) {
  let result = [];
  if (nodes.length === 0) return result;

  nodes.forEach((node) => {
    if (!node.name) return;
    result.push({
      name: node.name,
      code: node.code,
      script: node.response,
    });
    if (node.childs && node.childs.length > 0) {
      result = result.concat(flattenNodes(node.childs));
    }
  });

  return result;
}

const handleConvert = (jsxCode) => {
  try {
    const result = Babel.transform(jsxCode, {
      presets: ["react"],
      comments: false,
      minified: true,
      retainLines: true,
    });
    return result.code;
  } catch (error) {
    console.error("Error converting JSX:", error);
  }
};

export default function StringToFunction(jsxJSON) {
  const TemplateContext = SMAYAContext;
  const { mayaNavigate, getMayaObject } = useContext(TemplateContext);
 
  
  const scriptResponse = {};
  const components = {};
  const globalVariables = {
    React,
    components,
    ...Bootstrap,
    useNavigate,
    useContext,
    useState,
    useEffect,
    useLocation,
    useRef,
    useSearchParams,
    createSearchParams,
    Modal,
    SMAYAContext,
    axios,
    document,
    Outlet,
    useNavigation,
    scriptResponse,
    TemplateContext,
    mayaNavigate,
    // logOut,
    getMayaObject,
  };

  const allScopeKeys = Object.keys(globalVariables).join(", ");
  const childrens = flattenNodes(jsxJSON.childs);

  if (childrens.length > 0) {
    childrens.forEach((child) => {
      const name = child.code.match(/function\s+([A-Za-z0-9_$]+)/)?.[1];
      components[name] = () => null;
      scriptResponse[name] = child.script
        ? JSON.parse(child.script)
        : child.script;
    });
    const childKeys = Object.keys(components);

    childrens.reverse().forEach((c) => {
      if (!c.code) return;

      const childName = c.code.match(/function\s+([A-Za-z0-9_$]+)/)?.[1];
      const destructuredNames = childKeys
        .filter((name) => name !== childName)
        .join(", ");

      let temp = handleConvert(c.code);

      const fc = new Function(
        ["globalVariables"],
        `
       
      const { ${allScopeKeys} } = globalVariables;
      const { ${destructuredNames} } = components;
    ${temp}
     ${childName}.displayName = "${childName}"
      return  ${childName}
      //# sourceURL=Template.jsx/StringToFunction/${childName}.jsx

      `
      )(globalVariables);
      components[childName] = fc;

      components[childName].response = scriptResponse[childName];
    });
  }
  const childKeys = Object.keys(components);
  const allChildNames = childKeys.length > 0 ? childKeys.join(", ") : "";

  let parent = handleConvert(jsxJSON.parent.code);
  const parentName = parent.match(/function\s+([A-Za-z0-9_$]+)/)?.[1];
  let ParentCompo;

  const renderFunction = new Function(
    ["globalVariables"],
    `
    
      const { ${allScopeKeys} } = globalVariables;
      const { ${allChildNames} } = components;

    ${parent}
     ${parentName}.displayName = "${parentName}"
      return  ${parentName}
    //# sourceURL=Template.jsx/StringToFunction/${parentName}.jsx

      `
  );

  ParentCompo = renderFunction(globalVariables);
  let res = jsxJSON.parent.response;
  ParentCompo.response = res ? JSON.parse(res) : res;

  return ParentCompo;
}
