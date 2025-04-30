import { Medals } from "@customTypes/enums";
import { useTheme } from "@mui/joy/styles";

export const useMedalColors = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return {
    [Medals.GOLD]: isLightMode ? "#FFD700" : "#e8bf00",
    [Medals.SILVER]: isLightMode ? "#b4b4b4" : "#9a9a9a",
    [Medals.BRONZE]: isLightMode ? "#CD7F32" : "#9f5c02",
  };
};
