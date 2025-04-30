import React from "react";
import { Box, useColorScheme } from "@mui/joy";
import PoolIcon from "@mui/icons-material/Pool";
import type { SxProps } from "@mui/joy/styles/types";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { t } from "i18next";
import { ICON_SIZE } from "constants/iconSize";

export interface SwimCertificateIconProps {
  achieved?: boolean;
  sx?: SxProps;
}

const SwimCertificateIcon: React.FC<SwimCertificateIconProps> = ({
  achieved = false,
  sx,
}) => {
  const { mode } = useColorScheme();
  const unachievedBackgroundColor =
    mode === "dark"
    ? "rgba(50, 50, 50, 1)"
    : "rgba(190, 190, 190, 0.3)";
  const backgroundColor = achieved
    ? mode === "light"
      ? "#559bd0"
      : "#2d6992"
    : unachievedBackgroundColor;
  const border = achieved ? "gray solid thin" : "rgba(100,100,100,0.2) solid thin";
  const detailColor = achieved 
    ? mode === "dark"
      ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 0.8)"
    : mode === "dark" 
      ? "rgba(100, 100, 100, 0.7)"
      : "rgba(150, 150, 150, 0.8)";;


  return (
    <HoverTooltip
      text={
        achieved
          ? t("components.tooltip.swimCertificate.achieved")
          : t("components.tooltip.swimCertificate.notAchieved")
      }
    >
      <Box
        sx={{
          background: backgroundColor,
          border,
          borderRadius: "100%",
          height: ICON_SIZE,
          width: ICON_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          ...sx,
        }}
      >
        <PoolIcon
          sx={{
            fill: detailColor,
            height: "100%",
            width: "100%",
            transition: "none",
          }}
        />
      </Box>
    </HoverTooltip>
  );
};

export default SwimCertificateIcon;
