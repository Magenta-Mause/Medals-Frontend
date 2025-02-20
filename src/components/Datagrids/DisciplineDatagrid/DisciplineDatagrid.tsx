import useApi from "@hooks/useApi";
import { Athlete, Discipline } from "@customTypes/backendTypes";
import { Chip, Typography } from "@mui/joy";
import { removeAthlete } from "@stores/slices/athleteSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import { useState } from "react";
import AthleteDetailPopup from "@components/AthleteDetailPopup/AthleteDetailPopup";

interface DisciplineDatagridProps {
  disciplines: Discipline[];
  onDisciplineClick: (d: Discipline) => void;
  isLoading: boolean;
  disablePaging: boolean;
}

const DisciplineDatagrid = (props: DisciplineDatagridProps) => {
  const { deleteAthlete } = useApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const columns: Column<Discipline>[] = [
    {
      columnName: "Disziplin ID",
      columnMapping(item) {
        return <Typography color="primary">D-{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: "Disziplin Titel",
      columnMapping(item) {
        return <Typography>{item.name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: "Disziplin Beschreibung",
      columnMapping(item) {
        return <Typography>{item.description}</Typography>;
      },
      sortable: true,
    },
  ];

  const mobileRendering: MobileTableRendering<Discipline> = {
    avatar: (discipline) => <>{discipline.id}</>,
    h1: (discipline) => <>{discipline.name}</>,
    h2: (discipline) => <>{discipline.description}</>,
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
        {athlete.unit.slice(0, 1).toUpperCase()}
      </Chip>
    ),
  };

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.disciplines}
        columns={columns}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
        onItemClick={props.onDisciplineClick}
        disablePaging={props.disablePaging}
      />
    </>
  );
};

export default DisciplineDatagrid;
