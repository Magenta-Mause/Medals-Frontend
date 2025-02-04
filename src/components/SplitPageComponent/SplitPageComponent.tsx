import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import LanguageSelectionButton from "@components/LanguageSelectionButton/LanguageSelectionButton";
import MedalsIcon from "@components/MedalsIcon/MedalsIcon";
import useImageLoading from "@hooks/useImageLoading";
import { GlobalStyles, Box, IconButton, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

const SplitPageComponent = ({ children }: { children: ReactNode }) => {
  const imageUrlWhiteMode = useImageLoading([
    "https://images.pexels.com/photos/9501967/pexels-photo-9501967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/9501967/pexels-photo-9501967.jpeg?w=1920&h=1080",
  ]);
  const imageUrlDarkmode = useImageLoading([
    "https://images.pexels.com/photos/1564420/pexels-photo-1564420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1564420/pexels-photo-1564420.jpeg?w=1920&h=1080",
  ]);
  const { t } = useTranslation();

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
          background: "rgba(236 236 231 / 0.6)",
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
            <Box
              sx={(theme) => ({
                gap: 2,
                display: "flex",
                alignItems: "center",
                background: "rgba(236 236 231 / 0.9)",
                p: 1,
                borderRadius: 5,
                [theme.getColorSchemeSelector("dark")]: {
                  background: "rgba(0, 0, 0, 0.3)",
                },
              })}
            >
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
              <ColorSchemeToggle
                sx={(theme) => ({
                  background: "rgba(255, 255, 255, 0.3)",
                  [theme.getColorSchemeSelector("dark")]: {
                    background: "rgba(0, 0, 0, 0.3)",
                  },
                })}
              />
            </Box>
          </Box>
          {children}
          <Box
            component="footer"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LanguageSelectionButton
              sx={(theme) => ({
                background: "rgba(255, 255, 255, 0.3)",
                [theme.getColorSchemeSelector("dark")]: {
                  background: "rgba(0, 0, 0, 0.3)",
                },
              })}
            />
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

export default SplitPageComponent;
