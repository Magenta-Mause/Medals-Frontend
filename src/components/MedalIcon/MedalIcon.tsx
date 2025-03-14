import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { Box } from "@mui/joy";

const MedalColors: Record<Medals, string> = {
  [Medals.GOLD]: "gold",
  [Medals.SILVER]: "silver",
  [Medals.BRONZE]: "bronze",
  [Medals.NONE]: "transparent",
};

const MedalIcon = (props: {
  category: DisciplineCategories;
  medalType: Medals;
}) => {
  const DisciplineIcon = DisciplineIcons[props.category];

  return (
    <Box
      sx={{
        background: MedalColors[props.medalType],
        border: "gray solid thin",
        width: "30px",
        height: "30px",
        borderRadius: "100%",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DisciplineIcon width={"15px"} height={"15px"} fill={"rgba(0,0,0,0.5)"} />
    </Box>
  );
};

export { MedalColors };
export default MedalIcon;
