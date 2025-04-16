import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";
import CreateSwimCertificateModal from "@components/modals/CreateSwimCertificateModal/CreateSwimCertificateModal";

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
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const hasCertificate = Boolean(athlete.swimming_certificate);

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
          alignItems: "center",
          minHeight: "50px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SwimCertificateIcon achieved={hasCertificate} />
          {hasCertificate ? (
            <Box>
              <Typography level="h4">
                {t(
                  `components.createSwimCertificateModal.options.${athlete.swimming_certificate}.label`,
                )}
              </Typography>
              <Typography level="body-sm">
                {t(
                  `components.createSwimCertificateModal.options.${athlete.swimming_certificate}.description`,
                )}
              </Typography>
            </Box>
          ) : (
            <Typography>
              {t("components.swimCertificateSection.noCertificateWarning")}
            </Typography>
          )}
        </Box>
        {/* Right aligned button */}
        <Box>
          {hasCertificate ? (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="danger"
              disabled={loading}
            >
              {t("components.swimCertificateSection.deleteButton")}
            </Button>
          ) : (
            <Button onClick={() => setModalOpen(true)}>
              {t("pages.athleteDetailPage.createSwimCertificateButton")}
            </Button>
          )}
        </Box>
      </Box>

      {!hasCertificate && (
        <CreateSwimCertificateModal
          open={isModalOpen}
          setOpen={setModalOpen}
          athleteId={athlete.id!}
        />
      )}
    </Box>
  );
};

export default SwimCertificateSection;
