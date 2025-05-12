import { AccessRequest, Trainer } from "@customTypes/backendTypes";
import GenericResponsiveDatagrid, {
  Action,
} from "@components/datagrids/GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Column } from "@components/datagrids/GenericResponsiveDatagrid/FullScreenTable";
import { MobileTableRendering } from "@components/datagrids/GenericResponsiveDatagrid/MobileTable";
import useApi from "@hooks/useApi";

export interface AthleteAccessElement {
  status: "PENDING" | "APPROVED";
  trainer: Trainer;
  accessRequest?: AccessRequest;
}

const AthleteAccessDatagrid = (props: { data: AthleteAccessElement[] }) => {
  const { approveRequest, revokeRequest, removeAssignedTrainer } = useApi();
  const columns: Column<AthleteAccessElement>[] = [
    {
      columnName: "Status",
      columnMapping(item) {
        return item.status;
      },
      size: "xs",
    },
    {
      columnName: "Trainer",
      columnMapping(item) {
        return item.trainer.first_name + " " + item.trainer.last_name;
      },
      size: "m",
    },
  ];

  const actions: (
    item: AthleteAccessElement,
  ) => Action<AthleteAccessElement>[] = (item) => {
    if (item.status == "PENDING") {
      return [
        {
          label: "Accept",
          key: "accept",
          color: "primary",
          operation: async (item) => {
            console.log(item);
            await approveRequest(
              item.accessRequest?.id ?? "",
              item.accessRequest?.athlete?.id ?? -1,
            );
          },
        },
        {
          label: "Reject",
          key: "reject",
          color: "danger",
          operation: async (item) => {
            await revokeRequest(
              item.accessRequest?.id ?? "",
              item.accessRequest?.athlete?.id ?? -1,
            );
          },
        },
      ];
    }
    return [
      {
        label: "Revoke",
        key: "revoke",
        color: "danger",
        operation: async (item) => {
          await removeAssignedTrainer(item.trainer.id);
        },
      },
    ];
  };
  const mobileRendering: MobileTableRendering<AthleteAccessElement> = {};

  return (
    <GenericResponsiveDatagrid
      columns={columns}
      data={props.data}
      keyOf={(item) => item.trainer.id}
      actionMenu={actions}
      mobileRendering={mobileRendering}
      disablePaging
    />
  );
};
export default AthleteAccessDatagrid;
