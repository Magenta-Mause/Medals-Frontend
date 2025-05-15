import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import { Box, Stack, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";
import LoginForm from "./LoginForm";
import UserSelectionForm from "./UserSelectionForm";
import InfoAtLoginModal from "@components/modals/InfoAtLoginModal/InfoAtLoginModal";

const LoginPage = () => {
  const { loginUser } = useApi();
  const { refreshIdentityToken, selectedUser, authorized } =
    useContext(AuthContext);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [isInfoAtLoginModalOpen, setInfoAtLoginModalOpen] = useState(false);

  const loginCallback = async (loginData: {
    email: string;
    password: string;
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
          background: "rgb(236 236 231)",
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
              {isUserSelection ? (
                t("pages.loginPage.userSelection.header")
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "95%",
                  }}
                >
                  {t("pages.loginPage.signIn.header")}
                  <Typography
                    sx={{
                      cursor: "pointer",
                      fontSize: "small",
                      paddingTop: 1,
                      color:
                        "var(--variant-plainColor, rgba(var(--joy-palette-primary-mainChannel) / 1))",
                    }}
                    onClick={() => {
                      setInfoAtLoginModalOpen(true);
                    }}
                  >
                    {t("pages.loginPage.info.linkButton")}
                  </Typography>
                </Box>
              )}
            </Typography>

            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {isUserSelection ? (
                t("pages.loginPage.userSelection.subheader")
              ) : (
                <>{t("pages.loginPage.signIn.subheader")}</>
              )}
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
        <InfoAtLoginModal
          open={isInfoAtLoginModalOpen}
          setOpen={(open: boolean) => setInfoAtLoginModalOpen(open)}
        />
      </Box>
    </SplitPageComponent>
  );
};

export default LoginPage;
