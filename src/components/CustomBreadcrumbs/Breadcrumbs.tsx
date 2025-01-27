import useBreadcrumbs, { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { Breadcrumbs, Link } from "@mui/joy";
import { ChevronRight } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import { useTranslation } from "react-i18next";

const routes: BreadcrumbsRoute[] = [];

const CustomBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);
  const {t} = useTranslation();

  return (
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
            {t("components.breadcrumbs.paths." + match.pathname)}
          </Link>
        ))}
      </Breadcrumbs>
    </>
  );
};

export default CustomBreadcrumbs;
