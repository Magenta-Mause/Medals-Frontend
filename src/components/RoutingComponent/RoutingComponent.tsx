import PageLayout from "@components/PageLayout/PageLayout";
import AthleteOverviewPage from "@pages/athletes/AthleteOverviewPage";
import HomePage from "@pages/home/HomePage";
import NotFoundPage from "@pages/notFound/NotFoundPage";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/athletes" element={<AthleteOverviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
