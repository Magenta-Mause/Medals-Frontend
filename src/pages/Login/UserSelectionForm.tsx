import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { UserEntity } from "@customTypes/backendTypes";
import {
  Box,
  Button,
  List,
  ListDivider,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const UserRowMapping = (props: {
  user: UserEntity;
  setSelectedUser: (user: UserEntity) => void;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <ListItemButton
        key={props.user.id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          p: 1,
          borderRadius: 5,
        }}
        onClick={() => {
          props.setSelectedUser(props.user);
        }}
      >
        <ListItemContent sx={{ display: "flex", gap: 2, alignItems: "start" }}>
          <div>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>
              {props.user.first_name} {props.user.last_name}
            </Typography>
            <Typography level="body-xs" gutterBottom>
              {t("userTypes." + props.user.type)}
            </Typography>
          </div>
        </ListItemContent>
      </ListItemButton>
      <ListDivider key={"seperator-" + props.user.id} />
    </>
  );
};

const UserSelectionForm = () => {
  const { authorizedUsers, setSelectedUser, logout } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <List
          size="sm"
          sx={{
            "--ListItem-paddingX": -1,
            maxHeight: "35vh",
            overflowY: "auto",
          }}
        >
          {authorizedUsers?.map((user) => (
            <UserRowMapping
              key={user.id}
              user={user}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </List>
        <Button fullWidth color="neutral" onClick={logout}>
          {t("pages.loginPage.signIn.logoutButton")}
        </Button>
      </Box>
    </>
  );
};

export default UserSelectionForm;
