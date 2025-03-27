import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { UserEntity } from "@customTypes/backendTypes";
import { ArrowForward } from "@mui/icons-material";
import {
  Box,
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
  index: number;
}) => {
  const { t } = useTranslation();
  return (
    <>
      {props.index > 0 ? (
        <ListDivider key={"seperator-" + props.user.id} />
      ) : (
        <></>
      )}
      <ListItemButton
        key={props.user.id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          p: 1,
          borderRadius: 3,
          ":hover": {
            background: "black",
          },
        }}
        onClick={() => {
          props.setSelectedUser(props.user);
        }}
      >
        <ListItemContent
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            height: "55px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "left",
              height: "100%",
              ml: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {props.user.first_name} {props.user.last_name}
            </Typography>
            <Typography level="body-xs">
              {t("userTypes." + props.user.type)}
            </Typography>
          </Box>
          <ArrowForward sx={{ mr: 1 }} />
        </ListItemContent>
      </ListItemButton>
    </>
  );
};

const UserSelectionForm = () => {
  const { authorizedUsers, setSelectedUser } = useContext(AuthContext);

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
          {authorizedUsers?.map((user, index) => (
            <UserRowMapping
              key={user.id}
              user={user}
              setSelectedUser={setSelectedUser}
              index={index}
            />
          ))}
        </List>
      </Box>
    </>
  );
};

export default UserSelectionForm;
