import React from "react";
import { Box } from "@mui/joy";
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
  const backgroundColor = achieved ? "#4caf50" : "#9e9e9e";
  const detailColor = "#fff";

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
          border: "gray solid thin",
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
        <PoolIcon sx={{ fill: detailColor, height: "100%", width: "100%" }} />
      </Box>
    </HoverTooltip>
  );
};

export default SwimCertificateIcon;
