import { Box, Typography, List, ListItem } from "@mui/joy";
import { useTranslation } from "react-i18next";

const AcknowledgementPage = () => {
  const { t } = useTranslation();

  const imageCredits = [
    {
      description: t("pages.acknowledgementPage.loginPage"),
      credits: [
        {
          mode: "LightMode",
          text: "Photo by Anastasia Shuraeva",
          link: "https://www.pexels.com/photo/coach-talking-to-the-athletes-9519495/",
        },
        {
          mode: "DarkMode",
          text: "Photo by Rosemary Ketchum",
          link: "https://www.pexels.com/photo/group-of-women-standing-outdoor-during-day-1564420/",
        },
      ],
    },
    {
      description: t("pages.acknowledgementPage.downloadPage"),
      credits: [
        {
          mode: "SwimmingCard",
          text: "Photo by Mali Meader",
          link: "https://www.pexels.com/photo/person-swimming-on-body-of-water-1415810/",
        },
        {
          mode: "SingleAtheletsCard",
          text: "Photo by Nappy",
          link: "https://www.pexels.com/photo/man-wearing-white-sweater-and-black-shorts-about-to-run-936094/",
        },
        {
          mode: "GroupAtheletsCard",
          text: "Photo by Andrea Piacquadio",
          link: "https://www.pexels.com/photo/basketball-team-stacking-hands-together-3755440/",
        },
        {
          mode: "2020MedalsCard",
          text: "Photo by DS stories",
          link: "https://www.pexels.com/photo/medals-on-a-beige-surface-7267586/",
        },
        {
          mode: "2023MedalsCard",
          text: "Photo by DS stories",
          link: "https://www.pexels.com/photo/photograph-of-medals-on-white-shapes-7267573/",
        },
        {
          mode: "2024MedalsCard",
          text: "Photo by DS stories",
          link: "https://www.pexels.com/photo/gold-silver-and-bronze-round-medals-7267538/",
        },
        {
          mode: "2025MedalsCard",
          text: "Photo by DS stories",
          link: "https://www.pexels.com/photo/different-types-of-medals-on-shapes-7267585/",
        },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h1" sx={{ mb: 2 }}>
        {t("pages.acknowledgementPage.title")}
      </Typography>
      {imageCredits.map((section, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography level="h3" sx={{ mb: 1 }}>
            {section.description}
          </Typography>
          <List>
            {section.credits.map((credit, idx) => (
              <ListItem key={idx}>
                <Typography>
                  {credit.mode}:{" "}
                  <a
                    href={credit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {credit.text}
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

export default AcknowledgementPage;
