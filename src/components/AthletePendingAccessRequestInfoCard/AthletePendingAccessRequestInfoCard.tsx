import InfoCard from "@components/InfoCard/InfoCard";
import { useTranslation } from "react-i18next";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import AthleteAccessManagementModal from "@components/modals/AthleteAccessManagementModal/AthleteAccessManagementModal";

const AthletePendingAccessRequestInfoCard = () => {
  const accessRequests = useTypedSelector((state) => state.accessRequests.data);
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {accessRequests.length > 0 && (
        <InfoCard
          header={accessRequests.length + " Access request"}
          text={
            accessRequests.length +
            " Trainer*innen haben Zugriff auf deinen Account angefragt"
          }
          type={"success"}
          buttonText={"Zugriff Verwalten"}
          buttonCallback={() => {
            setModalOpen(true);
          }}
        />
      )}
      <AthleteAccessManagementModal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
      />
    </>
  );
};

export default AthletePendingAccessRequestInfoCard;
