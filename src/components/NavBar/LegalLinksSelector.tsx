import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { InfoOutlined, KeyboardArrowDown } from "@mui/icons-material";
import Toggler from "@components/NavBar/Toggler";
import { useState } from "react";

const LegalLinksSelector = ({
  collapseSidebar,
}: {
  collapseSidebar: () => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: "/imprint", label: t("components.navbar.legalLinks.imprint") },
    {
      path: "/privacyPolicy",
      label: t("components.navbar.legalLinks.privacyPolicy"),
    },
    {
      path: "/credits",
      label: t("components.navbar.legalLinks.credits"),
    },
  ];

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
            sx={{ mt: 1, zIndex: 9 }}
          >
            <InfoOutlined />
            <ListItemContent>
              <Typography level="title-sm" sx={{ userSelect: "none" }}>
                {t("components.navbar.legalLinks.title")}
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
            pt: "35px",
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
          {links.map((link) => (
            <ListItem key={link.path}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  collapseSidebar();
                  setOpen(false);
                }}
              >
                <ListItemContent sx={{ userSelect: "none" }}>
                  {link.label}
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toggler>
    </ListItem>
  );
};

export default LegalLinksSelector;
