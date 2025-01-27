import { deleteAthlete } from "@api/APIService";
import { Box, Typography, Chip } from "@mui/joy";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import GenericResponsiveDatagrid, {
  Action,
  Column,
  Filter,
  MobileTableRendering,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Athlete } from "@types/bffTypes";

interface AthleteDatagridProps {
  athletes: Athlete[];
  isLoading: boolean;
}

const AthleteDatagrid = (props: AthleteDatagridProps) => {
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
            {item.gender.toUpperCase()}
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
      label: t("components.athleteDatagrid.table.filters.bornIn"),
      apply(filterParameter) {
        const parsed = filterParameter == "1";
        return (athlete) => !parsed || athlete.birthdate.slice(0, 4) == "2005";
      },
      type: "TOGGLE",
      option: "2005"
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
          displayValue: <Typography>{t("genders.d")}</Typography>,
          value: "D",
        },
        {
          displayValue: <Typography>{t("genders.f")}</Typography>,
          value: "F",
        },
        {
          displayValue: <Typography>{t("genders.m")}</Typography>,
          value: "M",
        },
      ],
    },
  ];

  const actions: Action<Athlete>[] = [
    {
      label: <>Edit</>,
      color: "primary",
      key: "edit",
      operation: function (item: Athlete): void {
        console.log("Editing Athlete:", item);
      },
    },
    {
      label: <>Delete</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: function (item: Athlete): void {
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
        {athlete.gender.toUpperCase()}
      </Chip>
    ),
    searchFilter: {
      name: "search",
      label: "Search",
      apply(filterParameter) {
        if (filterParameter == undefined) {
          return () => true;
        }

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
