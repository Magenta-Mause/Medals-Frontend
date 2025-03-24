import MuiTooltip from "@mui/joy/Tooltip";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";
interface TooltipProps {
  text: string;
  children: React.ReactElement;
  position?: MuiTooltipProps["placement"];
}

const Tooltip: React.FC<TooltipProps> = ({
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
      enterDelay={500}
      enterNextDelay={1000}
      sx={{
        zIndex: 20000,
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
