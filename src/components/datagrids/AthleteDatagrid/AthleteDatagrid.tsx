import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Box, Link, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { PersonAdd, PersonSearch } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import { MdSportsKabaddi } from "react-icons/md";

import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import CsvImportModal from "@components/modals/CsvImportModal/CsvImportModal";
import AthleteCreationForm from "@components/modals/AthleteCreationModal/AthleteCreationModal";
import GenderIcon from "@components/icons/GenderIcon/GenderIcon";
import AthleteRequestButton from "@components/modals/AthleteRequestModal/AthleteRequestModal";
import AthleteExportModal from "@components/modals/AthleteExportModal/AthleteExportModal";
import AchievementsBox from "./AchievementsBox";
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { calculateAge } from "@utils/calculationUtil";
import { useTypedSelector } from "@stores/rootReducer";
import useFormatting from "@hooks/useFormatting";

interface AthleteDatagridProps {
  athletes: Athlete[];
}

const AccessNotApprovedComponent = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography color={"neutral"} level={"body-xs"}>
        {t("components.athleteDatagrid.noAccess.label")}{" "}
        <InfoTooltip text={t("components.athleteDatagrid.noAccess.tooltip")} />
      </Typography>
    </Box>
  );
};

const AthleteDatagrid = (props: AthleteDatagridProps) => {
  const { selectedUser } = useContext(AuthContext);
  const { deleteAthlete, updateAthlete, removeTrainerAthleteConnection } =
    useApi();
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatLocalizedDate } = useFormatting();
  const [addImportModalOpen, setImportModalOpen] = useState(false);
  const [addAthleteRequestModalOpen, setAddAthleteRequestModalOpen] =
    useState(false);
  const [createAthleteModalOpen, setCreateAthleteModalOpen] = useState(false);
  const [editAthleteModalOpen, setEditAthleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isRemoveConfirmationModalOpen, setRemoveConfirmationModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);
  const [athleteToEdit, setAthleteToEdit] = useState<Athlete | undefined>(
    undefined,
  );

  const currentYear = new Date().getFullYear();

  const ageSelection = [
    {
      displayValue: t("generic.all"),
      value: "all",
    },
    ...Array.from({ length: 12 }, (_, i) => {
      const value = (i + 6).toString();
      return {
        displayValue: <Typography>{Number(value)}</Typography>,
        value,
      };
    }),
  ];

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
        return item.has_access ? (
          <Typography noWrap level={"body-xs"}>
            {item.email}
          </Typography>
        ) : (
          <AccessNotApprovedComponent />
        );
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
        return item.has_access ? (
          <>
            <AchievementsBox
              athlete={item}
              performanceRecordings={performanceRecordings}
              selectedYear={currentYear}
            />
          </>
        ) : (
          <AccessNotApprovedComponent />
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
    {
      name: "age",
      label: (
        <>
          {t("components.athleteDatagrid.table.filters.age")}
          <InfoTooltip text={t("components.tooltip.ageFilter")} />
        </>
      ),
      apply(filterParameter) {
        return (athlete) =>
          filterParameter === "" ||
          filterParameter === "all" ||
          String(calculateAge(athlete.birthdate)) === filterParameter;
      },
      type: "SELECTION",
      selection: ageSelection,
    },
  ];

  const toolbarActions: ToolbarAction[] = [
    {
      label: t("components.csvImportModal.importLabel"),
      content: t("components.csvImportModal.importButton"),
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

  const actions: (athlete: Athlete) => Action<Athlete>[] = (athlete) => {
    if (athlete.has_access) {
      return [
        {
          label: <>{t("components.athleteDatagrid.actions.edit")}</>,
          color: "primary",
          key: "edit",
          operation: async (item) => {
            setAthleteToEdit(item);
            setEditAthleteModalOpen(true);
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
          label: <>{t("components.athleteDatagrid.actions.remove")}</>,
          color: "danger",
          key: "remove",
          variant: "outlined",
          operation: async (item) => {
            setSelectedAthletes((prev) => [...prev, item]);
            setRemoveConfirmationModalOpen(true);
          },
        },
        {
          label: <>{t("components.athleteDatagrid.actions.delete")}</>,
          color: "danger",
          key: "delete",
          variant: "outlined",
          operation: async (item) => {
            setSelectedAthletes((prev) => [...prev, item]);
            setDeleteModalOpen(true);
          },
        },
      ];
    }
    return [
      {
        label: <>{t("components.athleteDatagrid.actions.remove")}</>,
        color: "danger",
        key: "remove",
        variant: "outlined",
        operation: async (item) => {
          setSelectedAthletes((prev) => [...prev, item]);
          setRemoveConfirmationModalOpen(true);
        },
      },
    ];
  };

  const normalizedActions = actions({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    has_access: true,
  }).filter((action) => action.key !== "edit");

  const itemCallback = async (item: Athlete) => {
    navigate("/" + item.id);
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
    topRightMenu: [
      {
        key: "openDetails",
        label: t("components.athleteDatagrid.actions.openDetails"),
        operation: itemCallback,
        color: "primary",
      },
      ...normalizedActions.filter((action) => action.key !== "export"),
    ],
    contentRow: (athlete) => (
      <AchievementsBox
        athlete={athlete}
        performanceRecordings={performanceRecordings}
        selectedYear={currentYear}
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

  const handleUpdateAthlete = async (athlete: Athlete) => {
    try {
      const success = await updateAthlete(athlete);
      if (success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error while updating athlete:", error);
      return false;
    }
  };

  useEffect(() => {
    if (
      !isExportModalOpen &&
      !isRemoveConfirmationModalOpen &&
      !isDeleteModalOpen
    ) {
      setSelectedAthletes([]);
    }
  }, [isExportModalOpen, isRemoveConfirmationModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    if (!editAthleteModalOpen) {
      setAthleteToEdit(undefined);
    }
  }, [editAthleteModalOpen]);

  const handleConfirmDeletion = async () => {
    if (selectedAthletes.length === 0) return;
    try {
      for (const athlete of selectedAthletes) {
        const success = await deleteAthlete(athlete.id!);
        if (success) {
          console.log("Deleted Athlete:", athlete);
        }
      }
      enqueueSnackbar(t("snackbar.athleteDatagrid.deletionSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error while deleting athletes", error);
      enqueueSnackbar(t("snackbar.athleteDatagrid.deletionError"), {
        variant: "error",
      });
    }
    setDeleteModalOpen(false);
  };

  const handleConfirmRemove = async () => {
    if (selectedUser?.id && selectedAthletes.length > 0) {
      try {
        for (const athlete of selectedAthletes) {
          const success = await removeTrainerAthleteConnection(
            selectedUser.id,
            athlete.id!,
          );
          if (success) {
            console.log("Remove Connection: ", athlete, selectedUser);
          }
        }
        enqueueSnackbar(t("snackbar.removalConfirmationModal.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error while removing athlete connection", error);
        enqueueSnackbar(t("snackbar.removalConfirmationModal.error"), {
          variant: "error",
        });
      }
      setRemoveConfirmationModalOpen(false);
    }
  };

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
        data={props.athletes}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actions}
        itemSelectionActions={normalizedActions}
        keyOf={(item) => item.id!}
        mobileRendering={mobileRendering}
        onItemClick={itemCallback}
        disablePaging={false}
        heightIfNoEntriesFound={"200px"}
        elementsPerPage={25}
        messageIfNoEntriesFound={noAthleteFoundMessage}
        itemClickableFilter={(athlete) => athlete.has_access}
      />
      <CsvImportModal
        isOpen={addImportModalOpen}
        setOpen={setImportModalOpen}
      />
      <AthleteRequestButton
        isOpen={addAthleteRequestModalOpen}
        setOpen={setAddAthleteRequestModalOpen}
      />
      <AthleteCreationForm
        isOpen={createAthleteModalOpen}
        setOpen={setCreateAthleteModalOpen}
      />
      <AthleteCreationForm
        isOpen={editAthleteModalOpen}
        setOpen={setEditAthleteModalOpen}
        athleteToEdit={athleteToEdit}
        updateAthlete={handleUpdateAthlete}
      />
      <ConfirmationPopup
        open={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={handleConfirmDeletion}
        header={t("components.athleteDatagrid.deletionModal.header")}
        message={t(
          "components.athleteDatagrid.deletionModal.confirmDeleteMessage",
        )}
        confirmButtonText={t("components.confirmationPopup.deleteButton")}
      />
      <ConfirmationPopup
        open={isRemoveConfirmationModalOpen}
        onClose={() => {
          setRemoveConfirmationModalOpen(false);
        }}
        onConfirm={handleConfirmRemove}
        header={t("components.confirmationModal.header")}
        message={t(
          selectedAthletes.length > 1
            ? "components.confirmationModal.descriptionPural"
            : "components.confirmationModal.description",
        )}
        confirmButtonText={t("components.confirmationModal.remove")}
      />
    </>
  );
};
export default AthleteDatagrid;
