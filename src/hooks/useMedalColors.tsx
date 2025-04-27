import { Medals } from "@customTypes/enums";
import { useTheme } from "@mui/joy/styles";

export const useMedalColors = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return {
    [Medals.GOLD]: isLightMode ? "#FFD700" : "#FFD700",
    [Medals.SILVER]: isLightMode ? "#C0C0C0" : "#C0C0C0",
    [Medals.BRONZE]: isLightMode ? "#CD7F32" : "#CD7F32",
  };
};
