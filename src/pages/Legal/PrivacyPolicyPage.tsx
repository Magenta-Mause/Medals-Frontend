import { Box, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        overflowY: "scroll",
        height: "100vh",
        pb: 2,
      }}
    >
      <Typography level="h1" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.title")}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.introduction")}
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.controller")}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.controllerIntro")}
        <br />
        Simon Dietrich
        <br />
        Am Pulverturm 54, 01705 Freital, Deutschland
        <br />
        {t("pages.privacyPolicyPage.controllerEmail")}: medals.ageless325@passmail.net
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.personalData")}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.personalDataDetails")}
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.dataOnWebsiteVisit")}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.intro")}
        <ul>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.ipAddress")}</li>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.dateAndTime")}</li>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.dataVolume")}</li>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.referrer")}</li>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.browser")}</li>
          <li>{t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.os")}</li>
        </ul>
        {t("pages.privacyPolicyPage.dataOnWebsiteVisitDetails.legalBasis")}
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.yourRights")}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {t("pages.privacyPolicyPage.yourRightsDetails.intro")}
        <ul>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.access")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.rectification")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.erasure")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.restriction")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.dataPortability")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.objection")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.automatedDecisionMaking")}</li>
          <li>{t("pages.privacyPolicyPage.yourRightsDetails.complaint")}</li>
        </ul>
        {t("pages.privacyPolicyPage.source")}
      </Typography>
    </Box>
  );
};

export default PrivacyPolicyPage;
