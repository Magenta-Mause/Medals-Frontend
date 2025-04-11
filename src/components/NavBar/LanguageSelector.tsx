import { KeyboardArrowDown, LanguageOutlined } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
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
          <ListItemButton onClick={() => setOpen(!open)} sx={{ mt: 1 }}>
            <LanguageOutlined />
            <ListItemContent>
              <Typography level="title-sm">
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
            visibility: open ? "visible" : "hidden",
            backgroundColor: "var(--joy-palette-background-surface)",
          }}
        >
          {Object.keys(i18n.options.resources ?? []).map((language) => (
            <ListItem key={language}>
              <ListItemButton
                onClick={() => {
                  i18n.changeLanguage(language);
                  setOpen(false);
                }}
                selected={i18n.language == language}
              >
                <ListItemContent>{t("languages." + language)}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toggler>
    </ListItem>
  );
};

export default LanguageSelector;
