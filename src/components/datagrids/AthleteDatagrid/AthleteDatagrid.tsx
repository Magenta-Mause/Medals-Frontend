import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import AthleteImportModal from "@components/modals/AthleteImportModal/AthleteImportModal";
import AthleteCreationForm from "@components/modals/AthleteCreationModal/AthleteCreationModal";
import { useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { useTypedSelector } from "@stores/rootReducer";
import GenderIcon from "@components/icons/GenderIcon/GenderIcon";
import MedalBox from "./MedalBox";
import SwimCertificateIcon from "@components/icons/SwimCertificateIcon/SwimCertificateIcon";
import AthleteRequestButton from "@components/modals/AthleteRequestModal/AthleteRequestModal";
import { PersonSearch, PersonAdd } from "@mui/icons-material";

interface AthleteDatagridProps {
  athletes: Athlete[];
  isLoading: boolean;
}

const AthleteDatagrid = (props: AthleteDatagridProps) => {
  const { deleteAthlete } = useApi();
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [addImportModalOpen, setImportModalOpen] = useState(false);
  const [addAthleteRequestModalOpen, setAddAthleteRequestModalOpen] =
    useState(false);
  const [createAthletModalOpen, setCreateAthleteModalOpen] = useState(false);

  const columns: Column<Athlete>[] = [
    {
      columnName: t("components.athleteDatagrid.table.columns.firstName"),
      size: "s",
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.lastName"),
      size: "s",
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.birthdate"),
      size: "s",
      columnMapping(item) {
        return <Typography>{item.birthdate}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.email"),
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.gender"),
      size: "s",
      columnMapping(item) {
        return <GenderIcon gender={item.gender} />;
      },
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.medals"),
      size: "l",
      disableSpan: true,
      columnMapping(item) {
        return (
          <MedalBox
            athlete={item}
            performanceRecordings={performanceRecordings}
          />
        );
      },
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.swimCertificate"),
      size: "s",
      disableSpan: false,
      columnMapping(item) {
        return (
          <>
            <SwimCertificateIcon achieved={item.swimming_certificate} />
          </>
        );
      },
    },
  ];

  const filters: Filter<Athlete>[] = [
    {
      name: "search",
      label: t("components.athleteDatagrid.table.filters.search"),
      apply(filterParameter) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();
        return (athlete) =>
          athlete.first_name.toLowerCase().includes(filterParameter) ||
          athlete.last_name.toLowerCase().includes(filterParameter) ||
          athlete.birthdate.toLowerCase().includes(filterParameter) ||
          athlete.email.toLowerCase().includes(filterParameter) ||
          athlete.id!.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
    {
      name: "born in",
      label: t("components.athleteDatagrid.table.filters.birthYear"),
      apply(filterParameter) {
        const parsed = filterParameter == "1";
        return (athlete) => !parsed || athlete.birthdate.slice(0, 4) == "2005";
      },
      type: "TOGGLE",
      option: "2005",
    },
    {
      name: "gender",
      label: t("components.athleteDatagrid.table.filters.gender"),
      apply(filterParameter) {
        return (athlete) =>
          filterParameter == "" ||
          athlete.gender!.toUpperCase() == filterParameter.toUpperCase();
      },
      type: "SELECTION",
      selection: [
        {
          displayValue: <Typography>{t("genders.ALL")}</Typography>,
          value: "",
        },
        {
          displayValue: <Typography>{t("genders.DIVERSE")}</Typography>,
          value: "DIVERSE",
        },
        {
          displayValue: <Typography>{t("genders.FEMALE")}</Typography>,
          value: "FEMALE",
        },
        {
          displayValue: <Typography>{t("genders.MALE")}</Typography>,
          value: "MALE",
        },
      ],
    },
  ];

  const toolbarActions: ToolbarAction[] = [
    {
      label: t("pages.athleteImportPage.importButton"),
      content: t("pages.athleteImportPage.importButton"),
      icon: <UploadIcon />,
      collapseToText: true,
      color: "primary",
      key: "import-athlete",
      variant: "solid",
      operation: async () => {
        setImportModalOpen(true);
      },
    },
    {
      label: t("components.athleteDatagrid.table.toolbar.createAthlete.label"),
      content: t(
        "components.athleteDatagrid.table.toolbar.createAthlete.content",
      ),
      icon: <PersonAdd />,
      collapseToText: true,
      color: "primary",
      key: "invite-trainer",
      variant: "solid",
      operation: async () => {
        setCreateAthleteModalOpen(true);
      },
    },
    {
      label: t("components.athleteDatagrid.table.toolbar.addAthlete.label"),
      content: t("components.athleteDatagrid.table.toolbar.addAthlete.content"),
      icon: <PersonSearch />,
      collapseToText: true,
      color: "primary",
      key: "invite-trainer",
      variant: "solid",
      operation: async () => {
        setAddAthleteRequestModalOpen(true);
      },
    },
  ];

  const actions: Action<Athlete>[] = [
    {
      label: <>{t("components.athleteDatagrid.actions.edit")}</>,
      color: "primary",
      key: "edit",
      operation: async (item) => {
        console.log("Editing Athlete:", item);
      },
    },
    {
      label: <>{t("components.athleteDatagrid.actions.delete")}</>,
      color: "danger",
      key: "delete",
      variant: "outlined",
      operation: async (item) => {
        await deleteAthlete(item.id!);
        console.log("Deleted Athlete:", item);
      },
    },
  ];

  const itemCallback = async (item: Athlete) => {
    navigate("/athletes/" + item.id);
  };

  const mobileRendering: MobileTableRendering<Athlete> = {
    avatar: (athlete) => <SwimCertificateIcon achieved={athlete.swimming_certificate} />,
    h1: (athlete) => (
      <>
        {athlete.first_name} {athlete.last_name}
      </>
    ),
    h2: (athlete) => <>{athlete.email}</>,
    h3: (athlete) => (
      <Typography level="body-xs">{athlete.birthdate}</Typography>
    ),
    topRightInfo: (athlete) => (
      <MedalBox
        athlete={athlete}
        performanceRecordings={performanceRecordings}
        iconSize="2rem"
      />
    ),
    bottomButtons: [...actions],
    searchFilter: {
      name: "search",
      label: "Search",
      apply(filterParameter: string | undefined) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();
        return (athlete) =>
          athlete.first_name.toLowerCase().includes(filterParameter) ||
          athlete.last_name.toLowerCase().includes(filterParameter) ||
          athlete.birthdate.toLowerCase().includes(filterParameter) ||
          athlete.email.toLowerCase().includes(filterParameter) ||
          athlete.id!.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
    onElementClick: itemCallback,
  };

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.athletes}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id!}
        mobileRendering={mobileRendering}
        onItemClick={itemCallback}
        disablePaging={false}
      />
      <AthleteImportModal
        isOpen={addImportModalOpen}
        setOpen={setImportModalOpen}
      />
      <AthleteRequestButton
        isOpen={addAthleteRequestModalOpen}
        setOpen={setAddAthleteRequestModalOpen}
      />
      <AthleteCreationForm
        isOpen={createAthletModalOpen}
        setOpen={setCreateAthleteModalOpen}
      />
    </>
  );
};

export default AthleteDatagrid;
