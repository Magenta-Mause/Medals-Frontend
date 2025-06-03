import { t } from "i18next";
import GenericModal from "../GenericModal";
import { Box, Button, Checkbox, Sheet, Typography } from "@mui/joy";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { useEffect, useState } from "react";
import { IosShareRounded } from "@mui/icons-material";
import { useTypedSelector } from "@stores/rootReducer";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import { useSnackbar } from "notistack";
import {
  AthleteExportColumn,
  AthletePerformanceExportColumn,
} from "@customTypes/enums";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { useMediaQuery } from "@mui/material";
import dayjs from "dayjs";

interface AthleteExportModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedAthletes: Athlete[];
  includePerformance: boolean;
  isButtonVisible: boolean;
}

const AthleteExportModal = ({
  isOpen,
  setOpen,
  selectedAthletes,
  includePerformance,
  isButtonVisible,
}: AthleteExportModalProps) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [athletes, setAthletes] = useState(selectedAthletes);
  const [isLoading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [withPerformance, setWithPerformance] = useState(includePerformance);
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setAthletes(selectedAthletes);
    }
  }, [isOpen, selectedAthletes]);

  useEffect(() => {
    if (athletes.length > 0) {
      setLoading(false);
    }
  }, [athletes]);

  const columns: Column<Athlete>[] = [
    {
      columnName: t("components.athleteDatagrid.table.columns.firstName"),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      mapSortable: (i) => i.first_name.toLowerCase(),
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.lastName"),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      mapSortable: (i) => i.last_name.toLowerCase(),
    },
  ];

  const actions: Action<Athlete>[] = [
    {
      label: (
        <>{t("components.athleteExportModal.removeFromSelectionButton")}</>
      ),
      color: "danger",
      key: "remove",
      operation: async (item) => {
        let athleteTemp: Athlete[];
        setAthletes((prev: any[]) => {
          athleteTemp = prev.filter((a) => a.id !== item.id);
          if (athleteTemp.length <= 0) {
            setOpen(false);
          }
          return athleteTemp;
        });
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Athlete> = {};

  const generateCSV = (data: any[], withPerformance: boolean) => {
    const columns: string[] = withPerformance
      ? Object.values(AthletePerformanceExportColumn)
      : Object.values(AthleteExportColumn);
    const header = columns.map((col) => col || col).join(",") + "\n";

    const rows = data
      .map((item) => {
        const performanceRecordingsOfAthlete = performanceRecordings.filter(
          (p) => p.athlete_id === item.id,
        );

        if (withPerformance && performanceRecordingsOfAthlete.length > 0) {
          return performanceRecordingsOfAthlete
            .map((performance) =>
              mapPerformanceDataToCSV(columns, item, disciplines, performance),
            )
            .join("\n");
        }
        return mapAthleteDataToCSV(columns, item);
      })
      .join("\n");

    const csvContent = header + rows;
    return csvContent;
  };

  const handleExport = () => {
    try {
      if (athletes.length === 0) {
        enqueueSnackbar(t("snackbar.athleteExportModal.noAthleteSelected"), {
          variant: "error",
        });
        return;
      }

      const csvContent = generateCSV(athletes, withPerformance);
      if (!csvContent) {
        enqueueSnackbar(t("snackbar.athleteExportModal.exportError"), {
          variant: "error",
        });
        return;
      }
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        withPerformance
          ? "athletePerformance_export.csv"
          : "athlete_export.csv",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      enqueueSnackbar(t("snackbar.athleteExportModal.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("unexpected Export error:", error);
      enqueueSnackbar(t("snackbar.athleteExportModal.unexpectedError"), {
        variant: "error",
      });
    }
  };

  return (
    <>
      {isButtonVisible && !isMobile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            variant="soft"
            onClick={() => setOpen(true)}
            sx={{ display: "flex", gap: 0.5 }}
          >
            <IosShareRounded sx={{ fontSize: "20px" }} />
            {t("components.athleteExportModal.exportButton")}
          </Button>
        </Box>
      )}
      <GenericModal
        open={isOpen}
        setOpen={setOpen}
        header={t("components.athleteExportModal.header")}
        modalDialogSX={{
          width: "600px",
          maxHeight: "60vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            "& > div": { p: 1, borderRadius: "md", display: "flex" },
          }}
        >
          <Sheet variant="plain">
            <Checkbox
              variant="outlined"
              color="primary"
              label={t("components.athleteExportModal.performanceCheckbox")}
              checked={withPerformance}
              onChange={(event) => setWithPerformance(event.target.checked)}
            />
          </Sheet>
        </Box>
        <GenericResponsiveDatagrid
          isLoading={isLoading}
          data={athletes}
          columns={columns}
          actionMenu={actions}
          keyOf={(item) => item.id!}
          mobileRendering={mobileRendering}
          disablePaging={true}
        />
        <Button fullWidth color="primary" onClick={handleExport}>
          {t("components.athleteExportModal.exportButton")}
        </Button>
      </GenericModal>
    </>
  );
};

const mapAthleteDataToCSV = (columns: string[], item: any) => {
  return columns
    .map((col) => {
      switch (col) {
        case AthleteExportColumn.FirstName:
          return item.first_name || "";
        case AthleteExportColumn.LastName:
          return item.last_name || "";
        case AthleteExportColumn.Email:
          return item.email || "";
        case AthleteExportColumn.Birthdate:
          return formatItemBirthdate(item);
        case AthleteExportColumn.Gender:
          return item.gender || "";
      }

      return item[col] || "";
    })
    .join(",");
};

const mapPerformanceDataToCSV = (
  columns: string[],
  item: any,
  disciplines: Discipline[],
  performance: PerformanceRecording,
): string => {
  const points = convertMedalToNumber(
    calculatePerformanceRecordingMedal(performance),
  );
  return columns
    .map((col) => {
      const discipline = disciplines.find(
        (d) => d.id === performance.discipline_rating_metric.discipline.id,
      );
      switch (col) {
        case AthletePerformanceExportColumn.FirstName:
          return item.first_name || "";
        case AthletePerformanceExportColumn.LastName:
          return item.last_name || "";
        case AthletePerformanceExportColumn.Email:
          return item.email || "";
        case AthletePerformanceExportColumn.Gender:
          return item.gender || "";
        case AthletePerformanceExportColumn.Birthdate:
          return formatItemBirthdate(item);
        case AthletePerformanceExportColumn.Discipline:
          return discipline?.name || "";
        case AthletePerformanceExportColumn.Category:
          return discipline?.category || "";
        case AthletePerformanceExportColumn.PerformanceDate:
          return performance.date_of_performance
            ? new Intl.DateTimeFormat("de-DE").format(
                new Date(performance.date_of_performance),
              )
            : "";
        case AthletePerformanceExportColumn.Result:
          return performance.rating_value || "";
        case AthletePerformanceExportColumn.Points:
          return points || "";
      }
    })
    .join(",");
};

const formatItemBirthdate = (item: any): string | null => {
  return item.birthdate ? dayjs(item.birthdate).format("DD.MM.YYYY") : null;
};

export default AthleteExportModal;
