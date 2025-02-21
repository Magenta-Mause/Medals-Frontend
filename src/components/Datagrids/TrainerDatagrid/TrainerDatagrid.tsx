import useApi from "@hooks/useApi";
import { Trainer } from "@customTypes/bffTypes";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { removeTrainer } from "@stores/slices/trainerSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Column } from "../GenericResponsiveDatagrid/FullScreenTable";
import GenericResponsiveDatagrid, {
  Action,
  ToolbarAction,
} from "../GenericResponsiveDatagrid/GenericResponsiveDatagrid";
import { Filter } from "../GenericResponsiveDatagrid/GenericResponsiveDatagridFilterComponent";
import { MobileTableRendering } from "../GenericResponsiveDatagrid/MobileTable";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useSnackbar } from "notistack";

interface TrainerDatagridProps {
  trainers: Trainer[];
  isLoading: boolean;
}

const TrainerDatagrid = (props: TrainerDatagridProps) => {
  const { deleteTrainer, inviteTrainer } = useApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [addTrainerModalOpen, setAddTrainerModalOpen] = useState(false);

  // Trainer invitation modal values
  const [trainerInviteForm, setTrainerInviteForm] = useState({
    email: "",
    emailInputValid: true,

    firstName: "",
    firstNameInputValid: true,

    lastName: "",
    lastNameInputValid: true,
  });

  /*const [trainerInviteSnackbar, setTrainerInviteSnackbar] =
    useState<TrainerInviteSnackbar>({
      open: false,
      text: "",
    });*/
  const { enqueueSnackbar } = useSnackbar();

  const [trainerInviteSubmitted, setTrainerInviteSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitTrainerInvitation = (): void => {
    let error: boolean = false;

    if (!validateEmail(trainerInviteForm.email)) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        emailInputValid: false,
      }));
      error = true;
    }

    if (!trainerInviteForm.firstName) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        firstNameInputValid: false,
      }));
      error = true;
    }

    if (!trainerInviteForm.lastName) {
      setTrainerInviteForm((formData) => ({
        ...formData,
        lastNameInputValid: false,
      }));
      error = true;
    }

    if (error) return;

    console.log("Inviting trainer..");
    setTrainerInviteSubmitted(true);

    // send request here
    inviteTrainer({
      id: -1,
      email: trainerInviteForm.email,
      first_name: trainerInviteForm.firstName,
      last_name: trainerInviteForm.lastName,
    })
      .then(() => {
        setAddTrainerModalOpen(false);
        setTrainerInviteSubmitted(false);
        enqueueSnackbar(t("snackbar.inviteTrainer.success"), {
          variant: "success",
        });
      })
      .catch(() => {
        setAddTrainerModalOpen(false);
        setTrainerInviteSubmitted(false);
        enqueueSnackbar(t("snackbar.inviteTrainer.failed"), {
          variant: "error",
        });
      })
      .finally(() => {
        setTrainerInviteForm({
          email: "",
          emailInputValid: true,

          firstName: "",
          firstNameInputValid: true,

          lastName: "",
          lastNameInputValid: true,
        });
      });
  };

  const columns: Column<Trainer>[] = [
    {
      columnName: t("components.trainerDatagrid.table.columns.trainerId"),
      columnMapping(item) {
        return <Typography color="primary">TRN-{item.id}</Typography>;
      },
      size: "s",
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.firstName"),
      columnMapping(item) {
        return <Typography>{item.first_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.lastName"),
      columnMapping(item) {
        return <Typography>{item.last_name}</Typography>;
      },
      sortable: true,
    },
    {
      columnName: t("components.trainerDatagrid.table.columns.email"),
      size: "l",
      columnMapping(item) {
        return <Typography noWrap>{item.email}</Typography>;
      },
    },
  ];

  const filters: Filter<Trainer>[] = [
    {
      name: "search",
      label: t("components.trainerDatagrid.table.filters.search"),
      apply(filterParameter) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();
        return (trainer) =>
          trainer.first_name.toLowerCase().includes(filterParameter) ||
          trainer.last_name.toLowerCase().includes(filterParameter) ||
          trainer.email.toLowerCase().includes(filterParameter) ||
          trainer.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  ];

  const toolbarActions: ToolbarAction[] = [
    {
      label: t("components.trainerDatagrid.table.toolbar.addTrainer.label"),
      content: t("components.trainerDatagrid.table.toolbar.addTrainer.content"),
      icon: <Add />,
      collapseToText: true,
      color: "primary",
      key: "invite-trainer",
      variant: "solid",
      operation: function (): void {
        console.log("adding trainer modal");
        setAddTrainerModalOpen(true);
      },
    },
  ];

  const actions: Action<Trainer>[] = [
    {
      label: <>Delete</>,
      color: "danger",
      key: "delete",
      variant: "solid",
      operation: function (item): void {
        dispatch(removeTrainer({ id: item.id }));
        deleteTrainer(item.id);
        console.log("Deleted Trainer:", item);
      },
    },
  ];

  const mobileRendering: MobileTableRendering<Trainer> = {
    avatar: (trainer) => <>{trainer.id}</>,
    h1: (trainer) => (
      <>
        {trainer.first_name} {trainer.last_name}
      </>
    ),
    h2: (trainer) => <>{trainer.email}</>,
    bottomButtons: actions,
    searchFilter: {
      name: "search",
      label: "Search",
      apply(filterParameter: string | undefined) {
        if (filterParameter == undefined) {
          return () => true;
        }
        filterParameter = filterParameter.toLowerCase();

        return (trainer) =>
          trainer.first_name.toLowerCase().includes(filterParameter) ||
          trainer.last_name.toLowerCase().includes(filterParameter) ||
          trainer.email.toLowerCase().includes(filterParameter) ||
          trainer.id.toString().toLowerCase().includes(filterParameter);
      },
      type: "TEXT",
    },
  };

  return (
    <>
      <GenericResponsiveDatagrid
        isLoading={props.isLoading}
        data={props.trainers}
        columns={columns}
        filters={filters}
        toolbarActions={toolbarActions}
        actionMenu={actions}
        itemSelectionActions={actions}
        keyOf={(item) => item.id}
        mobileRendering={mobileRendering}
      />
      <Modal
        open={addTrainerModalOpen}
        onClose={() => {
          setAddTrainerModalOpen(false);
        }}
      >
        <ModalDialog sx={{ minWidth: "30%" }}>
          <ModalClose />
          <Typography>
            {t("components.trainerDatagrid.table.toolbar.addTrainer.content")}
          </Typography>
          <Divider inset="none" sx={{ marginBottom: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.email")}
              </FormLabel>
              <Input
                size="md"
                placeholder="someone@example.com"
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    emailInputValid: true,
                    email: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.emailInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.firstName")}
              </FormLabel>
              <Input
                placeholder={t(
                  "components.trainerDatagrid.inviteModal.firstNamePlaceholder",
                )}
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    firstNameInputValid: true,
                    firstName: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.firstNameInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>
                {t("components.trainerDatagrid.inviteModal.lastName")}
              </FormLabel>
              <Input
                size="md"
                placeholder={t(
                  "components.trainerDatagrid.inviteModal.lastNamePlaceholder",
                )}
                onChange={(event) => {
                  setTrainerInviteForm((formData) => ({
                    ...formData,
                    lastNameInputValid: true,
                    lastName: event.target.value,
                  }));
                }}
                error={!trainerInviteForm.lastNameInputValid}
                disabled={trainerInviteSubmitted}
              />
            </FormControl>
          </Box>
          <Button
            onClick={handleSubmitTrainerInvitation}
            loading={trainerInviteSubmitted}
            sx={{ marginTop: 1 }}
          >
            {t("components.trainerDatagrid.inviteModal.confirm")}
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TrainerDatagrid;
