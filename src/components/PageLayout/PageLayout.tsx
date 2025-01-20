import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { Box } from "@mui/joy";
import { Outlet } from "react-router";

const PageLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <NavBar />
      <div className="content">
        <Outlet />
      </div>
    </Box>
  );
};

export default PageLayout;
