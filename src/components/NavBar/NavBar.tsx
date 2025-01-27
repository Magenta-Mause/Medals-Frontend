import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import InfoCard from "@components/InfoCard/InfoCard";
import useSidebar from "@hooks/useSidebar";
import {
  HomeRounded,
  KeyboardArrowDown,
  LanguageOutlined,
  LogoutRounded,
  PeopleRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  GlobalStyles,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  ListItemContent,
  Sheet,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useLocation, useNavigate } from "react-router";
import { Fragment } from "react/jsx-runtime";

const navBarElements = [
  {
    path: "/",
    icon: <HomeRounded />,
  },
  {
    path: "/athletes",
    icon: <PeopleRounded />,
  },
];

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
                {t("navbar.languageSelector")}
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
            <ListItem>
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

const NavBar = () => {
  const { collapseSidebar, sideBarExtended } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const warning = undefined;

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * " + (sideBarExtended ? "0" : "-1") + "))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs:
              "translateX(calc(100% * " +
              (sideBarExtended ? "0" : "-1") +
              " + " +
              (sideBarExtended ? "1" : "0") +
              " * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => collapseSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <Typography fontSize={"1.2rem"}>🥇</Typography>
        </IconButton>
        <Typography level="title-lg">{t("navbar.logo")}</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRounded />}
        placeholder={t("navbar.search")}
      />
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {navBarElements.map((element) => (
            <ListItem key={element.path}>
              <ListItemButton
                onClick={() => {
                  navigate(element.path);
                  collapseSidebar();
                }}
                selected={Boolean(matchPath(location.pathname, element.path))}
              >
                {element.icon}
                <ListItemContent>
                  <Typography level="title-sm">
                    {t("navbar.locationList." + element.path)}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            justifyContent: "flex-end",
            padding: "none",
          }}
        >
          <LanguageSelector />
          {warning ? (
            <InfoCard
              header={t("navbar.bottomInfoCard.header")}
              text={t("navbar.bottomInfoCard.text")}
              type={"warning"}
              buttonCallback={() => {}}
            />
          ) : (
            <></>
          )}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar variant="outlined" size="sm" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Max Musterman</Typography>
          <Typography level="body-xs" noWrap>
            max.musterman@gmail.com
          </Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRounded />
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default NavBar;
