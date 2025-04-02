import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { Box, useColorScheme } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useMedalColors } from "@hooks/useMedalColors";
import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { t } from "i18next";

const MedalIcon = (props: {
  category: DisciplineCategories;
  medalType: Medals;
  sx?: SxProps;
}) => {
  const DisciplineIcon = DisciplineIcons[props.category];
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

  // Determine which color to use based on the medal type
  let medalColor: string | undefined;
  switch (props.medalType) {
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

  // Determine the tooltip text based on the medal type
  const tooltipText =
    props.medalType === Medals.GOLD
      ? t("medals.GOLD")
      : props.medalType === Medals.SILVER
      ? t("medals.SILVER")
      : props.medalType === Medals.BRONZE
      ? t("medals.BRONZE")
      : t("medals.NONE");

  const iconBox = (
    <Box
      sx={{
        background: medalColor ?? backgroundColor,
        border:
          props.medalType === Medals.NONE
            ? "rgba(0,0,0,0.2) solid thin"
            : "gray solid thin",
        borderRadius: "100%",
        height: "2.5rem",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...props.sx,
      }}
    >
      {props.medalType === Medals.NONE ? (
        <DisciplineIcon fill={grayedOutColor} />
      ) : (
        <DisciplineIcon fill={mainColor} />
      )}
    </Box>
  );

  return <HoverTooltip text={tooltipText}>{iconBox}</HoverTooltip>;
};

export default MedalIcon;
