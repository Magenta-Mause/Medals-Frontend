import React from "react";
import MuiTooltip from "@mui/joy/Tooltip";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoTooltipProps {
  text: string;
  position?: MuiTooltipProps["placement"];
  iconProps?: Partial<React.ComponentProps<typeof InfoOutlinedIcon>>;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  position = "top",
  iconProps,
}) => {
  return (
    <MuiTooltip
      title={<span style={{ maxWidth: 220, display: "inline-block", whiteSpace: "normal" }}>{text}</span>}
      variant="soft"
      color="primary"
      size="sm"
      placement={position}
      enterDelay={400}
      enterNextDelay={400}
      sx={{ zIndex: 20000 }}
    >
      <InfoOutlinedIcon style={{ cursor: "pointer" }} fontSize="small" {...iconProps} />
    </MuiTooltip>
  );
};
