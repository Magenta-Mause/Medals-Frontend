import useBreadcrumbs, { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { Breadcrumbs, Link } from "@mui/joy";
import { ChevronRight } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";

const routes: BreadcrumbsRoute[] = [];

const CustomBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRight />}
        sx={{ pl: 0 }}
      >
        {breadcrumbs.map(({ match, breadcrumb }) => (
          <Link component={RouterLink} to={match.pathname}>
            {breadcrumb}
          </Link>
        ))}
      </Breadcrumbs>
    </>
  );
};

export default CustomBreadcrumbs;
