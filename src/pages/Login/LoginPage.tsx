import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import { Box, Stack, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LoginForm from "./LoginForm";
import UserSelectionForm from "./UserSelectionForm";

const LoginPage = () => {
  const { loginUser } = useApi();
  const navigate = useNavigate();
  const { refreshIdentityToken, selectedUser, authorized } =
    useContext(AuthContext);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedUser != null) {
      navigate("/");
    }
  }, [selectedUser, navigate]);

  const loginCallback = async (loginData: {
    email: string;
    password: string;
    persistent: boolean;
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
          [`& .MuiFormLabel-asterisk`]: {
            visibility: "hidden",
          },
          background: "rgba(236 236 231 / 0.9)",
          [theme.getColorSchemeSelector("dark")]: {
            background: "rgba(19 19 24 / 0.8)",
          },
          p: 5,
        })}
      >
        <Stack sx={{ gap: 4, mb: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <Typography component="h1" level="h3">
              {t("pages.loginPage.signIn.header")}
            </Typography>
            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {t("pages.loginPage.signIn.subheader")} test est
            </Typography>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 4, mt: 0 }}>
          {!authorized ? (
            <LoginForm loginCallback={login} isPending={isPending} />
          ) : (
            <></>
          )}
          {selectedUser == null && authorized ? <UserSelectionForm /> : <></>}
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default LoginPage;
