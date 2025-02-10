import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import CreatePasswordComponent from "@components/CreatePasswordComponent/CreatePasswordComponent";
import SplitPageComponent from "@components/SplitPageComponent/SplitPageComponent";
import useApi from "@hooks/useApi";
import { Box, Button, FormControl, Stack, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

interface SetPasswordFormElement extends HTMLFormElement {
  readonly elements: SetPasswordFormElements;
}

interface SetPasswordFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

const SetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { setPassword: setPasswordApi } = useApi();
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [passwordValid, setPasswordValid] = useState(false);

  const setPasswordCallback = async (data: { password: string }) => {
    logout();
    try {
      const result = await setPasswordApi(
        data.password,
        searchParams.get("oneTimeCode")!,
      );
      if (result === false) {
        throw new Error("Failed to set password");
      }
      enqueueSnackbar(t("snackbar.setPassword.success"), {
        variant: "success",
      });
    } catch {
      enqueueSnackbar(t("snackbar.setPassword.failed"), { variant: "error" });
      throw new Error("Failed to set password");
    }
  };
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    if (!searchParams.has("oneTimeCode")) {
      setValid(false);
      return;
    }
    const oneTimeCode = searchParams.get("oneTimeCode");
    const uuidRegex = new RegExp(
      "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    );
    if (!uuidRegex.test(oneTimeCode || "")) {
      setValid(false);
      return;
    }
    setValid(true);
  }, [searchParams]);

  const {
    mutate: loginCallback,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: setPasswordCallback,
  });

  const buttonCallback = useCallback(
    (formData: { password: string }) => {
      if (isSuccess) {
        navigate("/login");
      } else {
        loginCallback(formData);
      }
    },
    [isSuccess, loginCallback, navigate],
  );

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
              {t("pages.setPasswordPage.header")}
            </Typography>
            <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
              {t("pages.setPasswordPage.subheader")}
            </Typography>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 4, mt: 0 }}>
          {isValid ? (
            <form
              onSubmit={(event: React.FormEvent<SetPasswordFormElement>) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  password: formElements.password.value,
                };

                buttonCallback(data);
              }}
            >
              <FormControl required>
                <CreatePasswordComponent
                  isPending={isPending}
                  isSuccess={isSuccess}
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
            <Typography textAlign={"center"} level="h4" sx={{ my: 10 }}>
              {t("pages.setPasswordPage.invalidCode")}
            </Typography>
          )}
        </Stack>
      </Box>
    </SplitPageComponent>
  );
};

export default SetPasswordPage;
