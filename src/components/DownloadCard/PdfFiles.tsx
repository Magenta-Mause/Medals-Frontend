import { useTranslation } from "react-i18next";

export const usePdfFiles = () => {
  const { t } = useTranslation();

  return [
    {
      title: t("pages.downloadPage.filenames.dsa_single_test_card"),
      path: "/pdfs/DSA_Einzelpruefkarte_2025_FORMULAR.pdf",
      image: "/src/assets/single.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_group_test_card"),
      path: "/pdfs/DSA_Gruppenpruefkarte_2025_FORMULAR.pdf",
      image: "/src/assets/team.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_swimming"),
      path: "/pdfs/DSA-Schwimmnachweis_2025_beschreibbar.pdf",
      image: "/src/assets/swimming.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_achievement_2020"),
      path: "/pdfs/DSA_Poster_Zielerfuellung_KiJu_2020_SCREEN.pdf",
      image: "/src/assets/2020.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_achievement_2023"),
      path: "/pdfs/DSA_Leistungsuebersicht_KiJu_A4_2023",
      image: "/src/assets/2023.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_achievement_2024"),
      path: "/pdfs/DSA_Leistungsuebersicht_KiJu_A4_2024_SCREEN",
      image: "/src/assets/2024.jpg",
    },
    {
      title: t("pages.downloadPage.filenames.dsa_achievement_2025"),
      path: "/pdfs/DSA_Leistungsuebersicht_KiJu_A4_2025_SCREEN.pdf",
      image: "/src/assets/2025.jpg",
    },
  ];
};
