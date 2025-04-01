import { useTheme } from "@mui/joy/styles";

export const useMedalColors = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return {
    gold: isDarkMode ? "#FFEB00" : "#FFD700",
    silver: isDarkMode ? "#EEEEEE" : "#C0C0C0",
    bronze: isDarkMode ? "#D84315" : "#CD7F32",
  };
};
