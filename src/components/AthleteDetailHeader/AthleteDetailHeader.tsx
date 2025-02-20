import { Athlete } from "@customTypes/backendTypes";
import { Box, Divider, Grid, Typography } from "@mui/joy";
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
      label: "id",
      size: 1,
      mapping: (athlete) => String(athlete.id),
    },
    {
      label: "name",
      size: 2,
      mapping: (athlete) => `${athlete.first_name} ${athlete.last_name}`,
    },
    {
      label: "birthdate",
      size: 2,
      mapping: (athlete) =>
        dateTimeFormatter.format(Date.parse(athlete.birthdate)),
    },
    {
      label: "email",
      size: 3,
      mapping: (athlete) => athlete.email,
    },
    {
      label: "gender",
      size: 2,
      mapping: (athlete) => t("genders." + athlete.gender),
    },
  ];

  return (
    <Box
      sx={{
        color: "primary.contrastText",
        width: "100%",
        background: "var(--joy-palette-background-level2)",
        padding: "20px 10px",
        borderRadius: "10px",
      }}
    >
      <Grid container spacing={2} justifyContent="space-evenly">
        {columnMappings.map((column) => (
          <Grid xs={12} md={column.size} key={column.label}>
            <Typography color="neutral" sx={{ userSelect: "none" }}>
              {t("components.athleteDetailHeader.columns." + column.label)}:
            </Typography>{" "}
            <Typography>{column.mapping(props.athlete)}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AthleteDetailHeader;
