import MuiTooltip from "@mui/joy/Tooltip";
import { SxProps } from "@mui/material";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";
import { Box } from "@mui/joy";

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  sx?: SxProps | undefined;
  position?: MuiTooltipProps["placement"];
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = "top",
  sx,
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
      sx={{
        ...sx,
        zIndex: 20000,
        position: "relative",
        display: "inline-flex",
        "::after": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          content: "'ⓘ'",
          position: "absolute",
          top: 0,
          right: 0,
          transform: "translate(50%, -50%)",
          width: "20px",
          borderRadius: "5px",
          height: "20px",
          opacity: 0.5,
          fontSize: "12px",
        },
      }}
    >
      <Box>{children}</Box>
    </MuiTooltip>
  );
};

export default Tooltip;
