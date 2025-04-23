import React, { useCallback, useLayoutEffect } from "react";
// @ts-expect-error hihi library doesnt support types correctly
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import dayjs from "dayjs";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { Box, useColorScheme } from "@mui/joy";
import "./AthleteActivityChart.css";
import { useTranslation } from "react-i18next";
import PerformanceRecordingViewModal from "@components/modals/PerformanceRecordingViewModal/PerformanceRecordingViewModal";
import { Medals } from "@customTypes/enums";
import { calculatePerformanceRecordingMedal } from "@utils/calculationUtil";

const AthleteActivityChart = (props: {
  performanceRecordings: PerformanceRecording[];
}) => {
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();
  const [
    performanceRecordingViewModalOpen,
    setPerformanceRecordingViewModalOpen,
  ] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const calculateData = useCallback(() => {
    const countPerDay: Record<
      string,
      {
        totalCount: number;
        countsPerMedal: Record<Medals, number>;
      }
    > = {};
    props.performanceRecordings.forEach((recording) => {
      const date = dayjs(recording.date_of_performance).format("YYYY-MM-DD");
      if (!(date in countPerDay)) {
        countPerDay[date] = {
          totalCount: 0,
          countsPerMedal: {
            [Medals.NONE]: 0,
            [Medals.GOLD]: 0,
            [Medals.SILVER]: 0,
            [Medals.BRONZE]: 0,
          },
        };
      }
      countPerDay[date].totalCount += 1;
      countPerDay[date].countsPerMedal[
        calculatePerformanceRecordingMedal(recording)
      ] += 1;
    });
    return Object.keys(countPerDay).map((date) => ({
      date,
      value: countPerDay[date].totalCount,
    }));
  }, [props.performanceRecordings]);

  useLayoutEffect(() => {
    const data = calculateData();
    const cal = new CalHeatmap();

    cal.destroy();
    cal.on("click", (event: any, timestamp: string) => {
      const date = dayjs(timestamp);
      setSelectedDate(date.format("YYYY-MM-DD"));
      setPerformanceRecordingViewModalOpen(true);
    });

    cal.paint(
      {
        data: {
          source: data,
          x: "date",
          y: "value",
        },
        date: {
          start: new Date("2025-01-01"),
          max: new Date(),
          locale: i18n.language,
        },
        range: 10,
        scale: {
          color: {
            type: "threshold",
            range:
              colorScheme.colorScheme == "dark"
                ? ["#14432a", "#166b34", "#37a446", "#4dd05a"].reverse()
                : ["#14432a", "#166b34", "#37a446", "#4dd05a"],
            domain: [1, 2, 5],
          },
        },
        domain: {
          type: "month",
          label: { format: "%Y-%m" },
        },
        theme: colorScheme.colorScheme ?? "light",
        subDomain: { type: "day", radius: 2 },
        animationDuration: 0,
      },
      [
        [
          Tooltip,
          {
            // @ts-expect-error hihi library doesnt support types correctly
            text: function (date, value, dayjsDate) {
              return (
                (!value
                  ? t("components.athleteActivityChart.tooltipText.noData")
                  : value +
                    t(
                      "components.athleteActivityChart.tooltipText.data." +
                        (value > 1 ? "plural" : "singular"),
                    )) +
                " " +
                t("generic.date.on") +
                " " +
                dayjsDate.format("LL")
              );
            },
          },
        ],
      ],
    );

    return () => {
      cal.destroy();
    };
  }, [colorScheme, calculateData, i18n.language, t]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          overflowX: "scroll",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Box
          id={"cal-heatmap"}
          sx={{
            height: "105px",
            overflowX: "scroll",
            overflowY: "hidden",
            width: "fit-content",
          }}
        ></Box>
      </Box>
      <PerformanceRecordingViewModal
        open={performanceRecordingViewModalOpen}
        performanceRecordings={props.performanceRecordings.filter(
          (p) =>
            dayjs(p.date_of_performance).format("YYYY-MM-DD") == selectedDate,
        )}
        setOpen={setPerformanceRecordingViewModalOpen}
        selectedDate={selectedDate ?? undefined}
      />
    </>
  );
};

export default AthleteActivityChart;
