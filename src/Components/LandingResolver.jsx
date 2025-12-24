import { useContext } from "react";
import { SMAYAContext } from "../Context";
import LandingPage from "../Pages/LandingPage";
import TemplateWrapper from "../Wrappers/TemplateWrapper";
import NavbarFooterComponent from "./NavbarFooterComponent";

const LandingResolver = () => {
  const { noTemplate, token } = useContext(SMAYAContext);
  if (token && !noTemplate) {
    return <TemplateWrapper />;
  }
  return (
    <NavbarFooterComponent>
      <LandingPage />
    </NavbarFooterComponent>
  );
};

export default LandingResolver;
