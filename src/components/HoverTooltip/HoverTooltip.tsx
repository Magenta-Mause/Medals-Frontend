import React from "react";
import MuiTooltip from "@mui/joy/Tooltip";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";

interface HoverTooltipProps {
  text: string;
  children: React.ReactElement;
  position?: MuiTooltipProps["placement"];
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({
  text,
  position = "top",
  children,
}) => {
  return (
    <MuiTooltip
      title={text}
      variant="soft"
      color="primary"
      size="sm"
      placement={position}
      enterDelay={400}
      enterNextDelay={400}
      sx={{ zIndex: 20000, userSelect: "none" }}
    >
      {children}
    </MuiTooltip>
  );
};

export default HoverTooltip;
