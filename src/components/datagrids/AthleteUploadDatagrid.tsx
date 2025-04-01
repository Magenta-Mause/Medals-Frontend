import { AthleteWithValidity } from "@components/modals/AthleteImportModal/AthleteImportModal";
import GenericResponsiveDatagrid from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/joy";
import { Cloud } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import { AthleteValidityState } from "@customTypes/enums";

const AthleteUploadDatagrid = (props: { athletes: AthleteWithValidity[] }) => {
  const { t } = useTranslation();
  const columns: Column<AthleteWithValidity>[] = [
    {
      columnName: t("pages.athleteImportPage.valid"),
      columnMapping(athlete) {
        return athlete.state === AthleteValidityState.FAILED ? (
          <CloseIcon color="error" />
        ) : athlete.state === AthleteValidityState.LOADING ? (
          <CircularProgress size={"sm"} />
        ) : athlete.state === AthleteValidityState.UPLOADED ? (
          <Cloud color="success" />
        ) : athlete.state === AthleteValidityState.VALID ? (
          <UploadIcon />
        ) : (
          // Handle undefined `valid`
          <CloseIcon color="error" />
        );
      },
      size: "xs",
    },
    {
      columnName: t("pages.athleteImportPage.firstName"),
      columnMapping(athlete) {
        return athlete.first_name;
      },
    },
    {
      columnName: t("pages.athleteImportPage.lastName"),
      columnMapping(athlete) {
        return athlete.last_name;
      },
    },
  ];
  const mobileRendering: MobileTableRendering<AthleteWithValidity> = {};
  return (
    <GenericResponsiveDatagrid
      data={props.athletes}
      columns={columns}
      isLoading={false}
      keyOf={(item) =>
        item.first_name + item.last_name + item.birthdate + item.email
      }
      mobileRendering={mobileRendering}
      disablePaging
    />
  );
};

export default AthleteUploadDatagrid;
