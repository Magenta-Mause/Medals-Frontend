import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

const LoginForm = (props: {
  loginCallback: (formValues: {
    email: string;
    password: string;
    persistent: boolean;
  }) => void;
  isPending: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <form
      onSubmit={(event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
          email: formElements.email.value,
          password: formElements.password.value,
          persistent: formElements.persistent.checked,
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
            label={t("pages.loginPage.signIn.rememberMe")}
            name="persistent"
            disabled
            checked
          />
          <Link
            level="title-sm"
            href="#replace-with-a-link"
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
