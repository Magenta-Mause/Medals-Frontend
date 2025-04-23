import React from "react";
import Grid2, { Grid2Props } from "@mui/material/Grid2";
import { Card, CardContent, Typography } from "@mui/joy";

const GenericDashboardBox = (props: {
  children: React.ReactNode;
  size: Grid2Props["size"] | undefined;
}) => {
  return (
    <Grid2 size={props.size}>
      <Card
        variant="outlined"
        color="neutral"
        sx={{
          height: "100%",
          boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.25)",
          width: "100%",
        }}
      >
        <CardContent>{props.children}</CardContent>
      </Card>
    </Grid2>
  );
};

const GenericDashboardBoxHeader = (props: { children: React.ReactNode }) => {
  return (
    <Typography level="title-md" color={"neutral"} sx={{ userSelect: "none" }}>
      {props.children}
    </Typography>
  );
};

const GenericDashboardBoxContent = (props: { children: React.ReactNode }) => {
  return (
    <Typography level="h2" fontWeight="normal">
      {props.children}
    </Typography>
  );
};

const GenericDashboardBoxFooter = (props: { children: React.ReactNode }) => {
  return (
    <Typography
      level="body-sm"
      sx={{ userSelect: "none", opacity: 0.75 }}
      color={"neutral"}
    >
      {props.children}
    </Typography>
  );
};

export {
  GenericDashboardBoxHeader,
  GenericDashboardBoxContent,
  GenericDashboardBoxFooter,
};
export default GenericDashboardBox;
