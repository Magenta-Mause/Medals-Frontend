import { AccessRequest, Trainer } from "@customTypes/backendTypes";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import useApi from "@hooks/useApi";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/joy";
import ConfirmationPopup from "@components/ConfirmationPopup/ConfirmationPopup";
import { useCallback, useState } from "react";

export interface AthleteAccessElement {
  state: "PENDING" | "APPROVED";
  trainer: Trainer;
  accessRequest?: AccessRequest;
}

const AthleteAccessDatagrid = (props: { data: AthleteAccessElement[] }) => {
  const { t } = useTranslation();
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AthleteAccessElement>();
  const { approveRequest, revokeRequest, removeAssignedTrainer } = useApi();

  const revokeCallback = useCallback(async () => {
    await removeAssignedTrainer(selectedItem?.trainer?.id ?? -1);
    setRevokeModalOpen(false);
  }, [removeAssignedTrainer, selectedItem]);

  const rejectCallback = useCallback(async () => {
    await revokeRequest(
      selectedItem?.accessRequest?.id ?? "",
      selectedItem?.accessRequest?.athlete?.id ?? -1,
    );
    setRejectModalOpen(false);
  }, [revokeRequest, selectedItem]);

  const columns: Column<AthleteAccessElement>[] = [
    {
      columnName: t("components.athleteAccessManagementDatagrid.state"),
      columnMapping(item) {
        return (
          <Typography
            sx={{ userSelect: "none" }}
            color={item.state == "PENDING" ? "primary" : "success"}
          >
            {t(
              "components.athleteAccessManagementDatagrid.states." + item.state,
            )}
          </Typography>
        );
      },
      size: "xs",
    },
    {
      columnName: t(
        "components.athleteAccessManagementDatagrid.trainer.firstName",
      ),
      columnMapping(item) {
        return item.trainer.first_name;
      },
      size: "xs",
    },
    {
      columnName: t(
        "components.athleteAccessManagementDatagrid.trainer.lastName",
      ),
      columnMapping(item) {
        return item.trainer.last_name;
      },
      size: "xs",
    },
  ];

  const actions: (
    item: AthleteAccessElement,
  ) => Action<AthleteAccessElement>[] = (item) => {
    if (item.state == "PENDING") {
      return [
        {
          label: t("components.athleteAccessManagementDatagrid.actions.accept"),
          key: "accept",
          color: "primary",
          operation: async (item) => {
            await approveRequest(
              item.accessRequest?.id ?? "",
              item.accessRequest?.athlete?.id ?? -1,
            );
          },
        },
        {
          label: t("components.athleteAccessManagementDatagrid.actions.reject"),
          key: "reject",
          color: "danger",
          operation: async (item) => {
            setRejectModalOpen(true);
            setSelectedItem(item);
          },
        },
      ];
    }
    return [
      {
        label: t("components.athleteAccessManagementDatagrid.actions.revoke"),
        key: "revoke",
        color: "danger",
        operation: async (item) => {
          setRevokeModalOpen(true);
          setSelectedItem(item);
        },
      },
    ];
  };
  const mobileRendering: MobileTableRendering<AthleteAccessElement> = {
    h1: (item) => item.trainer.first_name + " " + item.trainer.last_name,
    h2: (item) =>
      t("components.athleteAccessManagementDatagrid.states." + item.state),
  };

  return (
    <>
      <GenericResponsiveDatagrid
        columns={columns}
        data={props.data}
        keyOf={(item) => item.trainer.id}
        actionMenu={actions}
        mobileRendering={mobileRendering}
        disablePaging
      />
      <ConfirmationPopup
        confirmButtonText={t(
          "components.athleteAccessManagementDatagrid.actions.revoke",
        )}
        header={t(
          "components.athleteAccessManagementDatagrid.confirmations.revoke.header",
        )}
        message={t(
          "components.athleteAccessManagementDatagrid.confirmations.revoke.message",
        )}
        onClose={() => setRevokeModalOpen(false)}
        onConfirm={revokeCallback}
        open={revokeModalOpen}
      />
      <ConfirmationPopup
        confirmButtonText={t(
          "components.athleteAccessManagementDatagrid.actions.reject",
        )}
        header={t(
          "components.athleteAccessManagementDatagrid.confirmations.reject.header",
        )}
        message={t(
          "components.athleteAccessManagementDatagrid.confirmations.reject.message",
        )}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={rejectCallback}
        open={rejectModalOpen}
      />
    </>
  );
};
export default AthleteAccessDatagrid;
