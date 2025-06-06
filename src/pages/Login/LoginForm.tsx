import {
  Button,
  FormControl,
  FormLabel,
  GlobalStyles,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useState } from "react";
import PrivacyPolicyModal from "@components/PrivacyPolicyModal/PrivacyPolicyModal";
import PasswordInput from "@components/PasswordInput/PasswordInput";

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

const LoginForm = (props: {
  loginCallback: (formValues: { email: string; password: string }) => void;
  isPending: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          [theme.getColorSchemeSelector("dark")]: {
            colorScheme: "dark",
          },
          [theme.getColorSchemeSelector("light")]: {
            colorScheme: "light",
          },
        })}
      />

      <form
        onSubmit={(event: React.FormEvent<SignInFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data = {
            email: formElements.email.value,
            password: formElements.password.value,
          };

          props.loginCallback(data);
        }}
      >
        <FormControl required>
          <FormLabel>{t("pages.loginPage.signIn.input.email")}</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl required sx={{ position: "relative" }}>
          <FormLabel>{t("pages.loginPage.signIn.input.password")}</FormLabel>
          <PasswordInput placeholder="" />
          <FormLabel
            sx={{
              width: "100%",
              textAlign: "right",
              display: "block",
            }}
            slotProps={{ asterisk: { sx: { display: "none" } } }}
          >
            <Link
              level="title-sm"
              onClick={() => {
                navigate("/resetPassword");
              }}
              sx={{ fontSize: "13px" }}
            >
              {t("pages.loginPage.signIn.forgotPassword")}
            </Link>
          </FormLabel>
        </FormControl>

        <Stack sx={{ gap: 2 }}>
          <Button
            type="submit"
            fullWidth
            disabled={props.isPending}
            sx={{ transition: "all ease .2s" }}
          >
            {!props.isPending ? (
              t("pages.loginPage.signIn.submit")
            ) : (
              <>{t("pages.loginPage.signIn.loading")}</>
            )}
          </Button>
          <Typography level="body-xs" sx={{ textAlign: "left" }}>
            {t("pages.loginPage.signIn.continueMeansAccept")}{" "}
            <span
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPrivacyPolicyModalOpen(true);
              }}
              style={{
                cursor: "pointer",
                color:
                  "var(--variant-plainColor, rgba(var(--joy-palette-primary-mainChannel) / 1))",
              }}
            >
              {t("pages.loginPage.signIn.privacyPolicy")}
            </span>
          </Typography>
        </Stack>
      </form>

      <PrivacyPolicyModal
        open={privacyPolicyModalOpen}
        setOpen={(open: boolean) => setPrivacyPolicyModalOpen(open)}
      />
    </>
  );
};
export default LoginForm;
