import useBreadcrumbs, {
  BreadcrumbComponentProps,
  BreadcrumbsRoute,
} from "use-react-router-breadcrumbs";
import { Breadcrumbs, Link } from "@mui/joy";
import { ChevronRight } from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import useAthleteLookup from "@hooks/useAthleteLookup";

const CustomBreadcrumbs = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { useAthleteNameLookup } = useAthleteLookup();

  const useBreadcrumbsAthleteNameConverter = (
    athleteId: BreadcrumbComponentProps<string>,
  ) => useAthleteNameLookup(athleteId.match.params.athleteId as string);

  const routes: BreadcrumbsRoute[] = [
    {
      path: "/athletes/:athleteId",
      breadcrumb: useBreadcrumbsAthleteNameConverter,
    },
  ];
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <>
      {location.pathname == "/" ? (
        <></>
      ) : (
        <>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRight />}
            sx={{ pl: 0 }}
          >
            {breadcrumbs.map(({ match, breadcrumb }) => (
              <Link
                component={RouterLink}
                to={match.pathname}
                key={breadcrumb?.toLocaleString()}
              >
                {t("components.breadcrumbs.paths." + match.pathname, {
                  defaultValue: "",
                }) == ""
                  ? breadcrumb
                  : t("components.breadcrumbs.paths." + match.pathname)}
              </Link>
            ))}
          </Breadcrumbs>
        </>
      )}
    </>
  );
};

export default CustomBreadcrumbs;
