import CreatePasswordComponent from "@components/CreatePasswordComponent/CreatePasswordComponent";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import { ArrowBackIos } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

interface ResetPasswordFormElement extends HTMLFormElement {
  readonly elements: ResetPasswordFormElements;
}

interface ResetPasswordFormElements extends HTMLFormControlsCollection {
  password?: HTMLInputElement;
  email?: HTMLInputElement;
}

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword, initiatePasswordReset } = useApi();
  const [searchParams] = useSearchParams();
  const [hasCode, setCode] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const initiatePasswordResetCallback = async (email: string) => {
    try {
      await initiatePasswordReset(email);
      enqueueSnackbar(t("snackbar.resetPassword.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error during password reset", error);
      enqueueSnackbar(t("snackbar.resetPassword.failed"), {
        variant: "error",
      });
      throw new Error("Failed to reset password");
    }
  };

  const setPasswordCallback = async (data: { password: string }) => {
    try {
      await resetPassword(data.password, searchParams.get("oneTimeCode") ?? "");
      enqueueSnackbar(t("snackbar.setPassword.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error during password reset", error);
      enqueueSnackbar(t("snackbar.setPassword.failed"), {
        variant: "error",
      });
      throw new Error("Failed to reset password");
    }
  };

  const {
    mutate: setPassword,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: setPasswordCallback,
  });

  const {
    mutate: initiatePasswordResetMutate,
    isPending: initiatePending,
    isSuccess: initiateSuccess,
  } = useMutation({
    mutationFn: initiatePasswordResetCallback,
  });

  useEffect(() => {
    if (!searchParams.has("oneTimeCode")) {
      setCode(false);
      return;
    }
    const oneTimeCode = searchParams.get("oneTimeCode");
    const uuidRegex = new RegExp(
      "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    );
    if (!uuidRegex.test(oneTimeCode || "")) {
      setCode(false);
      return;
    }
    setCode(true);
  }, [searchParams]);

  return (
    <SplitPageComponent>
      <Box display="flex">
        <Button
          color="neutral"
          variant="soft"
          onClick={() => navigate("/profile")}
        >
          {<ArrowBackIos />} Back
        </Button>
      </Box>
      <Box
        component="main"
        sx={(theme) => ({
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
              {t("pages.resetPasswordPage.header")}
            </Typography>
            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {hasCode
                ? t("pages.resetPasswordPage.subheader.hasCode")
                : t("pages.resetPasswordPage.subheader.noCode")}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          {hasCode ? (
            <form
              onSubmit={(event: React.FormEvent<ResetPasswordFormElement>) => {
                if (!isSuccess) {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  const data = {
                    password: formElements.password!.value,
                  };

                  setPassword(data);
                  logout();
                } else {
                  navigate("/login");
                }
              }}
            >
              <FormControl required>
                <CreatePasswordComponent
                  isSuccess={isSuccess}
                  isPending={isPending}
                  setPasswordValid={setPasswordValid}
                />
              </FormControl>
              <Stack sx={{ gap: 4 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isPending || !passwordValid}
                  color={
                    !passwordValid
                      ? "neutral"
                      : isSuccess
                        ? "success"
                        : "primary"
                  }
                >
                  {isPending
                    ? t("pages.setPasswordPage.form.loading")
                    : isSuccess
                      ? t("pages.setPasswordPage.form.goToLogin")
                      : t("pages.setPasswordPage.form.submit")}
                </Button>
              </Stack>
            </form>
          ) : (
            <form
              onSubmit={(event: React.FormEvent<ResetPasswordFormElement>) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  email: formElements.email!.value,
                };

                initiatePasswordResetMutate(data.email);
              }}
            >
              <FormControl required>
                <FormLabel>{t("pages.resetPasswordPage.email")}</FormLabel>
                <Input
                  name="email"
                  placeholder={t("pages.resetPasswordPage.email")}
                  onChange={(event) => {
                    const emailRegex = /^.*@.*\..+$/;
                    setEmailValid(emailRegex.test(event.target.value));
                  }}
                />
              </FormControl>
              <Stack sx={{ gap: 4 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={initiatePending || !emailValid || initiateSuccess}
                  color={
                    !emailValid
                      ? "neutral"
                      : initiateSuccess
                        ? "success"
                        : "primary"
                  }
                >
                  {initiatePending
                    ? t("pages.setPasswordPage.form.loading")
                    : initiateSuccess
                      ? t("pages.resetPasswordPage.button.success.noCode")
                      : t("pages.resetPasswordPage.button.noCode")}
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default ResetPasswordPage;
