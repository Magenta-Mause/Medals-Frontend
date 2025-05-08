import React, { useState } from "react";
import MuiTooltip from "@mui/joy/Tooltip";
import type { TooltipProps as MuiTooltipProps } from "@mui/joy/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GenericModal from "@components/modals/GenericModal";

interface InfoTooltipProps {
  text: string;
  header?: string;
  position?: MuiTooltipProps["placement"];
  iconProps?: Partial<React.ComponentProps<typeof InfoOutlinedIcon>>;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  header = "Information",
  position = "top",
  iconProps,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation(); // Prevent dropdowns from opening
    if (isTouchDevice) {
      setIsModalOpen(true);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdowns on desktop
  };

  return (
    <>
      <MuiTooltip
        title={
          <span
            style={{
              maxWidth: 220,
              display: "inline-block",
              whiteSpace: "normal",
            }}
          >
            {text}
          </span>
        }
        variant="soft"
        color="primary"
        size="sm"
        placement={position}
        enterDelay={400}
        enterNextDelay={400}
        sx={{ zIndex: 20000 }}
      >
        <InfoOutlinedIcon
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          style={{
            cursor: "pointer",
            padding: "4px",
            margin: "-4px",
            ...(isTouchDevice && isModalOpen ? { visibility: "hidden" } : {}),
          }}
          fontSize="small"
          {...iconProps}
        />
      </MuiTooltip>

      <GenericModal open={isModalOpen} setOpen={setIsModalOpen} header={header}>
        {text}
      </GenericModal>
    </>
  );
};

export default InfoTooltip;
