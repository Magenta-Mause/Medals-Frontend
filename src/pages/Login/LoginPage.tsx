import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import { Box, Stack, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";
import LoginForm from "./LoginForm";
import UserSelectionForm from "./UserSelectionForm";

const LoginPage = () => {
  const { loginUser } = useApi();
  const { refreshIdentityToken, selectedUser, authorized } =
    useContext(AuthContext);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

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

  if (
    authorized !== false &&
    selectedUser !== null &&
    selectedUser !== undefined
  ) {
    return <Navigate to="/" />;
  }
  const isUserSelection = selectedUser == null && authorized;

  return (
    <SplitPageComponent>
      <Box
        component="main"
        sx={(theme) => ({
          my: "auto",
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
          background: "rgba(236 236 231 / 1)",
          [theme.getColorSchemeSelector("dark")]: {
            background: "rgba(19 19 24 / 0.8)",
          },
          p: 5,
          pb: 4,
        })}
      >
        <Stack sx={{ gap: 4, mb: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <Typography component="h1" level="h3">
              {isUserSelection
                ? t("pages.loginPage.userSelection.header")
                : t("pages.loginPage.signIn.header")}
            </Typography>
            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {isUserSelection
                ? t("pages.loginPage.userSelection.subheader")
                : t("pages.loginPage.signIn.subheader")}
            </Typography>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 4, mt: 0 }}>
          {!authorized ? (
            <LoginForm loginCallback={login} isPending={isPending} />
          ) : (
            <></>
          )}
          {isUserSelection ? <UserSelectionForm /> : <></>}
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default LoginPage;
