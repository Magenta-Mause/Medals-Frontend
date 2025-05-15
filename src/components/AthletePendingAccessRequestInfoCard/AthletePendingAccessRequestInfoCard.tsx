import InfoCard from "@components/InfoCard/InfoCard";
import { useTypedSelector } from "@stores/rootReducer";
import { useState } from "react";
import AthleteAccessManagementModal from "@components/modals/AthleteAccessManagementModal/AthleteAccessManagementModal";
import { useTranslation } from "react-i18next";

const AthletePendingAccessRequestInfoCard = () => {
  const accessRequests = useTypedSelector((state) => state.accessRequests.data);
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {accessRequests.length > 0 && (
        <InfoCard
          header={t("components.athletePendingRequestInfoCard.header")}
          text={
            accessRequests.length > 1
              ? accessRequests.length +
                " " +
                t("components.athletePendingRequestInfoCard.text.plural")
              : t("components.athletePendingRequestInfoCard.text.singular")
          }
          type={"success"}
          buttonText={t("components.athletePendingRequestInfoCard.button")}
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
