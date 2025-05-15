import {
  Check,
  KeyboardArrowDown,
  LanguageOutlined,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Toggler from "@components/NavBar/Toggler";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <ListItem
      nested
      sx={{
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <Toggler
        overridenOpen={open}
        renderToggle={() => (
          <ListItemButton
            onClick={() => setOpen(!open)}
            sx={{ mt: 1, zIndex: 10 }}
          >
            <LanguageOutlined />
            <ListItemContent>
              <Typography level="title-sm" sx={{ userSelect: "none" }}>
                {t("components.navbar.languageSelector")}
              </Typography>
            </ListItemContent>
            <KeyboardArrowDown
              sx={[
                open
                  ? {
                      transform: "none",
                      transition: "ease .3s transform",
                    }
                  : {
                      transform: "rotate(-180deg)",
                      transition: "ease .3s transform",
                    },
              ]}
            />
          </ListItemButton>
        )}
      >
        <List
          sx={{
            gap: 0.5,
            position: "absolute",
            width: "100%",
            bottom: "3em",
            overflow: "hidden",
            transition: "all 0.3s ease",
            backgroundColor: "var(--joy-palette-background-surface)",
            zIndex: 9,
            ...(!open
              ? {
                  transform: "translateY(50px)",
                  opacity: 0,
                  pointerEvents: "none",
                }
              : {
                  transform: "translateY(0)",
                  opacity: 1,
                  pointerEvents: "all",
                }),
          }}
        >
          {Object.keys(i18n.options.resources ?? []).map((language) => (
            <ListItem key={language}>
              <ListItemButton
                onClick={() => {
                  i18n.changeLanguage(language);
                  setOpen(false);
                }}
                selected={i18n.language === language}
              >
                {/* Always render the decorator to preserve layout */}
                <ListItemDecorator sx={{ width: "1.5em" }}>
                  {i18n.language === language ? <Check /> : null}
                </ListItemDecorator>
                <ListItemContent sx={{ userSelect: "none" }}>
                  {t("languages." + language)}
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toggler>
    </ListItem>
  );
};

export default LanguageSelector;
