import useApi from "@api/useApi";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import LanguageSelectionButton from "@components/LanguageSelectionButton/LanguageSelectionButton";
import MedalsIcon from "@components/MedalsIcon/MedalsIcon";
import useImageLoading from "@hooks/useImageLoading";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  GlobalStyles,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const LoginPage = () => {
  const { loginUser } = useApi();
  const navigate = useNavigate();
  const { refreshIdentityToken, authorized } = useContext(AuthContext);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const imageUrlWhiteMode = useImageLoading([
    "https://images.pexels.com/photos/9501967/pexels-photo-9501967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/9501967/pexels-photo-9501967.jpeg?w=1920&h=1080",
  ]);
  const imageUrlDarkmode = useImageLoading([
    "https://images.pexels.com/photos/1564420/pexels-photo-1564420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1564420/pexels-photo-1564420.jpeg?w=1920&h=1080",
  ]);

  useEffect(() => {
    if (authorized) {
      navigate("/");
    }
  }, [authorized, navigate]);

  const loginCallback = async (loginData: {
    email: string;
    password: string;
    persistent: boolean;
  }) => {
    console.log("Logging in: ", loginData);
    try {
      const res = await loginUser(loginData.email, loginData.password);

      if (res) {
        await refreshIdentityToken();
      } else {
        console.log("ERORR");
        enqueueSnackbar("Login failed", {
          variant: "error",
        });
      }
    } catch (error) {
      console.log("Error during login", error);
      enqueueSnackbar("Login failed", { variant: "error" });
    }
  };

  const { isPending, mutate: login } = useMutation({
    mutationFn: loginCallback,
  });

  return (
    <>
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "1s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.5)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.7)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <MedalsIcon size="inline" />
              </IconButton>
              <Typography level="title-lg">
                {t("pages.loginPage.logo")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
              }}
            >
              <ColorSchemeToggle />
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
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
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  {t("pages.loginPage.signIn.header")}
                </Typography>
                <Typography level="body-sm" sx={{ whiteSpace: "pre-line" }}>
                  {t("pages.loginPage.signIn.subheader")}{" "}
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={{ gap: 4, mt: 0 }}>
              <form
                onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  const data = {
                    email: formElements.email.value,
                    password: formElements.password.value,
                    persistent: formElements.persistent.checked,
                  };

                  login(data);
                }}
              >
                <FormControl required>
                  <FormLabel>
                    {t("pages.loginPage.signIn.input.email")}
                  </FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>
                    {t("pages.loginPage.signIn.input.password")}
                  </FormLabel>
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
                    <Link level="title-sm" href="#replace-with-a-link">
                      {t("pages.loginPage.signIn.forgotPassword")}
                    </Link>
                  </Box>
                  <Button type="submit" fullWidth disabled={isPending}>
                    {!isPending ? (
                      t("pages.loginPage.signIn.submit")
                    ) : (
                      <>Loading...</>
                    )}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LanguageSelectionButton />
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © {t("pages.loginPage.logo")} {new Date().getFullYear()}
            </Typography>
            <Box sx={{ px: 3 }}></Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(" + imageUrlWhiteMode + ")",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: "url(" + imageUrlDarkmode + ")",
          },
        })}
      />
    </>
  );
};

export default LoginPage;
