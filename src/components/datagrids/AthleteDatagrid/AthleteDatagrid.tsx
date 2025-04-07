import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import { useTypedSelector } from "@stores/rootReducer";
import GenderIcon from "@components/icons/GenderIcon/GenderIcon";
import MedalBox from "./MedalBox";

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
      size: "m",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.gender"),
      size: "xs",
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
    avatar: (athlete) => <GenderIcon gender={athlete.gender} />,
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
    bottomButtons: [
      ...actions,
    ],
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
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id!}
        mobileRendering={mobileRendering}
        onItemClick={itemCallback}
        disablePaging={false}
      />
    </>
  );
};

export default AthleteDatagrid;
