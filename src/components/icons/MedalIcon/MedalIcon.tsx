import { Box, useColorScheme } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { useMedalColors } from "@hooks/useMedalColors";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { t } from "i18next";
import { ICON_SIZE } from "constants/iconSize";
import { BiTrophy } from "react-icons/bi";

interface MedalIconProps {
  category?: DisciplineCategories;
  medalType: Medals;
  sx?: SxProps;
}

export const MedalIcon = ({ category, medalType, sx }: MedalIconProps) => {
  const DisciplineIcon = category ? DisciplineIcons[category] : BiTrophy;
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme.colorScheme === "dark"
      ? "rgba(50, 50, 50, 1)"
      : "rgba(190, 190, 190, 0.3)";
  const mainColor =
    colorScheme.colorScheme === "dark"
      ? "rgb(255, 255, 255)"
      : "rgba(0, 0, 0, 0.8)";
  const mainColorGold = "rgba(0, 0, 0, 0.8)";
  const grayedOutColor =
    colorScheme.colorScheme === "dark"
      ? "rgba(100, 100, 100, 0.7)"
      : "rgba(150, 150, 150, 0.8)";

  const medalColors = useMedalColors();

  let medalColor: string | undefined;
  switch (medalType) {
    case Medals.GOLD:
      medalColor = medalColors[Medals.GOLD];
      break;
    case Medals.SILVER:
      medalColor = medalColors[Medals.SILVER];
      break;
    case Medals.BRONZE:
      medalColor = medalColors[Medals.BRONZE];
      break;
    case Medals.NONE:
      medalColor = undefined;
      break;
  }

  const tooltipText =
    t(
      category
        ? "disciplines.categories." + category + ".label"
        : "generic.deutschesSportabzeichen",
    ) +
    ": " +
    t("medals." + medalType);

  const iconBox = (
    <Box
      sx={{
        background: medalColor ?? backgroundColor,
        border:
          medalType === Medals.NONE
            ? "rgba(100, 100, 100, 0.2) solid thin"
            : "gray solid thin",
        borderRadius: "100%",
        height: ICON_SIZE,
        width: ICON_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      <DisciplineIcon
        fill={medalType === Medals.NONE ? grayedOutColor : medalType=== Medals.GOLD ? mainColorGold : mainColor}
        style={{ width: "60%", height: "60%", transition: "fill ease .9s" }}
      />
    </Box>
  );

  return <HoverTooltip text={tooltipText}>{iconBox}</HoverTooltip>;
};

export default MedalIcon;
