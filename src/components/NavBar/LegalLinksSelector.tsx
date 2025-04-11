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
import { useState, useRef, useEffect } from "react";

const LegalLinksSelector = ({
  collapseSidebar,
}: {
  collapseSidebar: () => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

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
