import PageLayout from "@components/PageLayout/PageLayout";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />} />
    </Routes>
  );
};

export default RoutingComponent;
