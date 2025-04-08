import React from "react";
import { Box, Typography, useTheme } from "@mui/joy";

interface CertificateOptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const CertificateOptionCard: React.FC<CertificateOptionCardProps> = ({
  label,
  description,
  selected,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: "16px", // More rounded edges
        borderStyle: "solid",
        // Thicker border for selected option in light mode
        borderWidth: selected && theme.palette.mode === "light" ? "3px" : "2px",
        borderColor: selected
          ? theme.palette.mode === "dark"
            ? theme.palette.primary[500]
            : theme.palette.primary[700]
          : theme.palette.divider,
        // Background color for the selected option:
        bgcolor: selected
          ? theme.palette.mode === "dark"
            ? theme.palette.primary[900]
            : theme.palette.primary[100]
          : "transparent",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: theme.palette.primary[500],
          boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography level="body-lg" fontWeight="bold">
        {label}
      </Typography>
      <Typography level="body-sm" mt={0.5} sx={{ lineHeight: 1.4 }}>
        {description}
      </Typography>
    </Box>
  );
};

export default CertificateOptionCard;
