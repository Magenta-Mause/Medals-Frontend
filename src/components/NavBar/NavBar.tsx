import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import InfoCard from "@components/InfoCard/InfoCard";
import useSidebar from "@hooks/useSidebar";
import {
  Article,
  Assessment,
  Download,
  Equalizer,
  HelpCenter,
  HomeRounded,
  LogoutRounded,
  PeopleRounded,
  Person,
  PersonAddAlt,
  SearchRounded,
  SpaceDashboard,
  SupervisedUserCircleOutlined,
} from "@mui/icons-material";
import {
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
import { useTranslation } from "react-i18next";
import { matchPath, Navigate, useLocation, useNavigate } from "react-router";
import LanguageSelector from "./LanguageSelector";
import MedalsIcon from "@components/MedalsIcon/MedalsIcon";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const sharedNavBarElements = [
  {
    path: "/downloads",
    icon: <Download />,
  },
  {
    path: "/help",
    icon: <HelpCenter />,
  },
];

const navBarElements = {
  ADMIN: [
    {
      path: "/",
      icon: <HomeRounded />,
    },
    {
      path: "/trainer",
      icon: <PeopleRounded />,
    },
    ...sharedNavBarElements,
  ],
  TRAINER: [
    {
      path: "/",
      icon: <HomeRounded />,
    },
    {
      path: "/athletes",
      icon: <PeopleRounded />,
    },
    {
      path: "/performanceMetrics",
      icon: <Assessment />,
    },
    {
      path: "/assignAthlete",
      icon: <PersonAddAlt />,
    },
    ...sharedNavBarElements,
  ],
  ATHLETE: [
    {
      path: "/",
      icon: <HomeRounded />,
    },
    {
      path: "/dashboard",
      icon: <SpaceDashboard />,
    },
    {
      path: "/profile",
      icon: <Person />,
    },
    {
      path: "/requirements",
      icon: <Article />,
    },
    {
      path: "/performances",
      icon: <Equalizer />,
    },
    ...sharedNavBarElements,
  ],
};

const NavBar = () => {
  const { collapseSidebar, sideBarExtended } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const warning = undefined;
  const { logout, email, setSelectedUser, selectedUser, authorizedUsers } =
    useContext(AuthContext);
  const userRole = "ATHLETE";

  if (!userRole || !navBarElements[userRole]) {
    return <Navigate to="/userRoleErrorPage" />;
  }

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
        <IconButton variant="soft" color="primary" size="sm" sx={{ p: 0.5 }}>
          <MedalsIcon size="inline" />
        </IconButton>
        <Typography level="title-lg">{t("components.navbar.logo")}</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRounded />}
        placeholder={t("components.navbar.search")}
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
          {navBarElements[userRole].map((element) => (
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
                    {t("components.navbar.locationList." + element.path)}
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
              header={t("components.navbar.bottomInfoCard.header")}
              text={t("components.navbar.bottomInfoCard.text")}
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
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">
            {selectedUser?.first_name} {selectedUser?.last_name}
          </Typography>
          <Typography level="body-xs" noWrap>
            {email}
          </Typography>
        </Box>
        {(authorizedUsers?.length ?? 0) > 1 ? (
          <IconButton
            about="Switch user"
            onClick={() => {
              setSelectedUser(null);
              navigate("/login");
            }}
          >
            <SupervisedUserCircleOutlined />
          </IconButton>
        ) : (
          <></>
        )}
        <IconButton size="sm" variant="plain" color="neutral" onClick={logout}>
          <LogoutRounded />
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default NavBar;
