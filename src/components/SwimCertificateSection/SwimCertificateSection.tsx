import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";

interface SwimCertificateSectionProps {
  athlete: Athlete;
  onCertificateDeleted?: () => void;
}

const SwimCertificateSection: React.FC<SwimCertificateSectionProps> = ({
  athlete,
  onCertificateDeleted,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { deleteSwimmingCertificate } = useApi();
  const [loading, setLoading] = useState<boolean>(false);

  const hasCertificate = Boolean(
    athlete.swimming_certificate && athlete.swimming_certificate !== "",
  );

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSwimmingCertificate(athlete.id!);
      enqueueSnackbar(t("snackbar.swimCertificate.deletionSuccess"), {
        variant: "success",
      });
      if (onCertificateDeleted) {
        onCertificateDeleted();
      }
    } catch (error) {
      console.error("Error deleting swim certificate:", error);
      enqueueSnackbar(t("snackbar.swimCertificate.deletionError"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasCertificate) {
    return (
      <Box
        sx={{
          marginTop: 2,
          padding: 2,
          border: "1px solid",
          borderColor: "warning.main",
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Typography color="warning">
          {t(
            "components.swimCertificateSection.noCertificateWarning",
            "No swim certificate achieved.",
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginTop: 2,
        padding: 2,
        border: "1px solid",
        borderColor: "success.main",
        borderRadius: 1,
      }}
    >
      {/* Display the achieved certificate icon */}
      <SwimCertificateIcon achieved={true} />

      {/* Show the certificate label from translation based on the certificate type value */}
      <Typography>
        {t(
          `components.swimCertificateSection.certificateLabel.${athlete.swimming_certificate}`,
          athlete.swimming_certificate,
        )}
      </Typography>

      {/* Delete button */}
      <Button onClick={handleDelete} disabled={loading}>
        {t(
          "components.swimCertificateSection.deleteButton",
          "Delete Certificate",
        )}
      </Button>
    </Box>
  );
};

export default SwimCertificateSection;
