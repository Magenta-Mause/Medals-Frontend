import { LanguageOutlined, KeyboardArrowDown } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
  List,
  Box,
} from "@mui/joy";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const Toggler = ({
  defaultExpanded = false,
  overridenOpen = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  overridenOpen?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          (overridenOpen ?? open)
            ? { gridTemplateRows: "1fr" }
            : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </Fragment>
  );
};

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
          <ListItemButton onClick={() => setOpen(!open)}>
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
        <List sx={{ gap: 0.5 }}>
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
