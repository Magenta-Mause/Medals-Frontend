import { Box, Typography, List, ListItem } from "@mui/joy";
import { useTranslation } from "react-i18next";

const CreditsPage = () => {
  const { t } = useTranslation();

  const imageCredits = [
    {
      page: t("pages.creditsPage.loginPage"),
      credits: [
        {
          description: t("pages.creditsPage.lightMode"),
          author: "Anastasia Shuraeva",
          link: "https://www.pexels.com/photo/coach-talking-to-the-athletes-9519495/",
        },
        {
          description: t("pages.creditsPage.darkMode"),
          author: "Cottonbro Studio",
          link: "https://www.pexels.com/photo/a-man-coaching-a-team-of-women-6766999/",
        },
      ],
    },
    {
      page: t("pages.creditsPage.downloadPage"),
      credits: [
        {
          description: t("pages.creditsPage.swimmingCard"),
          author: "Mali Meader",
          link: "https://www.pexels.com/photo/person-swimming-on-body-of-water-1415810/",
        },
        {
          description: t("pages.creditsPage.singleAthletesCard"),
          author: "Nappy",
          link: "https://www.pexels.com/photo/man-wearing-white-sweater-and-black-shorts-about-to-run-936094/",
        },
        {
          description: t("pages.creditsPage.groupAthletesCard"),
          author: "Andrea Piacquadio",
          link: "https://www.pexels.com/photo/basketball-team-stacking-hands-together-3755440/",
        },
        {
          description: t("pages.creditsPage.2020MedalsCard"),
          author: "DS stories",
          link: "https://www.pexels.com/photo/medals-on-a-beige-surface-7267586/",
        },
        {
          description: t("pages.creditsPage.2023MedalsCard"),
          author: "DS stories",
          link: "https://www.pexels.com/photo/photograph-of-medals-on-white-shapes-7267573/",
        },
        {
          description: t("pages.creditsPage.2024MedalsCard"),
          author: "DS stories",
          link: "https://www.pexels.com/photo/gold-silver-and-bronze-round-medals-7267538/",
        },
        {
          description: t("pages.creditsPage.2025MedalsCard"),
          author: "DS stories",
          link: "https://www.pexels.com/photo/different-types-of-medals-on-shapes-7267585/",
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        overflowY: "scroll",
        height: "100vh",
        pb: 2,
      }}
    >
      <Typography level="h1" sx={{ mb: 2 }}>
        {t("pages.creditsPage.title")}
      </Typography>
      {imageCredits.map((section, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography level="h3" sx={{ mb: 1 }}>
            {section.page}
          </Typography>
          <List>
            {section.credits.map((credit, idx) => (
              <ListItem key={idx}>
                <Typography>
                  {credit.description}:{" "}
                  <a
                    href={credit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("pages.creditsPage.photoBy")} {credit.author}
                  </a>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default CreditsPage;
