import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { UserType } from "@customTypes/enums";
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

  return selectedUser.type == UserType.ADMIN
    ? props.adminRender
    : selectedUser.type == UserType.TRAINER
      ? props.trainerRender
      : props.athleteRender;
};

export default RoleBasedRenderComponent;
