import CustomBreadcrumbs from "@components/CustomBreadcrumbs/Breadcrumbs";
import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { Box } from "@mui/joy";
import { Outlet } from "react-router";

const PageLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <NavBar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: {
            xs: "calc(calc(100dvh - 12px) - var(--Header-height))",
            sm: "calc(calc(100dvh - 12px) - var(--Header-height))",
            md: "calc(100dvh)",
          },
          gap: 1,
        }}
      >
        <CustomBreadcrumbs />
        <Outlet />
      </Box>
    </Box>
  );
};

export default PageLayout;
