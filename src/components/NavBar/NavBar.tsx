import ColorSchemeToggle from "@components/ColorSchemeToggle/ColorSchemeToggle";
import useSidebar from "@hooks/useSidebar";
import {
  CloseRounded,
  HomeRounded,
  LogoutRounded,
  PeopleRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  GlobalStyles,
  IconButton,
  Input,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  ListItemContent,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { NavigateFunction, useNavigate } from "react-router";

const navBarElements = [
  {
    title: "Home",
    onClick: (navigate: NavigateFunction) => {
      navigate("/home");
    },
    icon: <HomeRounded />,
  },
  {
    title: "Athletes",
    onClick: (navigate: NavigateFunction) => {
      navigate("/athletes");
    },
    icon: <PeopleRounded />,
  },
];

const NavBar = () => {
  const { collapseSidebar, sideBarExtended } = useSidebar();
  const navigate = useNavigate();

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
        <Typography level="title-lg">Medals</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Input size="sm" startDecorator={<SearchRounded />} />
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
            <ListItem>
              <ListItemButton
                onClick={() => {
                  element.onClick(navigate);
                }}
              >
                {element.icon}
                <ListItemContent>
                  <Typography level="title-sm">{element.title}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: "none" }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography level="title-sm">Warning</Typography>
            <IconButton size="sm">
              <CloseRounded />
            </IconButton>
          </Stack>
          <Typography level="body-xs">Warning Text</Typography>
          <LinearProgress
            variant="outlined"
            value={80}
            determinate
            sx={{ my: 1 }}
          />
          <Button size="sm" variant="solid">
            Do something
          </Button>
        </Card>
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
