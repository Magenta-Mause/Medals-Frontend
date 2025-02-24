import React from "react";
import { useMediaQuery } from "@mui/material";
import MobileProfileView from "./ProfileMobileView";
import DesktopProfileView from "./ProfileDesktopView";

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return isMobile ? <MobileProfileView /> : <DesktopProfileView />;
};

export default ProfilePage;
