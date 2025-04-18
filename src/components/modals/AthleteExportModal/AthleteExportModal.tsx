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
  Genders,
} from "@customTypes/enums";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { useMediaQuery } from "@mui/material";

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
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.lastName"),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
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
    const attributeToGermanHeader: Record<string, string> = {
      [AthleteExportColumn.FirstName]: "Vorname",
      [AthleteExportColumn.LastName]: "Nachname",
      [AthleteExportColumn.Email]: "E-Mail",
      [AthleteExportColumn.Birthdate]: "Geburtsdatum",
      [AthleteExportColumn.Gender]: "Geschlecht",

      [AthletePerformanceExportColumn.Birthyear]: "Geburtsjahr",
      [AthletePerformanceExportColumn.Birthday]: "Geburtstag",
      [AthletePerformanceExportColumn.Discipline]: "Übung",
      [AthletePerformanceExportColumn.Category]: "Kategorie",
      [AthletePerformanceExportColumn.Date]: "Datum",
      [AthletePerformanceExportColumn.Result]: "Ergebnis",
      [AthletePerformanceExportColumn.Points]: "Punkte",
    };
    const columns: string[] = withPerformance
      ? Object.values(AthletePerformanceExportColumn)
      : Object.values(AthleteExportColumn);
    const header =
      columns.map((col) => attributeToGermanHeader[col] || col).join(",") +
      "\n";

    const rows = data
      .map((item) => {
        const mapGenderToGermanShort = (gender: string): string => {
          switch (gender) {
            case Genders.FEMALE:
              return "W";
            case Genders.MALE:
              return "M";
            case Genders.DIVERSE:
              return "D";
            default:
              return "";
          }
        };
        const birthdate = item.birthdate ? new Date(item.birthdate) : null;
        const birthYear = birthdate ? birthdate.getFullYear().toString() : "";
        const performanceRecordingsOfAthlete = performanceRecordings.filter(
          (p) => p.athlete_id === item.id,
        );

        if (!withPerformance || performanceRecordingsOfAthlete.length === 0) {
          return columns
            .map((col) => {
              if (col === AthleteExportColumn.Birthdate) {
                return item.birthdate
                  ? new Intl.DateTimeFormat("de-DE").format(
                      new Date(item.birthdate),
                    )
                  : "";
              }
              if (col === AthleteExportColumn.Gender) {
                return mapGenderToGermanShort(item.gender);
              }

              return item[col] || "";
            })
            .join(",");
        }

        return performanceRecordingsOfAthlete
          .map((performance) => {
            const discipline = disciplines.find(
              (d) =>
                d.id === performance.discipline_rating_metric.discipline.id,
            );
            const points = convertMedalToNumber(
              calculatePerformanceRecordingMedal(performance),
            );
            return columns
              .map((col) => {
                switch (col) {
                  case "first_name":
                    return item.first_name || "";
                  case "last_name":
                    return item.last_name || "";
                  case "gender":
                    return mapGenderToGermanShort(item.gender) || "";
                  case "birthyear":
                    return birthYear || "";
                  case "birthday":
                    return birthdate
                      ? new Intl.DateTimeFormat("de-DE").format(birthdate)
                      : "";
                  case "discipline":
                    return discipline?.name || "";
                  case "category":
                    return discipline?.category || "";
                  case "date":
                    return performance.date_of_performance
                      ? new Intl.DateTimeFormat("de-DE").format(
                          new Date(performance.date_of_performance),
                        )
                      : "";
                  case "result":
                    return performance.rating_value || "";
                  case "points":
                    return points || "";
                }
              })
              .join(",");
          })
          .join("\n");
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
      } else {
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
      }
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

export default AthleteExportModal;
