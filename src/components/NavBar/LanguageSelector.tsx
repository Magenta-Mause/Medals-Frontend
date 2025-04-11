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
import { useRef, useEffect } from "react";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      if (open) {
        listRef.current.style.maxHeight = `${listRef.current.scrollHeight}px`;
        listRef.current.style.opacity = "1";
        listRef.current.style.transform = "translateY(0)";
        listRef.current.style.visibility = "visible";
      } else {
        listRef.current.style.maxHeight = "0px";
        listRef.current.style.opacity = "0";
        listRef.current.style.transform = "translateY(-10px)";
        listRef.current.style.visibility = "hidden";
      }
    }
  }, [open]);

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
          ref={listRef}
          sx={{
            gap: 0.5,
            position: "absolute",
            width: "100%",
            bottom: "3em",
            overflow: "hidden",
            maxHeight: 0,
            opacity: 0,
            transform: "translateY(-10px)",
            visibility: "hidden",
            transition: "all 0.3s ease",
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
