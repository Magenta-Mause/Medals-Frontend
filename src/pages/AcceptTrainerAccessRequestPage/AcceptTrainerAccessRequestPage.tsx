import useApi from "@hooks/useApi";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import { useCallback, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router";
import LoginForm from "@pages/Login/LoginForm";
import { uuidRegex } from "constants/regex";

const AcceptTrainerAccessRequest = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { approveRequest, loginUser, getAccessRequest } = useApi();
  const [trainerName, setTrainerName] = useState<string>("");
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const { refreshIdentityToken, authorized } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      const oneTimeCode = searchParams.get("oneTimeCode");

      if (!oneTimeCode || !uuidRegex.test(oneTimeCode)) {
        setLoading(false);
        return;
      }

      const lookupUuid = async () => {
        const accessRequest = await getAccessRequest(oneTimeCode);
        setTrainerName(
          accessRequest?.trainer?.first_name +
            " " +
            accessRequest?.trainer?.last_name,
        );
        setAthleteId(accessRequest?.athlete.id ?? -1);
        setLoading(false);
      };
      lookupUuid();
    }
  }, [searchParams, authorized, getAccessRequest]);

  const accept = useCallback(
    async (oneTimeCode: string) => {
      try {
        await approveRequest(oneTimeCode, athleteId ?? -1);
        enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.success"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("snackbar.acceptTrainerAccessRequest.failed"), {
          variant: "error",
        });
      }
    },
    [athleteId, approveRequest, t],
  );
  const loginCallback = async (loginData: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await loginUser(loginData.email, loginData.password);

      if (res) {
        refreshIdentityToken();
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
        ) : loading ? (
          <Box
            sx={{
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <CircularProgress size={"lg"} />
            <Typography color={"neutral"}>{t("generic.loading")}</Typography>
          </Box>
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
                if (oneTimeCode) {
                  accept(oneTimeCode);
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
