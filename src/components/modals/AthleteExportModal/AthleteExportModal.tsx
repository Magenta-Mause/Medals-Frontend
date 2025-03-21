import { t } from "i18next";
import GenericModal from "../GenericModal";
import { Box, Button, Chip, Typography } from "@mui/joy";
import { Athlete } from "@customTypes/backendTypes";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, { Action } from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import { A } from "react-router/dist/development/route-data-Cw8htKcF";
import { useEffect, useState } from "react";
import { createDateStrForV7HiddenInputFromSections } from "@mui/x-date-pickers/internals";

const AthleteExportModal = (props: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedAthletes: Athlete[];
}) => {

  const [athletes, setAthletes] = useState(props.selectedAthletes);
  const [loading, setLoading] = useState(true);

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

  const actions: Action<Athlete>[]= [
    {
      label: <>Remove from Selection</>,
      color: "primary",
      key: "remove",
      operation: function (athlete): void{
        setAthletes((prev) => prev.filter((a) => a.id !== athlete.id));
        console.log("Removing Athlete from selection:", athlete);
      }
    }
  ]
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
      
      bottomButtons: [
        ...actions
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
          {athlete.gender.slice(0, 1).toUpperCase()}
        </Chip>
      ),
    };

    useEffect(()=>{
      if(props.isOpen){
        setLoading(true);
        setAthletes(props.selectedAthletes);
      }
    },[props.isOpen, props.selectedAthletes]);

    useEffect(() => {
      if (athletes.length > 0) {
        setLoading(false);
      }
    }, [athletes]);


  return (
    <GenericModal
      open={props.isOpen}
      setOpen={props.setOpen}
      header={t("components.athleteExportModal.header")}
      modalDialogSX={{
        width: "600px",
      }}
    >
      <Box>
      <Box>
      <GenericResponsiveDatagrid
          isLoading={loading}
          data={athletes} 
          columns={columns} 
          keyOf={(athlete)=>athlete.id!}
          mobileRendering={mobileRendering}
          elementsPerPage={6}
          actionMenu={actions}
        />
        </Box>
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            
          }}
        >
          {t("components.athleteExportModal.exportButton")}
        </Button>
      </Box>
    </GenericModal>
  );
};

export default AthleteExportModal;
