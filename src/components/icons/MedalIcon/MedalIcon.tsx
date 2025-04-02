import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { Box, useColorScheme } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useMedalColors } from "@hooks/useMedalColors";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { t } from "i18next";

interface MedalIconProps {
  category: DisciplineCategories;
  medalType: Medals;
  sx?: SxProps;
  iconSize?: string;
}

export const MedalIcon = ({ category, medalType, sx, iconSize }: MedalIconProps) => {
  const DisciplineIcon = DisciplineIcons[category];
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme.colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(0, 0, 0, 0.2)";
  const mainColor =
    colorScheme.colorScheme === "dark"
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(0, 0, 0, 0.7)";
  const grayedOutColor =
    colorScheme.colorScheme === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(255, 255, 255, 1)";

  const medalColors = useMedalColors();

  let medalColor: string | undefined;
  switch (medalType) {
    case Medals.GOLD:
      medalColor = medalColors.gold;
      break;
    case Medals.SILVER:
      medalColor = medalColors.silver;
      break;
    case Medals.BRONZE:
      medalColor = medalColors.bronze;
      break;
    case Medals.NONE:
      medalColor = undefined;
      break;
  }

  const tooltipText =
    medalType === Medals.GOLD
      ? t("medals.GOLD")
      : medalType === Medals.SILVER
      ? t("medals.SILVER")
      : medalType === Medals.BRONZE
      ? t("medals.BRONZE")
      : t("medals.NONE");

  const iconBox = (
    <Box
      sx={{
        background: medalColor ?? backgroundColor,
        border:
          medalType === Medals.NONE
            ? "rgba(0,0,0,0.2) solid thin"
            : "gray solid thin",
        borderRadius: "100%",
        height: iconSize || "2.5rem",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      {medalType === Medals.NONE ? (
        <DisciplineIcon fill={grayedOutColor} />
      ) : (
        <DisciplineIcon fill={mainColor} />
      )}
    </Box>
  );

  return <HoverTooltip text={tooltipText}>{iconBox}</HoverTooltip>;
};

export default MedalIcon;
