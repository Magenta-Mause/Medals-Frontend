import { Athlete } from "@customTypes/backendTypes";
import { Box, Grid, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const AthleteDetailHeader = (props: { athlete: Athlete }) => {
  const { t, i18n } = useTranslation();
  const dateTimeFormatter = new Intl.DateTimeFormat(i18n.language);
  const columnMappings: {
    label: string;
    size: number;
    mapping: (athlete: Athlete) => string;
  }[] = [
    {
      label: "name",
      size: 2,
      mapping: (athlete) => `${athlete.first_name} ${athlete.last_name}`,
    },
    {
      label: "id",
      size: 2,
      mapping: (athlete) => String(athlete.id),
    },
    {
      label: "birthdate",
      size: 2,
      mapping: (athlete) =>
        dateTimeFormatter.format(Date.parse(athlete.birthdate)),
    },
    {
      label: "gender",
      size: 2,
      mapping: (athlete) => t("genders." + athlete.gender),
    },
    {
      label: "email",
      size: 3,
      mapping: (athlete) => athlete.email,
    },
  ];

  return (
    <Box
      sx={{
        color: "primary.contrastText",
        width: "100%",
        background: "var(--joy-palette-background-level2)",
        padding: "20px 20px",
        borderRadius: "10px",
        mb: "10px",
      }}
    >
      <Grid container spacing={1} justifyContent="left">
        {columnMappings.map((column) => (
          <Grid xs={column.size * 3} md={column.size} key={column.label}>
            <Typography
              color="neutral"
              sx={{
                userSelect: "none",
                wordBreak: "break-all",
                hyphens: "auto",
              }}
              lang={"de"}
            >
              {t("components.athleteDetailHeader.columns." + column.label)}:
            </Typography>
            <Typography
              sx={{ wordBreak: "break-all", hyphens: "auto" }}
              lang={i18n.language}
            >
              {column.mapping(props.athlete)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AthleteDetailHeader;
