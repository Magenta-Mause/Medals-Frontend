import { Athlete } from "@customTypes/backendTypes";
import useFormatting from "@hooks/useFormatting";
import { Box, Grid, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

const AthleteDetailHeader = (props: {
  athlete?: Athlete | null;
  scalingFactor?: number;
}) => {
  const { t, i18n } = useTranslation();
  const { formatLocalizedDate } = useFormatting();
  const columnMappings: {
    label: string;
    size: number;
    mapping: (athlete: Athlete | null | undefined) => string;
  }[] = [
    {
      label: "name",
      size: 3,
      mapping: (athlete) =>
        athlete ? `${athlete.first_name} ${athlete.last_name}` : "-",
    },
    {
      label: "birthdate",
      size: 3,
      mapping: (athlete) => formatLocalizedDate(athlete?.birthdate),
    },
    {
      label: "gender",
      size: 3,
      mapping: (athlete) => (athlete ? t("genders." + athlete.gender) : "-"),
    },
    {
      label: "email",
      size: 3,
      mapping: (athlete) => (athlete ? athlete.email : "-"),
    },
  ];

  return (
    <Box
      sx={{
        color: "primary.contrastText",
        width: "100%",
        background: "var(--joy-palette-background-level2)",
        padding: "15px 20px",
        borderRadius: "10px",
        mb: "5px",
      }}
    >
      <Grid container spacing={1} justifyContent="left">
        {columnMappings.map((column) => (
          <Grid
            xs={column.size * 3}
            md={column.size * (props.scalingFactor ?? 1)}
            key={column.label}
          >
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
