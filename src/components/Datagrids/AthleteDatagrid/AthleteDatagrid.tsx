import useApi from "@hooks/useApi";
import { Athlete } from "bffTypes";
import { Chip, Typography } from "@mui/joy";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";

interface AthleteDatagridProps {
  athletes: Athlete[];
  isLoading: boolean;
}

const AthleteDatagrid = (props: AthleteDatagridProps) => {
  const { deleteAthlete } = useApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const columns: Column<Athlete>[] = [
    {
      columnName: t("components.athleteDatagrid.table.columns.athleteId"),
      columnMapping(item) {
        return <Typography color="primary">ATH-{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.firstName"),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.lastName"),
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
      columnMapping(item) {
        return (
          <Chip
            size="sm"
            sx={{ aspectRatio: 1, height: "2rem", textAlign: "center" }}
          >
            {t("genders." + item.gender)
              .slice(0, 1)
              .toUpperCase()}
          </Chip>
        );
      },
      sortable: true,
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
          athlete.id.toString().toLowerCase().includes(filterParameter);
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
          athlete.gender.toUpperCase() == filterParameter.toUpperCase();
      },
      type: "SELECTION",
      selection: [
        {
          displayValue: <Typography>{t("genders.")}</Typography>,
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
      label: <>Edit</>,
      color: "primary",
      key: "edit",
      operation: function (item): void {
        console.log("Editing Athlete:", item);
      },
    },
    {
      label: <>Delete</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: function (item): void {
        dispatch(removeAthlete({ id: item.id }));
        deleteAthlete(item.id);
        console.log("Deleted Athlete:", item);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Athlete> = {
    avatar: (athlete) => <>{athlete.id}</>,
    h1: (athlete) => (
      <>
        {athlete.first_name} {athlete.last_name}
      </>
    ),
    h2: (athlete) => <>{athlete.email}</>,
    h3: (athlete) => (
      <Typography level="body-xs">{athlete.birthdate}</Typography>
    ),
    bottomButtons: actions,
    topRightInfo: (athlete) => (
      <Chip
        size="md"
        sx={{
          aspectRatio: 1,
          p: 1,
          height: "2rem",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        {athlete.gender.slice(0, 1).toUpperCase()}
      </Chip>
    ),
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
          athlete.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  };

  return (
    <GenericResponsiveDatagrid
      isLoading={props.isLoading}
      data={props.athletes}
      columns={columns}
      filters={filters}
      actionMenu={actions}
      itemSelectionActions={actions}
      keyOf={(item) => item.id}
      mobileRendering={mobileRendering}
    />
  );
};

export default AthleteDatagrid;
