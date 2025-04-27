import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";

interface EntityModalProps<T> {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  header: string;
  FormComponent: React.ComponentType<{
    submitCallback: (formValues: T) => void;
    isPending: boolean;
    entityType: "trainer" | "admin";
    initialValues?: T;
  }>;
  createFunction?: (data: T) => Promise<boolean>;
  updateFunction?: (data: T) => Promise<boolean>;
  successCreateMessage: string;
  errorCreateMessage: string;
  successUpdateMessage: string;
  errorUpdateMessage: string;
  entityType: "trainer" | "admin";
  entityToEdit?: T;
}

function EntityModal<T>({
  isOpen,
  setOpen,
  header,
  FormComponent,
  createFunction,
  updateFunction,
  successCreateMessage,
  errorCreateMessage,
  successUpdateMessage,
  errorUpdateMessage,
  entityType,
  entityToEdit,
}: EntityModalProps<T>) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const isEditMode = !!entityToEdit;

  const handleSubmit = async (data: T): Promise<void> => {
    setIsSubmitting(true);

    let success = false;
    
    if (isEditMode && updateFunction) {
      success = await updateFunction(data);
      enqueueSnackbar(t(success ? successUpdateMessage : errorUpdateMessage), {
        variant: success ? "success" : "error",
      });
    } else if (!isEditMode && createFunction) {
      success = await createFunction(data);
      enqueueSnackbar(t(success ? successCreateMessage : errorCreateMessage), {
        variant: success ? "success" : "error",
      });
    }

    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <GenericModal
      header={t(header, { 
        entityType: t(`generic.${entityType}.singular`),
        mode: isEditMode ? t("generic.edit") : t("generic.create") 
      })}
      open={isOpen}
      setOpen={setOpen}
      modalDialogSX={{ minWidth: "30%" }}
    >
      <FormComponent
        submitCallback={handleSubmit}
        isPending={isSubmitting}
        entityType={entityType}
        initialValues={entityToEdit}
      />
    </GenericModal>
  );
}

export default EntityModal;
