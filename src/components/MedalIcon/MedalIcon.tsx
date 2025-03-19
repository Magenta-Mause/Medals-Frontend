import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { Box, useColorScheme } from "@mui/joy";
import { IoMdClose } from "react-icons/io";

const MedalColors: Record<Medals, string | undefined> = {
  [Medals.GOLD]: "#EFC75E",
  [Medals.SILVER]: "#E4E7E7",
  [Medals.BRONZE]: "#ED9D5D",
  [Medals.NONE]: undefined,
};

const MedalIcon = (props: {
  category: DisciplineCategories;
  medalType: Medals;
  stillShowIconWhenNone?: boolean;
}) => {
  const DisciplineIcon = DisciplineIcons[props.category];
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme.colorScheme == "dark"
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(0, 0, 0, 0.3)";
  const mainColor =
    colorScheme.colorScheme == "dark"
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(0, 0, 0, 0.7)";
  const grayedOutColor =
    colorScheme.colorScheme == "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(255, 255, 255, 0.5)";
  return (
    <Box
      sx={{
        background: MedalColors[props.medalType] ?? backgroundColor,
        border:
          props.medalType == Medals.NONE && props.stillShowIconWhenNone
            ? "rgba(0,0,0,0.2) solid thin"
            : "gray solid thin",
        borderRadius: "100%",
        height: "100%",
        margin: 0,
        width: "auto",
        aspectRatio: "1",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.medalType == Medals.NONE && !props.stillShowIconWhenNone ? (
        <IoMdClose />
      ) : props.medalType != Medals.NONE ? (
        <DisciplineIcon fill={mainColor} />
      ) : (
        <DisciplineIcon fill={grayedOutColor} />
      )}
    </Box>
  );
};

export { MedalColors };
export default MedalIcon;
