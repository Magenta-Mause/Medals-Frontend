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
      enterDelay={700}
      enterNextDelay={700}
      sx={{ zIndex: 20000 }}
    >
      {children}
    </MuiTooltip>
  );
};

export default HoverTooltip;
