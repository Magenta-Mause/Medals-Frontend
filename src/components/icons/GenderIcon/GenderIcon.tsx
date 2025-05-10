import React from "react";
import { Chip } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { SxProps } from "@mui/joy/styles/types";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { Genders } from "@customTypes/enums";
import { ICON_SIZE } from "constants/iconSize";

interface GenderChipProps {
  gender: Genders | undefined;
  sx?: SxProps;
}

const GenderChip: React.FC<GenderChipProps> = ({ gender, sx }) => {
  const { t } = useTranslation();
  const translatedGender = t("genders." + gender);
  const letter = translatedGender.slice(0, 1).toUpperCase();

  return (
    <HoverTooltip text={translatedGender}>
      <Chip
        size="sm"
        sx={{
          aspectRatio: 1,
          height: ICON_SIZE,
          width: ICON_SIZE,
          border: "gray solid thin",
          textAlign: "center",
          ...sx,
        }}
      >
        {letter}
      </Chip>
    </HoverTooltip>
  );
};

export default GenderChip;
