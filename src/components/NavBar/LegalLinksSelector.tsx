import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { KeyboardArrowDown, InfoOutlined } from "@mui/icons-material";
import Toggler from "@components/NavBar/Toggler";
import { useState } from "react";

const LegalLinksSelector = ({ collapseSidebar }: { collapseSidebar: () => void }) => {
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
      path: "/acknowledgement",
      label: t("components.navbar.legalLinks.acknowledgement"),
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
          <ListItemButton onClick={() => setOpen(!open)} sx={{ mt: 1 }}>
            <InfoOutlined />
            <ListItemContent>
              <Typography level="title-sm">
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
        <List sx={{ gap: 0.5 }}>
          {links.map((link) => (
            <ListItem key={link.path}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  collapseSidebar();
                  setOpen(false);
                }}
              >
                <ListItemContent>{link.label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toggler>
    </ListItem>
  );
};

export default LegalLinksSelector;
