import MedalIcon from "@components/icons/MedalIcon/MedalIcon";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";
import CreateSwimCertificateModal from "@components/modals/CreateSwimCertificateModal/CreateSwimCertificateModal";
import { Medals } from "@customTypes/enums";
import { Box, Typography, Button } from "@mui/joy";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";

const AthleteTotalMedalSection = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        padding: "15px 20px",
        borderRadius: 10,
        background: "var(--joy-palette-background-level2)",
        width: "100%",
        mb: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          minHeight: "50px",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <Box>
            <MedalIcon medalType={Medals.GOLD} />
          </Box>
          <Box>
            <Typography level="h4" sx={{ fontSize: "md" }}>
              Total Medal
            </Typography>
            <Typography level="body-sm">2 Points</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AthleteTotalMedalSection;
