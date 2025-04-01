import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Box, Chip, Typography } from "@mui/joy";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import { useTypedSelector } from "@stores/rootReducer";
import { DisciplineCategories, Medals } from "@customTypes/enums";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import MedalIcon from "@components/MedalIcon/MedalIcon";
import { useEffect, useState } from "react";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";

interface AthleteDatagridProps {
  athletes: Athlete[];
  isLoading: boolean;
}

const AthleteDatagrid = (props: AthleteDatagridProps) => {
  const { deleteAthlete } = useApi();
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);

  const columns: Column<Athlete>[] = [
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
    {
      columnName: t("components.athleteDatagrid.table.columns.medals"),
      size: "l",
      disableSpan: true,
      columnMapping(item) {
        const performanceRecordingsOfAthlete = performanceRecordings.filter(
          (p) => p.athlete_id == item.id,
        );
        return (
          <Box
            sx={{
              height: "25px",
              gap: "10px",
              display: "flex",
              justifyContent: "left",
            }}
          >
            {Object.values(DisciplineCategories).map((category) => {
              const performanceRecordingsOfCategory =
                performanceRecordingsOfAthlete.filter(
                  (p) =>
                    p.discipline_rating_metric.discipline.category == category,
                );
              const bestValue = performanceRecordingsOfCategory
                .map((p) => calculatePerformanceRecordingMedal(p))
                .sort((m) => convertMedalToNumber(m))[0];
              return (
                <MedalIcon
                  category={category}
                  medalType={bestValue ?? Medals.NONE}
                />
              );
            })}
          </Box>
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
      label: <>{t("components.athleteDatagrid.actions.edit")}</>,
      color: "primary",
      key: "edit",
      operation: function (item): void {
        console.log("Editing Athlete:", item);
      },
    },
    {
      label: <>{t("components.athleteDatagrid.actions.export")}</>,
      color: "primary",
      key: "export",
      variant: "outlined",
      operation: function (item): void {
        setSelectedAthletes((prev) => [...prev, item]);
        setExportModalOpen(true);
        console.log("Selected Athletes:", item);
      },
    },
    {
      label: <>{t("components.athleteDatagrid.actions.delete")}</>,
      color: "danger",
      key: "delete",
      variant: "outlined",
      operation: function (item): void {
        dispatch(removeAthlete({ id: item.id! }));
        deleteAthlete(item.id!);
        console.log("Deleted Athlete:", item);
      },
    },
  ];

  const itemCallback = (item: Athlete) => {
    navigate("/athletes/" + item.id);
  };

  const mobileRendering: MobileTableRendering<Athlete> = {
    avatar: (athlete) => (
      <Chip size="lg" sx={{ aspectRatio: 1 }}>
        {athlete.id}
      </Chip>
    ),
    h1: (athlete) => (
      <>
        {athlete.first_name} {athlete.last_name}
      </>
    ),
    h2: (athlete) => <>{athlete.email}</>,
    h3: (athlete) => (
      <Typography level="body-xs">{athlete.birthdate}</Typography>
    ),
    bottomButtons: [
      {
        key: "openDetails",
        label: t("components.athleteDatagrid.actions.openDetails"),
        operation: itemCallback,
        color: "primary",
      },
      ...actions.filter((action) => action.key !== "export"),
    ],
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
        {athlete.gender!.slice(0, 1).toUpperCase()}
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
          athlete.id!.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
    onElementClick: itemCallback,
  };

  useEffect(() => {
    if (!isExportModalOpen) {
      setSelectedAthletes([]);
    }
  }, [isExportModalOpen]);

  return (
    <>
      <AthleteExportModal
        isOpen={isExportModalOpen}
        setOpen={setExportModalOpen}
        selectedAthletes={selectedAthletes}
        includePerformance={false}
      />
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
