import { DisciplineIcons } from "@components/AthletePerformanceAccordions/AthletePerformanceAccordions";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import { Box } from "@mui/joy";
import { IoMdClose } from "react-icons/io";

const MedalColors: Record<Medals, string> = {
  [Medals.GOLD]: "#EFC75E",
  [Medals.SILVER]: "#E4E7E7",
  [Medals.BRONZE]: "#ED9D5D",
  [Medals.NONE]: "white",
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
      {props.medalType == Medals.NONE ? (
        <IoMdClose />
      ) : (
        <DisciplineIcon fill={"rgba(0,0,0,0.5)"} />
      )}
    </Box>
  );
};

export { MedalColors };
export default MedalIcon;
