import { useTheme } from "@mui/joy/styles";

export const useMedalColors = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return {
    gold: isLightMode ? "#FFD700" : "#FFD700",
    silver: isLightMode ? "#C0C0C0" : "#C0C0C0",
    bronze: isLightMode ? "#CD7F32" : "#CD7F32",
  };
};
