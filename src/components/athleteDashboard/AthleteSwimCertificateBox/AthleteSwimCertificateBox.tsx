import {
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
  GenericDashboardBoxHeader,
} from "../GenericDashboardBox";
import { useTypedSelector } from "@stores/rootReducer";
import { Athlete } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const AthleteSwimCertificateBox = () => {
  const { selectedUser } = useContext(AuthContext);
  const athlete = (
    useTypedSelector((state) => state.athletes.data) as Athlete[]
  ).filter((a) => a.id == selectedUser?.id)[0];
  const { t } = useTranslation();

  return (
    <>
      <GenericDashboardBoxHeader>
        {t("components.athleteDashboard.swimCertificate.header")}
      </GenericDashboardBoxHeader>
      <GenericDashboardBoxContent
        sx={(theme) => ({
          userSelect: "all",
          height: "100%",
          color: athlete?.swimming_certificate
            ? "rgba(59,183,59, 0.9)"
            : "rgb(185,49,49)",
          [theme.getColorSchemeSelector("dark")]: {
            color: athlete?.swimming_certificate
              ? "rgba(59,183,59, 0.9)"
              : "rgb(185,49,49)",
          },
        })}
      >
        {athlete?.swimming_certificate ? (
          <>
            {t(
              "components.createSwimCertificateModal.options." +
                athlete?.swimming_certificate +
                ".label",
            )}
          </>
        ) : (
          <>
            {t("components.athleteDashboard.swimCertificate.noSwimCertificate")}
          </>
        )}
      </GenericDashboardBoxContent>
      <GenericDashboardBoxFooter>
        {athlete?.swimming_certificate
          ? t(
              "components.createSwimCertificateModal.options." +
                athlete.swimming_certificate +
                ".description",
            )
          : t("components.athleteDashboard.swimCertificate.notExisting")}
      </GenericDashboardBoxFooter>
    </>
  );
};
export default AthleteSwimCertificateBox;
