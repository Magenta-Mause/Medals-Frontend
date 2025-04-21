import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import useFormatting from "@hooks/useFormatting";
import { Box, Link, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import { MdSportsKabaddi } from "react-icons/md";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import AthleteImportModal from "@components/modals/AthleteImportModal/AthleteImportModal";
import AthleteCreationForm from "@components/modals/AthleteCreationModal/AthleteCreationModal";
import UploadIcon from "@mui/icons-material/Upload";
import { useTypedSelector } from "@stores/rootReducer";
import GenderIcon from "@components/icons/GenderIcon/GenderIcon";
import AthleteRequestButton from "@components/modals/AthleteRequestModal/AthleteRequestModal";
import { PersonAdd, PersonSearch } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";
import AchievementsBox from "./AchievementsBox";

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
  const { formatLocalizedDate } = useFormatting();
  const [addImportModalOpen, setImportModalOpen] = useState(false);
  const [addAthleteRequestModalOpen, setAddAthleteRequestModalOpen] =
    useState(false);
  const [createAthletModalOpen, setCreateAthleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);
  const currentYear = new Date().getFullYear();

  const noAthleteFoundMessage = (
    <Box sx={{ width: "250px" }}>
      <Box
        sx={{
          py: "30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box>
          <MdSportsKabaddi size={"50px"} />
        </Box>
        <Box>
          <Typography sx={{ userSelect: "none", textAlign: "center" }}>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setAddAthleteRequestModalOpen(true);
              }}
              href={"#"}
            >
              {t("components.athleteDatagrid.table.noEntries.link")}
            </Link>{" "}
            {t("components.athleteDatagrid.table.noEntries.text")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
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
        return <Typography>{formatLocalizedDate(item.birthdate)}</Typography>;
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
      columnName: t("components.athleteDatagrid.table.columns.achievements"),
      size: "xl",
      disableSpan: true,
      columnMapping(item) {
        return (
          <AchievementsBox
            athlete={item}
            performanceRecordings={performanceRecordings}
            currentYear={currentYear}
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
      key: "create athlete button",
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
      key: "request athlete button",
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
      label: <>{t("components.athleteDatagrid.actions.export")}</>,
      color: "primary",
      key: "export",
      variant: "outlined",
      operation: async (item) => {
        setSelectedAthletes((prev) => [...prev, item]);
        setExportModalOpen(true);
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
    h1: (athlete) => (
      <>
        {athlete.first_name} {athlete.last_name}
      </>
    ),
    h2: (athlete) => <>{athlete.email}</>,
    h3: (athlete) => (
      <Typography level="body-xs">
        {formatLocalizedDate(athlete.birthdate)}
      </Typography>
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
      <AchievementsBox
        athlete={athlete}
        performanceRecordings={performanceRecordings}
        currentYear={currentYear}
      />
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
        isButtonVisible={false}
      />
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
        heightIfNoEntriesFound={"200px"}
        messageIfNoEntriesFound={noAthleteFoundMessage}
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
