import { deleteAthlete } from "@api/APIService";
import GenericResponsiveDatagrid, {
  Action,
  Column,
  Filter,
} from "@components/Datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Box, Chip, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { Athlete } from "@types/bffTypes";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const currentState = useTypedSelector((state) => state.athletes.state);
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  
  const columns: Column<Athlete>[] = [
    {
      columnName: "Athlete ID",
      columnMapping(item) {
        return <Typography color="primary">ATH-{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: "First Name",
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Last Name",
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Birthdate",
      size: "s",
      columnMapping(item) {
        return <Typography>{item.birthdate}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Email",
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
    {
      columnName: "Gender",
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
      name: "Search",
      apply(filterParameter) {
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
      name: "Born in",
      apply(filterParameter) {
        const parsed = filterParameter == "1";
        return (athlete) => !parsed || athlete.birthdate.slice(0, 4) == "2005";
      },
      type: "TOGGLE",
      label: "2005",
    },
    {
      name: "Gender",
      apply(filterParameter) {
        return (athlete) =>
          filterParameter == "" ||
          athlete.gender.toUpperCase() == filterParameter.toUpperCase();
      },
      type: "SELECTION",
      selection: [
        {
          displayValue: <Typography>All</Typography>,
          value: "",
        },
        {
          displayValue: <Typography>Divers</Typography>,
          value: "D",
        },
        {
          displayValue: <Typography>Female</Typography>,
          value: "F",
        },
        {
          displayValue: <Typography>Male</Typography>,
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

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 0 },
        pt: {
          xs: "calc(12px + var(--Header-height))",
          sm: "calc(12px + var(--Header-height))",
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        display: "flex",
        flex: 1,
        height: 2,
        flexDirection: "column",
        minWidth: 0,
        flexGrow: 1,
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          {t("athleteOverviewPage.header")}
        </Typography>
      </Box>
      <GenericResponsiveDatagrid
        athletes={athletes}
        isLoading={currentState == "loading"}
        data={athletes}
        columns={columns}
        filters={filters}
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id}
      />
    </Box>
  );
};

export default AthleteOverviewPage;
