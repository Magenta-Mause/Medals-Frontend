import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";

interface EntityCreationModalProps<T> {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  header: string;
  FormComponent: React.ComponentType<{
    inviteCallback: (formValues: T) => void;
    isPending: boolean;
    entityType: "trainer" | "admin";
  }>;
  inviteFunction: (data: T) => Promise<boolean>;
  successMessage: string;
  errorMessage: string;
  entityType: "trainer" | "admin";
}

function EntityCreationModal<T>({
  isOpen,
  setOpen,
  header,
  FormComponent,
  inviteFunction,
  successMessage,
  errorMessage,
  entityType,
}: EntityCreationModalProps<T>) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (data: T): Promise<void> => {
    setIsSubmitting(true);

    const success = await inviteFunction(data);

    setIsSubmitting(false);
    setOpen(false);

    enqueueSnackbar(t(success ? successMessage : errorMessage), {
      variant: success ? "success" : "error",
    });
  };

  return (
    <GenericModal
      header={t(header, { entityType: t(`generic.${entityType}.singular`) })}
      open={isOpen}
      setOpen={setOpen}
      modalDialogSX={{ minWidth: "30%" }}
    >
      <FormComponent 
        inviteCallback={handleSubmit} 
        isPending={isSubmitting} 
        entityType={entityType}
      />
    </GenericModal>
  );
}

export default EntityCreationModal;
