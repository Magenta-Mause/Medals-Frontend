import CreatePasswordComponent from "@components/CreatePasswordComponent/CreatePasswordComponent";
import PasswordStrengthBar from "@components/PasswordStrengthBar/PasswordStrengthBar";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import usePasswordValidation from "@hooks/usePasswordValidation";
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

interface ResetPasswordFormElement extends HTMLFormElement {
  readonly elements: ResetPasswordFormElements;
}

interface ResetPasswordFormElements extends HTMLFormControlsCollection {
  password: HTMLInputElement;
}

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword } = useApi();
  const [searchParams] = useSearchParams();
  const [hasCode, setCode] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const setPasswordCallback = async (data: { password: string }) => {
    resetPassword(data.password, searchParams.get("oneTimeCode") ?? "");
  };

  const {
    mutate: setPassword,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: setPasswordCallback,
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
              {t("pages.resetPassword.header")}
            </Typography>
            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {hasCode
                ? t("pages.resetPassword.subheader.hasCode")
                : t("pages.resetPassword.subheader.noCode")}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          {hasCode ? (
            <form
              onSubmit={(event: React.FormEvent<ResetPasswordFormElement>) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  password: formElements.password.value,
                };

                setPassword(data);
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
                  password: formElements.password.value,
                };

                setPassword(data);
              }}
            >
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input name="email" placeholder={t("pages.resetPasswordPage.email")}/>
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
          )}
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default ResetPasswordPage;
