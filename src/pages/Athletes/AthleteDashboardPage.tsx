// AthleteDashboard.tsx
import React from "react";
import Grid2 from "@mui/material/Grid2";
import { Card, CardContent, Typography } from "@mui/joy";

const AthleteDashboardPage = () => {
  // Example mock data (replace with your real data)
  const swimmingLevel = "Gold Certification";
  const totalMedals = 27;
  const recentPerformances = [
    { date: "2025-04-10", event: "100m Freestyle", time: "54.2s" },
    { date: "2025-03-30", event: "50m Backstroke", time: "29.4s" },
  ];

  return (
    <Grid2 container spacing={2} sx={{ p: 2 }}>
      {/* Swimming Certification */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card variant="soft" color="primary">
          <CardContent>
            <Typography level="title-md">Swimming Certification</Typography>
            <Typography level="body-md">{swimmingLevel}</Typography>
          </CardContent>
        </Card>
      </Grid2>

      {/* Total Medals */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="neutral">
          <CardContent>
            <Typography level="title-md">Total Medals</Typography>
            <Typography level="h2" fontWeight="lg">
              {totalMedals}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>

      {/* Recent Performances */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card variant="soft" color="success">
          <CardContent>
            <Typography level="title-md">Recent Performances</Typography>
            {recentPerformances.map((perf, index) => (
              <Typography key={index} level="body-sm">
                {perf.date}: {perf.event} – {perf.time}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid2>

      {/* Placeholder for future stats */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="warning">
          <CardContent>
            <Typography level="title-md">Training Schedule</Typography>
            <Typography level="body-sm">Coming soon...</Typography>
          </CardContent>
        </Card>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" color="danger">
          <CardContent>
            <Typography level="title-md">Injury Reports</Typography>
            <Typography level="body-sm">No active injuries.</Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default AthleteDashboardPage;
