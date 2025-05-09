import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import { Athlete, Trainer } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import RemoveTrainerConfirmationModal from "@components/modals/GenericConfirmationModal/RemoveConfirmationModal/RemoveTrainerConfirmationModal";
import { Typography } from "@mui/joy";
import GenericModal from "../GenericModal";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";

interface RemoveConnectionModalProps {
  trainers: Trainer[];
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveTrainerAccessModal = (props: RemoveConnectionModalProps) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [isRemoveTrainerAccessModalOpen, setRemoveTrainerAccessModalOpen] =
    useState(false);
  const [isSelectedTrainer, setSelectedTrainer] = useState<Trainer | undefined>(
    undefined,
  );
  const { selectedUser } = useContext(AuthContext);
  const athlete = selectedUser as unknown as Athlete;

  useEffect(() => {
    if (props.isOpen) {
      setLoading(true);
      setTrainers(props.trainers);
    }
  }, [props.trainers, props.isOpen, trainers]);

  useEffect(() => {
    if (trainers.length > 0) {
      setLoading(false);
    }
  }, [trainers]);

  const columns: Column<Trainer>[] = [
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

  const actions: Action<Trainer>[] = [
    {
      label: (
        <>{t("components.athleteExportModal.removeFromSelectionButton")}</>
      ),
      color: "danger",
      key: "remove",
      operation: async (item) => {
        setSelectedTrainer(item);
        setRemoveTrainerAccessModalOpen(true);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Trainer> = {};

  return (
    <>
      <GenericModal
        open={props.isOpen}
        setOpen={props.setOpen}
        header={t("components.athleteDashboard.trainers.header")}
      >
        <>
          <GenericResponsiveDatagrid
            isLoading={isLoading}
            data={trainers}
            columns={columns}
            actionMenu={actions}
            keyOf={(item) => item.id!}
            mobileRendering={mobileRendering}
            disablePaging={true}
          />
          <RemoveTrainerConfirmationModal
            isOpen={isRemoveTrainerAccessModalOpen}
            setOpen={setRemoveTrainerAccessModalOpen}
            trainer={isSelectedTrainer as Trainer}
            athlete={athlete}
          />
        </>
      </GenericModal>
    </>
  );
};

export default RemoveTrainerAccessModal;
