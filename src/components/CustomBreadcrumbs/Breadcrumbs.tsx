import useBreadcrumbs, { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { Breadcrumbs, Link } from "@mui/joy";
import { ChevronRight } from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

const routes: BreadcrumbsRoute[] = [];

const CustomBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);
  const location = useLocation();
  const { t } = useTranslation();

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
                  defaultValue: match.pathname.split("/").reverse()[0],
                })}
              </Link>
            ))}
          </Breadcrumbs>
        </>
      )}
    </>
  );
};

export default CustomBreadcrumbs;
