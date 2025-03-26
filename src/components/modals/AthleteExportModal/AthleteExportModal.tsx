import { t } from "i18next";
import GenericModal from "../GenericModal";
import { Box, Button, Chip, Switch, Typography } from "@mui/joy";
import { Athlete, Discipline, PerformanceRecording } from "@customTypes/backendTypes";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import React, { useEffect, useState } from "react";
import { Preview } from "@mui/icons-material";
import { useTypedSelector } from "@stores/rootReducer";

const AthleteExportModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedAthletes: Athlete[];
}) => {
  const [athletes, setAthletes] = useState(props.selectedAthletes);
  const [loading, setLoading] = useState(true);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [withPerformance, setWithPerformance] = useState(false);
  const performances = useTypedSelector((state)=> state.performanceRecordings.data,) as PerformanceRecording[];
  const disciplines = useTypedSelector((state)=> state.disciplines.data,) as Discipline[];

  const columns: Column<Athlete>[] = [
    {
      columnName: t("components.athleteDatagrid.table.columns.firstName"),
      columnMapping: (athlete) => athlete.first_name,
      sortable: true,
    },
    {
      columnName: t("components.athleteDatagrid.table.columns.lastName"),
      columnMapping: (athlete) => athlete.last_name,
      sortable: true,
    },
  ];

  const actions: Action<Athlete>[] = [
    {
      label: <>Remove from Selection</>,
      color: "primary",
      key: "remove",
      operation: function (athlete): void {
        setAthletes((prev) => prev.filter((a) => a.id !== athlete.id));
        console.log("Removing Athlete from selection:", athlete);
      },
    },
  ];
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

    bottomButtons: [...actions],
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
  };

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
        if (!withPerformance){
          return columns.map((col) => item[col] || "").join(";");
        }

        const athletePerformances = performances.filter(
          (p) => p.athlete_id === item.id
        );
        const birthdate = item.birthdate ? new Date (item.birthdate) : null;
        const birthyear = birthdate ? birthdate.getFullYear().toString() : "N/A";
        const birthday = birthdate ? birthdate.toString() : "N/A";

        if (athletePerformances.length === 0) {
          return columns.map((col) => item[col] || "").join(";");
        }

        return athletePerformances
        .map((perf) => {
          const discipline = disciplines.find(
            (d)=> d.id === perf.discipline_rating_metric.discipline.id
          );
          return columns
          .map((col)=>{
            switch (col) {
              case "first_name":
                return item.first_name ||"N/A";
              case "last_name":
                return item.last_name ||"N/A";
              case "gender":
                return item.gender ||"N/A";
              case "birthyear":
                return  birthyear ||"N/A"; 
              case "birthday":
                return item.birthdate ||"N/A";  
              case "discipline":
                return discipline?.name ||"N/A";
              case "category":
                return discipline?.category ||"N/A";
              case "date":
                return perf.date_of_performance ||"N/A";
              case "result":
                return perf.rating_value||"N/A";
              case "points":
                return "N/A";
            }
          }).join(";");
        }).join("\n");
      }).join("\n");

    const csvContent = header + rows;
    return csvContent;
  };

  const handlePreview = () => {
    const csvContent = generateCSV(athletes, withPerformance);
    setCsvPreview(csvContent);
    setShowPreviewDialog(true);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithPerformance(event.target.checked);
  };

  return (
    <GenericModal
      open={props.isOpen}
      setOpen={props.setOpen}
      header={t("components.athleteExportModal.header")}
      modalDialogSX={{
        width: "600px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            component="label"
            endDecorator={
              <Switch
                sx={{ ml: 1 }}
                checked={withPerformance}
                onChange={handleSwitchChange}
              />
            }
          >
            include Athlete Performance
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button onClick={handlePreview}>
            <Preview />
            {t("components.athleteExportModal.previewButton")}
          </Button>
        </Box>
      </Box>
      <Box>
        <GenericResponsiveDatagrid
          isLoading={loading}
          data={athletes}
          columns={columns}
          keyOf={(athlete) => athlete.id!}
          mobileRendering={mobileRendering}
          actionMenu={actions}
          disablePaging
        />
      </Box>
      <Button fullWidth color="primary" onClick={() => {}}>
        {t("components.athleteExportModal.exportButton")}
      </Button>

      <GenericModal
        header={t("components.athleteExport.previewHeader")}
        open={showPreviewDialog}
        setOpen={setShowPreviewDialog}
      >
        <Box sx={{ padding: 2 }}>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "10px",
              maxHeight: "400px",
              overflowY: "auto",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {csvPreview}
          </Box>
          <Button
            onClick={() => setShowPreviewDialog(false)}
            sx={{ marginTop: 2 }}
          >
            Schließen
          </Button>
        </Box>
      </GenericModal>
    </GenericModal>
  );
};

export default AthleteExportModal;
