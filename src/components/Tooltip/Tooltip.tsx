import MuiTooltip from "@mui/joy/Tooltip";

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <MuiTooltip
      title={text}
      variant="soft"
      color="primary"
      size="sm"
      placement="top"
      sx={{
        zIndex: 20000,
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
