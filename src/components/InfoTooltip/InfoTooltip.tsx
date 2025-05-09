import React, { useState, useRef } from "react";
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
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <span ref={tooltipRef}>
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
            style={{
              cursor: "pointer",
              padding: "4px", // Increase clickable area
              margin: "-4px",
            }}
            fontSize="small"
            {...iconProps}
          />
        </MuiTooltip>
      </span>

      <GenericModal open={isModalOpen} setOpen={setIsModalOpen} header={header}>
        {text}
      </GenericModal>
    </>
  );
};

export default InfoTooltip;
