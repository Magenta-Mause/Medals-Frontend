import PageLayout from "@components/PageLayout/PageLayout";
import AthleteCreationForm from "@pages/Athletes/AthleteCreationPage";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/athletes" element={<AthleteOverviewPage />} />
        <Route path="/athletes/create" element={<AthleteCreationForm/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
