// AthleteDashboard.tsx
import React from "react";
import Grid2, { Grid2Props } from "@mui/material/Grid2";
import { Card, CardContent, Typography } from "@mui/joy";

const GridBox = (props: {
  children: React.JSX.Element;
  size: Grid2Props["size"] | undefined;
}) => {
  return <Grid2 size={props.size}>{props.children}</Grid2>;
};

const AthleteDashboardPage = () => {
  // Example mock data (replace with your real data)
  const swimmingLevel = "Gold Certification";
  const totalMedals = 27;
  const recentPerformances = [
    { date: "2025-04-10", event: "100m Freestyle", time: "54.2s" },
    { date: "2025-03-30", event: "50m Backstroke", time: "29.4s" },
  ];

  return (
    <Grid2 container spacing={2} sx={{ p: 2 }} alignItems={"stretch"}>
      {/* Swimming Certification */}
      <GridBox size={{ xs: 12, md: 2 }}>
        <Card variant="soft" color="primary" sx={{ height: "100%" }}>
          <CardContent>
            <Typography level="title-md">Swimming Certification</Typography>
            <Typography level="body-md">{swimmingLevel}</Typography>
          </CardContent>
        </Card>
      </GridBox>

      {/* Total Medals */}
      <GridBox size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="neutral" sx={{ height: "100%" }}>
          <CardContent>
            <Typography level="title-md">Total Medals</Typography>
            <Typography level="h2" fontWeight="lg">
              {totalMedals}
            </Typography>
          </CardContent>
        </Card>
      </GridBox>

      {/* Recent Performances */}
      <GridBox size={{ xs: 12, md: 4 }}>
        <Card variant="soft" color="success" sx={{ height: "100%" }}>
          <CardContent>
            <Typography level="title-md">Recent Performances</Typography>
            {recentPerformances.map((perf, index) => (
              <Typography key={index} level="body-sm">
                {perf.date}: {perf.event} – {perf.time}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </GridBox>

      {/* Placeholder for future stats */}
      <GridBox size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="warning" sx={{ height: "100%" }}>
          <CardContent>
            <Typography level="title-md">Training Schedule</Typography>
            <Typography level="body-sm">Coming soon...</Typography>
          </CardContent>
        </Card>
      </GridBox>

      <GridBox size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="danger" sx={{ height: "100%" }}>
          <CardContent>
            <Typography level="title-md">Injury Reports</Typography>
            <Typography level="body-sm">No active injuries.</Typography>
          </CardContent>
        </Card>
      </GridBox>
    </Grid2>
  );
};

export default AthleteDashboardPage;
