import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import { Athlete } from "@customTypes/backendTypes";

const AthleteInformationBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const { t } = useTranslation();
  if (selectedUser?.type != "ATHLETE") {
    return t("components.athleteDashboard.error.notAnAthlete");
  }
  const athlete = selectedUser as unknown as Athlete;
  return (
    <>
      {athlete.first_name} {athlete.last_name}
    </>
  );
};

export default AthleteInformationBox;
