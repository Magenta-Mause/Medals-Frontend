import CustomBreadcrumbs from "@components/CustomBreadcrumbs/Breadcrumbs";
import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import GenericResponsiveDatagrid, {
  Action,
  Column,
  Filter,
} from "@components/Datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { DownloadRounded, HomeRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Chip, Link, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const currentState = useTypedSelector((state) => state.athletes.state);
  const dispatch = useDispatch()  


  const columns: Column<Athlete>[] = [
    {
      rowName: "Athlete ID",
      rowMapping(item) {
        return <Typography color="primary">ATH-{item.id}</Typography>;
      },
      size: "xs",
      sortable: true,
    },
    {
      rowName: "First Name",
      rowMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      rowName: "Last Name",
      rowMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      rowName: "Birthdate",
      rowMapping(item) {
        return <Typography>{item.birthdate}</Typography>;
      },
      sortable: true,
    },
    {
      rowName: "Email",
      rowMapping(item) {
        return <Typography>{item.email}</Typography>;
      },
    },
    {
      rowName: "Gender",
      rowMapping(item) {
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
      filterName: "Search",
      applyFilter(filterParameter) {
        return (athlete) =>
          athlete.first_name.includes(filterParameter) ||
          athlete.last_name.includes(filterParameter) ||
          athlete.birthdate.includes(filterParameter) ||
          athlete.email.includes(filterParameter) ||
          athlete.id.toString().includes(filterParameter);
      },
      filterType: "TEXT",
    },
    {
      filterName: "Date of Registration",
      applyFilter(filterParameter) {
        const parsed = Boolean(filterParameter);
        return (athlete) => !parsed || athlete.id < 5;
      },
      filterType: "TOGGLE",
      filterLabel: "Early",
    },
    {
      filterName: "Gender",
      applyFilter(filterParameter) {
        return (athlete) =>
          athlete.gender.toUpperCase() == filterParameter.toUpperCase();
      },
      filterType: "SELECTION",
      selection: [
        {
          displayValue: <Typography>Male</Typography>,
          value: "M",
        },
        {
          displayValue: <Typography>Female</Typography>,
          value: "F",
        },
        {
          displayValue: <Typography>Divers</Typography>,
          value: "D",
        },
      ],
    },
  ];

  const actions: Action<Athlete>[] = [
    {
      label: <>Delete</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: function (item: Athlete): void {
        dispatch(removeAthlete({id: item.id}))
        console.log("Deleted Athlete:", item);
      },
    },
    {
      label: <>Edit</>,
      color: "primary",
      key: "edit",
      operation: function (item: Athlete): void {
        console.log("Editing Athlete:", item);
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
          Athletes
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
