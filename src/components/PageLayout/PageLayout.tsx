import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import CustomBreadcrumbs from "@components/CustomBreadcrumbs/CustomBreadcrumbs";
import Header from "@components/Header/Header";
import NavBar from "@components/NavBar/NavBar";
import { Box, Sheet } from "@mui/joy";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

const PageLayout = () => {
  const { authorized, selectedUser } = useContext(AuthContext);
  if (authorized === false || selectedUser === null) {
    return <Navigate to="/login" />;
  }

  return (
    <Sheet sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <NavBar />
      <Box
        component="main"
        className="MainContent"
        id="main-component"
        tabIndex={-1}
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: {
            sm: "calc(calc(100dvh + 20px) - var(--Header-height))",
            md: "100dvh",
          },
          overflowY: "auto",
          gap: 1,
        }}
      >
        <CustomBreadcrumbs />
        <Outlet />
      </Box>
    </Sheet>
  );
};

export default PageLayout;
