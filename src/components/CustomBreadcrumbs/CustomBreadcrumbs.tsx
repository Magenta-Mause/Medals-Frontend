import useBreadcrumbs, {
  BreadcrumbComponentProps,
  BreadcrumbsRoute,
} from "use-react-router-breadcrumbs";
import { Breadcrumbs, Link } from "@mui/joy";
import { ChevronRight } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import { useTranslation } from "react-i18next";
import useAthleteLookup from "@hooks/useAthleteLookup";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { UserType } from "@customTypes/enums";

const CustomBreadcrumbs = () => {
  const { t } = useTranslation();
  const { useAthleteNameLookup } = useAthleteLookup();
  const { selectedUser } = useContext(AuthContext);
  const myHome =
    selectedUser?.type == UserType.ATHLETE
      ? "/dashboard"
      : selectedUser?.type == UserType.ADMIN
        ? "/trainer"
        : "/athletes";

  const useBreadcrumbsAthleteNameConverter = (
    athleteId: BreadcrumbComponentProps<string>,
  ) => useAthleteNameLookup(athleteId.match.params.athleteId as string);

  const routes: BreadcrumbsRoute[] = [
    {
      path: "/:athleteId",
      breadcrumb: useBreadcrumbsAthleteNameConverter,
    },
  ];
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <>
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
              {t(
                "components.breadcrumbs.paths." +
                  (match.pathname == "/" ? myHome : match.pathname),
                {
                  defaultValue: "",
                },
              ) == ""
                ? breadcrumb
                : t(
                    "components.breadcrumbs.paths." +
                      (match.pathname == "/" ? myHome : match.pathname),
                  )}
            </Link>
          ))}
        </Breadcrumbs>
      </>
    </>
  );
};

export default CustomBreadcrumbs;
