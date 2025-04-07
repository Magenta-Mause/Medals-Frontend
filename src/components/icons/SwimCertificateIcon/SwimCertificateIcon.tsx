import React from "react";
import { Box } from "@mui/joy";
import PoolIcon from "@mui/icons-material/Pool";
import type { SxProps } from "@mui/joy/styles/types";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { t } from "i18next";

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
          height: "100%",
          margin: 0,
          width: "auto",
          aspectRatio: "1",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
      >
        <PoolIcon sx={{ fill: detailColor }} />
      </Box>
    </HoverTooltip>
  );
};

export default SwimCertificateIcon;
