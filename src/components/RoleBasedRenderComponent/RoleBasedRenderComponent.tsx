import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import React, { useContext } from "react";

const RoleBasedRenderComponent = (props: {
  athleteRender: React.ReactNode;
  trainerRender: React.ReactNode;
  adminRender: React.ReactNode;
}) => {
  const { selectedUser } = useContext(AuthContext);

  if (!selectedUser) {
    return <></>;
  }

  return selectedUser.type == "ADMIN"
    ? props.adminRender
    : selectedUser.type == "TRAINER"
      ? props.trainerRender
      : props.athleteRender;
};

export default RoleBasedRenderComponent;
