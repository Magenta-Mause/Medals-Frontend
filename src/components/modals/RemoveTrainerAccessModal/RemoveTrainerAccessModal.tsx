import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import { Athlete, Trainer } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Typography } from "@mui/joy";
import GenericModal from "../GenericModal";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import useApi from "@hooks/useApi";
import { enqueueSnackbar } from "notistack";

interface RemoveConnectionModalProps {
  trainers: Trainer[];
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveTrainerAccessModal = (props: RemoveConnectionModalProps) => {
  const { removeTrainerAthleteConnection } = useApi();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [isRemoveConfirmationModalOpen, setRemoveConfirmationModalOpen] =
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
        setRemoveConfirmationModalOpen(true);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Trainer> = {};

  const handleConfirmRemove = async () => {
    if (isSelectedTrainer && athlete?.id) {
      try {
        const success = await removeTrainerAthleteConnection(
          isSelectedTrainer.id,
          athlete.id,
        );

        if (success) {
          console.log("Remove Connection: ", athlete, selectedUser);
          enqueueSnackbar(t("snackbar.removalConfirmationModal.success"), {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("Error while removing athlete connection", error);
        enqueueSnackbar(t("snackbar.removalConfirmationModal.error"), {
          variant: "error",
        });
      } finally {
        setRemoveConfirmationModalOpen(false);
      }
    } else {
      setRemoveConfirmationModalOpen(false);
    }
  };

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
          <ConfirmationPopup
            open={isRemoveConfirmationModalOpen}
            onClose={() => {
              setRemoveConfirmationModalOpen(false);
            }}
            onConfirm={handleConfirmRemove}
            header={t("components.confirmationModal.header")}
            message={t("components.confirmationModal.description2")}
            confirmButtonText={t("components.confirmationModal.remove")}
          />
        </>
      </GenericModal>
    </>
  );
};
export default RemoveTrainerAccessModal;
