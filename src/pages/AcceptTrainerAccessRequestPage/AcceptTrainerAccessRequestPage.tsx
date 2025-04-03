import useApi from "@hooks/useApi";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Box, Stack, Button, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router";
import LoginForm from "@pages/Login/LoginForm";
import { jwtDecode } from "jwt-decode";

interface DecodeJWT {
  trainerName: string;
  athleteId: number;
}

const AcceptTrainerAccessRequest = () => {
  const { t } = useTranslation();
  const { approveRequest, loginUser } = useApi();
  const [trainerName, setTrainerName] = useState<string>("");
  const [athleteId, setAthleteId] = useState<number>();
  const [searchParams] = useSearchParams();
  const { refreshIdentityToken, authorized } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) {
      const oneTimeCode = searchParams.get("oneTimeCode");
      const uuidRegex = new RegExp(
        "^[A-Za-z0-9_-]{10,}.[A-Za-z0-9_-]{10,}.[A-Za-z0-9_-]{10,}$",
      );

      if (!oneTimeCode || !uuidRegex.test(oneTimeCode)) {
        return;
      }

      const decoded = jwtDecode<DecodeJWT>(oneTimeCode);
      setTrainerName(decoded.trainerName);
      setAthleteId(decoded.athleteId);
    }
  }, [searchParams, authorized]);

  const accept = async (oneTimeCode: string, athleteId: number) => {
    try {
      await approveRequest(oneTimeCode, athleteId);
      enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.success"), {
        variant: "success",
      });
    } catch {
      enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.failed"), {
        variant: "error",
      });
    }
  };

  const loginCallback = async (loginData: {
    email: string;
    password: string;
    privacyPolicy: boolean;
  }) => {
    try {
      const res = await loginUser(loginData.email, loginData.password);

      if (res) {
        await refreshIdentityToken();
      } else {
        enqueueSnackbar("Login failed", {
          variant: "error",
        });
      }
    } catch (error) {
      console.log("Error during login", error);
      enqueueSnackbar(t("snackbar.login.loginFailed"), { variant: "error" });
    }
  };

  const { isPending, mutate: login } = useMutation({
    mutationFn: loginCallback,
  });

  return (
    <SplitPageComponent>
      <Box
        component="main"
        sx={(theme) => ({
          my: "auto",
          py: 2,
          pb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 400,
          maxWidth: "100%",
          mx: "auto",
          borderRadius: "sm",
          "& form": {
            display: "flex",
            flexDirection: "column",
            gap: 2,
          },
          background: "rgba(236 236 231 / 0.9)",
          [theme.getColorSchemeSelector("dark")]: {
            background: "rgba(19 19 24 / 0.8)",
          },
          p: 5,
        })}
      >
        {!authorized ? (
          <>
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  {t("pages.loginPage.signIn.header")}
                </Typography>
                <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
                  {t("pages.loginPage.signIn.subheader")}
                </Typography>
              </Stack>
            </Stack>
            <LoginForm loginCallback={login} isPending={isPending} />
          </>
        ) : (
          <Stack>
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  {t("pages.validateRequestPage.header")}
                </Typography>
                <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
                  <span style={{ fontWeight: "bold" }}>{trainerName}</span>{" "}
                  {t("pages.validateRequestPage.subheader")}
                </Typography>
              </Stack>
            </Stack>
            <Button
              onClick={() => {
                const oneTimeCode = searchParams.get("oneTimeCode");
                if (oneTimeCode && athleteId) {
                  accept(oneTimeCode, athleteId);
                  navigate("/");
                }
              }}
              color="success"
            >
              {t("pages.validateRequestPage.accept")}
            </Button>
          </Stack>
        )}
      </Box>
    </SplitPageComponent>
  );
};

export default AcceptTrainerAccessRequest;
