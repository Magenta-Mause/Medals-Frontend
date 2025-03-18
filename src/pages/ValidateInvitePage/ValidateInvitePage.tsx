import { StrictMode, useContext, useEffect, useState } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import { Box, Stack, Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";

const AcceptTrainerAccessRequest = () => {
  const { t } = useTranslation();
  const { approveRequest } = useApi();
  const [isValid, setValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshIdentityToken } = useContext(AuthContext);

  useEffect(() => {
    const token = refreshIdentityToken();

    if (token === null) {
      console.log("Token is null, redirecting to login");
      enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.noLogin"));
      navigate("/login");
      return;
    }

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
        approveRequest(oneTimeCode);
        enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.success"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.failed"), {
          variant: "error",
        });
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchParams, approveRequest, t]);

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
          <StrictMode>
            {isValid ? (
              <Button
                onClick={() => {
                  navigate("/");
                }}
                color="success"
              >
                {t("pages.validateInvitePage.finished")}
              </Button>
            ) : (
              <Button disabled>{t("pages.validateInvitePage.loading")}</Button>
            )}
          </StrictMode>
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default AcceptTrainerAccessRequest;
