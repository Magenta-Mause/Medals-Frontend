import { StrictMode, useEffect, useState } from "react";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import { Box, Stack, Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";

const ValidateInvitePage = () => {
  const { t } = useTranslation();
  const { acceptInvite } = useApi();
  const [isValid, setValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const oneTimeCode = searchParams.get("oneTimeCode");
    const uuidRegex = new RegExp(
      "^[A-Za-z0-9_-]{10,}.[A-Za-z0-9_-]{10,}.[A-Za-z0-9_-]{10,}$",
    );
    if (!oneTimeCode || !uuidRegex.test(oneTimeCode)) {
      setValid(false);
      return;
    }

    const debounce = setTimeout(() => {
      try {
        setValid(true);
        acceptInvite(oneTimeCode);
        enqueueSnackbar(t("snackbar.validateAthleteInvite.success"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("snackbar.validateAthleteInvite.failed"), {
          variant: "error",
        });
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchParams, t]);

  return (
    <SplitPageComponent>
      <Box
        component="main"
        sx={() => ({
          my: "auto",
          py: 2,
          pb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 450,
          maxWidth: "100%",
          mx: "auto",
          borderRadius: "sm",
        })}
      >
        <StrictMode>
          <Stack
            sx={{
              width: "100%",
              maxWidth: 600,
              textAlign: "center",
              padding: 2,
              borderRadius: "5px",
              backgroundColor: "white",
            }}
          >
            {isValid ? (
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                color="success"
              >
                {t("pages.validateInvitePage.finished")}
              </Button>
            ) : (
              <Button disabled>{t("pages.validateInvitePage.loading")}</Button>
            )}
          </Stack>
        </StrictMode>
      </Box>
    </SplitPageComponent>
  );
};

export default ValidateInvitePage;
