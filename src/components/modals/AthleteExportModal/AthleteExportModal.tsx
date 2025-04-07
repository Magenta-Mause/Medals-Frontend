import { t } from "i18next";
import GenericModal from "../GenericModal";
import { Box, Button, Checkbox, IconButton, Sheet, Table } from "@mui/joy";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import React, { useEffect, useState } from "react";
import { IosShareRounded, Remove } from "@mui/icons-material";
import { useTypedSelector } from "@stores/rootReducer";
import {
  calculatePerformanceRecordingMedal,
  convertMedalToNumber,
} from "@utils/calculationUtil";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";

const AthleteExportModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedAthletes: Athlete[];
  includePerformance: boolean;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const [athletes, setAthletes] = useState(props.selectedAthletes);
  const [, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [withPerformance, setWithPerformance] = useState(
    props.includePerformance,
  );
  const performanceRecordings = useTypedSelector(
    (state) => state.performanceRecordings.data,
  ) as PerformanceRecording[];
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];

  useEffect(() => {
    if (props.isOpen) {
      setLoading(true);
      setAthletes(props.selectedAthletes);
    }
  }, [props.isOpen, props.selectedAthletes]);

  useEffect(() => {
    if (athletes.length > 0) {
      setLoading(false);
    }
  }, [athletes]);

  useEffect(()=> {
    if(props.isOpen && athletes.length === 0){
      props.setOpen(false);
    }
  },[athletes.length, props.setOpen])

  const generateCSV = (data: any[], withPerformance: boolean) => {
    const attributeToGermanHeader: Record<string, string> = {
      first_name: "Vorname",
      last_name: "Nachname",
      email: "Email",
      birthdate: "Geburtsdatum",
      birthyear: "Geburtsjahr",
      birthday: "Geburtstag",
      gender: "Geschlecht",
      discipline: "Übung",
      category: "Kategorie",
      date: "Datum",
      result: "Ergebnis",
      points: "Punkte",
    };
    const columns = withPerformance
      ? [
          "first_name",
          "last_name",
          "gender",
          "birthyear",
          "birthday",
          "discipline",
          "category",
          "date",
          "result",
          "points",
        ]
      : ["first_name", "last_name", "email", "birthdate", "gender"];
    const header =
      columns.map((col) => attributeToGermanHeader[col] || col).join(";") +
      "\n";

    const rows = data
      .map((item) => {
        if (!withPerformance) {
          return columns.map((col) => item[col] || "").join(";");
        }

        console.log("Performance Recordings:", performanceRecordings);

        const performanceRecordingsOfAthlete = performanceRecordings.filter(
          (p) => p.athlete_id === item.id,
        );
        if (performanceRecordingsOfAthlete.length === 0) {
          return columns.map((col) => item[col] || "").join(";");
        }

        const birthdate = item.birthdate ? new Date(item.birthdate) : null;
        const birthyear = birthdate
          ? birthdate.getFullYear().toString()
          : "N/A";

        return performanceRecordingsOfAthlete
          .map((perf) => {
            const discipline = disciplines.find(
              (d) => d.id === perf.discipline_rating_metric.discipline.id,
            );
            const points = convertMedalToNumber(
              calculatePerformanceRecordingMedal(perf),
            );
            return columns
              .map((col) => {
                switch (col) {
                  case "first_name":
                    return item.first_name || "N/A";
                  case "last_name":
                    return item.last_name || "N/A";
                  case "gender":
                    return item.gender || "N/A";
                  case "birthyear":
                    return birthyear || "N/A";
                  case "birthday":
                    return item.birthdate || "N/A";
                  case "discipline":
                    return discipline?.name || "N/A";
                  case "category":
                    return discipline?.category || "N/A";
                  case "date":
                    return perf.date_of_performance || "N/A";
                  case "result":
                    return perf.rating_value || "N/A";
                  case "points":
                    return points || "N/A";
                }
              })
              .join(";");
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
      {location.pathname.includes("/athletes/") && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <Button
            variant="soft"
            onClick={() => props.setOpen(true)}
            sx={{ display: "flex", justifyContent: "space-around" }}
          >
            <IosShareRounded />
            {t("components.athleteExportModal.exportButton")}
          </Button>
        </Box>
      )}
      <GenericModal
        open={props.isOpen}
        setOpen={props.setOpen}
        header={t("components.athleteExportModal.header")}
        modalDialogSX={{
          width: "600px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
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
                overlay
                label={t("components.athleteExportModal.performanceCheckbox")}
                checked={withPerformance}
                onChange={(event) => setWithPerformance(event.target.checked)}
              />
            </Sheet>
          </Box>
        </Box>
        <Box sx={{ overflow: "auto", maxHeight: isMobile ? "300px" : "400px" }}>
          <Sheet>
            <Table
              borderAxis="x"
              color="neutral"
              size="md"
              stickyFooter={false}
              stickyHeader
              hoverRow
              variant="plain"
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                pl: 1,
                pr: 1,
              }}
            >
              <thead>
                <th>
                  {t("components.athleteDatagrid.table.columns.firstName")}
                </th>
                <th>
                  {t("components.athleteDatagrid.table.columns.lastName")}
                </th>
                <th style={{ width: "120px", textAlign: "right" }}>
                  {t("components.athleteExportModal.removeFromSelectionButton")}
                </th>
              </thead>
              <tbody>
                {athletes.map((athlete) => (
                  <tr key={athlete.id}>
                    <td>{athlete.first_name}</td>
                    <td>{athlete.last_name}</td>
                    <td style={{ textAlign: "right" }}>
                      <IconButton
                        about="remove"
                        variant="soft"
                        color="danger"
                        size="sm"
                        sx={{ fontSize: "0.7rem", fontWeight: "100" }}
                        onClick={() => {
                          setAthletes((prev: any[]) =>
                            prev.filter((a) => a.id !== athlete.id),
                          );
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </Box>
        <Button fullWidth color="primary" onClick={handleExport}>
          {t("components.athleteExportModal.exportButton")}
        </Button>
      </GenericModal>
    </>
  );
};

export default AthleteExportModal;
