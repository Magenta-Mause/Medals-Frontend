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
}

const AcceptTrainerAccessRequest = () => {
  const { t } = useTranslation();
  const { approveRequest, loginUser } = useApi();
  const [trainerName, setTrainerName] = useState<string>("");
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
    }
  }, [searchParams, authorized]);

  const accept = async (oneTimeCode: string) => {
    try {
      await approveRequest(oneTimeCode);
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
          <Stack sx={{ gap: 4, mt: 0 }}>
            {!authorized ? (
              <LoginForm loginCallback={login} isPending={isPending} />
            ) : (
              <Stack>
                <Typography sx={{ whiteSpace: "pre-line", paddingBottom: 2 }}>
                  <span style={{ fontWeight: "bold" }}>{trainerName}</span>{" "}
                  {t("pages.validateRequestPage.header")}
                </Typography>
                <Button
                  onClick={() => {
                    const oneTimeCode = searchParams.get("oneTimeCode");
                    if (oneTimeCode) {
                      accept(oneTimeCode);
                      navigate("/");
                    }
                  }}
                  color="success"
                  disabled={!trainerName}
                >
                  {t("pages.validateRequestPage.accept")}
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default AcceptTrainerAccessRequest;
