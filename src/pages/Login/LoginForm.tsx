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
import { useState, useEffect } from "react";
import PrivacyPolicyModal from "@components/PrivacyPolicyModal/PrivacyPolicyModal";
import PasswordInput from "@components/PasswordInput/PasswordInput";

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
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  useEffect(() => {
    const privacyPolicyAccepted = localStorage.getItem("privacyPolicyAccepted");
    if (privacyPolicyAccepted === "true") {
      setPrivacyPolicyChecked(true);
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setPrivacyPolicyChecked(isChecked);
    localStorage.setItem("privacyPolicyAccepted", isChecked.toString());
  };

  return (
    <>
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
        <FormControl required sx={{ position: "relative" }}>
          <FormLabel>{t("pages.loginPage.signIn.input.password")}</FormLabel>
          <PasswordInput placeholder="" />
          <FormLabel
            sx={{
              width: "100%",
              textAlign: "right",
              display: "block",
              p: "5px",
              pb: 0,
              mb: 0,
            }}
            slotProps={{ asterisk: { sx: { display: "none" } } }}
          >
            <Link
              level="title-sm"
              onClick={() => {
                navigate("/resetPassword");
              }}
            >
              {t("pages.loginPage.signIn.forgotPassword")}
            </Link>
          </FormLabel>
        </FormControl>
        <Stack sx={{ gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <FormControl
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Checkbox
                  size="sm"
                  name="privacyPolicy"
                  checked={privacyPolicyChecked}
                  onChange={handleCheckboxChange}
                />
                <FormLabel
                  sx={{
                    margin: 0,
                  }}
                >
                  <Typography level="body-sm">
                    {t("pages.loginPage.signIn.acceptOur")}
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
                      {" "}
                      {t("pages.loginPage.signIn.privacyPolicy")}
                    </span>
                  </Typography>
                  <Link
                    level="body-sm"
                    onClick={() => {}}
                    sx={{
                      "::before": {
                        content: '" "',
                      },
                    }}
                  ></Link>
                </FormLabel>
              </FormControl>
            </Box>
          </Box>
          <Button
            type="submit"
            fullWidth
            disabled={props.isPending || !privacyPolicyChecked}
          >
            {!props.isPending ? (
              t("pages.loginPage.signIn.submit")
            ) : (
              <>{t("pages.loginPage.signIn.loading")}</>
            )}
          </Button>
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
