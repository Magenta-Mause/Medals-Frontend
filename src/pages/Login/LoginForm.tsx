import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useState } from "react";

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  privacyPolicy: HTMLInputElement;
}

const LoginForm = (props: {
  loginCallback: (formValues: {
    email: string;
    password: string;
    privacyPolicy: boolean;
  }) => void;
  isPending: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  return (
    <form
      onSubmit={(event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
          email: formElements.email.value,
          password: formElements.password.value,
          privacyPolicy: formElements.privacyPolicy.checked,
        };

        props.loginCallback(data);
      }}
    >
      <FormControl required>
        <FormLabel>{t("pages.loginPage.signIn.input.email")}</FormLabel>
        <Input type="email" name="email" />
      </FormControl>
      <FormControl required>
        <FormLabel>{t("pages.loginPage.signIn.input.password")}</FormLabel>
        <Input type="password" name="password" />
      </FormControl>
      <Stack sx={{ gap: 4, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Checkbox
            size="sm"
            name="privacyPolicy"
            checked={privacyPolicyChecked}
            onChange={(e) => setPrivacyPolicyChecked(e.target.checked)}
          />
          <Typography level="body-sm">
            <Link
              level="body-sm"
              onClick={() => {
                navigate("/privacyPolicy");
              }}
            >
              {t("pages.loginPage.signIn.privacyPolicy")}
            </Link>
          </Typography>
          <Link
            level="title-sm"
            onClick={() => {
              navigate("/resetPassword");
            }}
          >
            {t("pages.loginPage.signIn.forgotPassword")}
          </Link>
        </Box>
        <Button type="submit" fullWidth disabled={props.isPending}>
          {!props.isPending ? (
            t("pages.loginPage.signIn.submit")
          ) : (
            <>{t("pages.loginPage.signIn.loading")}</>
          )}
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
