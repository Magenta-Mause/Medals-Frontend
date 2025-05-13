import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import MedalsIcon from "@components/MedalsIcon/MedalsIcon";
import ProfileModal from "@components/modals/ProfileModal/ProfileModal";
import LegalLinksSelector from "@components/NavBar/LegalLinksSelector";
import { UserType } from "@customTypes/enums";
import useSidebar from "@hooks/useSidebar";
import {
  Article,
  Assessment,
  Download,
  Equalizer,
  HelpCenter,
  LogoutRounded,
  PeopleRounded,
  SearchRounded,
  SpaceDashboard,
  SupervisedUserCircleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
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
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useLocation, useNavigate } from "react-router";
import LanguageSelector from "./LanguageSelector";
import Tooltip from "@components/HoverTooltip/HoverTooltip";
import RoleBasedRenderComponent from "@components/RoleBasedRenderComponent/RoleBasedRenderComponent";
import AthletePendingAccessRequestInfoCard from "@components/AthletePendingAccessRequestInfoCard/AthletePendingAccessRequestInfoCard";

const sharedNavBarElements = [
  {
    path: "/materials",
    icon: <Download />,
    label: "materials",
  },
  {
    path: "/help",
    icon: <HelpCenter />,
    label: "help",
  },
];

const NavBar = () => {
  const { logout, email, setSelectedUser, selectedUser, authorizedUsers } =
    useContext(AuthContext);
  const navBarElements = new Map<
    UserType | undefined,
    { path: string; icon: JSX.Element; label: string }[]
  >([
    [
      undefined,
      [
        {
          path: "/",
          icon: (
            <RoleBasedRenderComponent
              athleteRender={<SpaceDashboard />}
              trainerRender={<PeopleRounded />}
              adminRender={<PeopleRounded />}
            />
          ),
          label:
            selectedUser?.type == UserType.TRAINER
              ? "athletes"
              : selectedUser?.type == UserType.ATHLETE
                ? "dashboard"
                : "trainer",
        },
      ],
    ],
    [UserType.ADMIN, []],
    [
      UserType.TRAINER,
      [
        {
          path: "/performanceMetrics",
          icon: <Assessment />,
          label: "performanceMetrics",
        },
      ],
    ],
    [
      UserType.ATHLETE,
      [
        {
          path: "/performances",
          icon: <Equalizer />,
          label: "performances",
        },
        {
          path: "/requirements",
          icon: <Article />,
          label: "requirements",
        },
      ],
    ],
  ]);
  const { collapseSidebar, sideBarExtended } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const userRole = selectedUser?.type;
  const [isProfileOpen, setProfileOpen] = useState(false);

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
        zIndex: 1000,
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
          overflow: { md: "hidden", xs: "hidden auto" },
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
          {[
            ...(userRole
              ? [
                  ...(navBarElements.get(undefined) ?? []),
                  ...(navBarElements.get(userRole) ?? []),
                ]
              : (navBarElements.get(undefined) ?? [])),
            ...sharedNavBarElements,
          ].map((element) => (
            <ListItem key={element.path}>
              <ListItemButton
                sx={{
                  transition: "background ease .2s",
                }}
                onClick={() => {
                  navigate(element.path);
                  collapseSidebar();
                }}
                selected={Boolean(matchPath(location.pathname, element.path))}
              >
                {element.icon}
                <ListItemContent>
                  <Typography level="title-sm" sx={{ userSelect: "none" }}>
                    {t("components.navbar.locationList./" + element.label)}
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
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            justifyContent: "flex-end",
            padding: "none",
          }}
        >
          <LegalLinksSelector collapseSidebar={collapseSidebar} />
          <LanguageSelector />
          <AthletePendingAccessRequestInfoCard />
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip text={t("components.tooltip.profileButton")}>
          <Button
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              p: 0.5,
              textAlign: "left",
              flex: 1,
              minWidth: 0,
            }}
            onClick={() => {
              setProfileOpen(true);
              collapseSidebar();
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography level="title-sm">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Typography>
              <Typography level="body-xs" noWrap sx={{ maxWidth: "100%" }}>
                {email}
              </Typography>
            </Box>
          </Button>
        </Tooltip>
        {(authorizedUsers?.length ?? 0) > 1 ? (
          <Tooltip text={t("components.tooltip.switchUserButton")}>
            <IconButton
              about="Switch user"
              onClick={() => {
                setSelectedUser(null);
                navigate("/login");
              }}
            >
              <SupervisedUserCircleOutlined />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip text={t("components.tooltip.logoutButton")}>
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={logout}
          >
            <LogoutRounded />
          </IconButton>
        </Tooltip>
      </Box>
      <ProfileModal isOpen={isProfileOpen} setOpen={setProfileOpen} />
    </Sheet>
  );
};
export default NavBar;
