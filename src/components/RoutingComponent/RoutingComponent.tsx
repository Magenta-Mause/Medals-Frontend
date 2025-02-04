import PageLayout from "@components/PageLayout/PageLayout";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import DownloadPage from "@pages/Downloads/DownloadPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/athletes" element={<AthleteOverviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/downloads" element={<DownloadPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
