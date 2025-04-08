import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/backendTypes";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";
import CreateSwimCertificateModal from "@components/modals/CreateSwimCertificateModal/CreateSwimCertificateModal";
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";

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

  return (
    <Box
      sx={{
        marginTop: 2,
        padding: 2,
        borderRadius: 10,
        background: "rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SwimCertificateIcon achieved={hasCertificate} />
        {hasCertificate ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>
              {t(
                `components.createSwimCertificateModal.options.${athlete.swimming_certificate}.label`,
              )}
            </Typography>
            <InfoTooltip
              text={t(
                `components.createSwimCertificateModal.options.${athlete.swimming_certificate}.description`,
              )}
              iconProps={{ fontSize: "medium" }}
            />
          </Box>
        ) : (
          <Typography>
            {t(
              "components.swimCertificateSection.noCertificateWarning",
              "No swim certificate achieved.",
            )}
          </Typography>
        )}
      </Box>

      {hasCertificate && (
        <Box>
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="danger"
            disabled={loading}
          >
            {t(
              "components.swimCertificateSection.deleteButton",
              "Delete Certificate",
            )}
          </Button>
        </Box>
      )}

      {!hasCertificate && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setModalOpen(true)}>
            {t(
              "pages.athleteDetailPage.createSwimCertificateButton",
              "Schwimmnachweis erstellen",
            )}
          </Button>
        </Box>
      )}

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
