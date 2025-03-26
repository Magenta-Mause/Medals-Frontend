import React from "react";
import MuiTooltip from "@mui/joy/Tooltip";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoTooltipProps {
  text: string;
  position?: MuiTooltipProps["placement"];
  // Optionally, pass props to customize the info icon.
  iconProps?: Partial<React.ComponentProps<typeof InfoOutlinedIcon>>;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  position = "top",
  iconProps,
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
      <InfoOutlinedIcon
        style={{ cursor: "pointer" }}
        {...iconProps}
      />
    </MuiTooltip>
  );
};
