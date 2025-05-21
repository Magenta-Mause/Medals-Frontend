import { Box } from "@mui/joy";
import { Fragment, useState } from "react";

const Toggler = ({
  defaultExpanded = false,
  overridenOpen = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  overridenOpen?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <Fragment>
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          (overridenOpen ?? open)
            ? { gridTemplateRows: "1fr" }
            : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
      {renderToggle({ open, setOpen })}
    </Fragment>
  );
};

export default Toggler;
