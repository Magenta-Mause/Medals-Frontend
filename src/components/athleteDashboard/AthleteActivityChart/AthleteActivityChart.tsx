import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
// @ts-expect-error hihi library doesnt support types correctly
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import dayjs from "dayjs";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { Box, Skeleton, useColorScheme } from "@mui/joy";
import "./AthleteActivityChart.css";
import { useTranslation } from "react-i18next";
import PerformanceRecordingViewModal from "@components/modals/PerformanceRecordingViewModal/PerformanceRecordingViewModal";
import { Medals } from "@customTypes/enums";
import { calculatePerformanceRecordingMedal } from "@utils/calculationUtil";

const AthleteActivityChart = (props: {
  performanceRecordings: PerformanceRecording[];
}) => {
  const { colorScheme } = useColorScheme();
  const cal = useRef<any>(null);
  const [loading, setLoading] = useState(false);
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
    return {
      list: Object.keys(countPerDay).map((date) => ({
        date,
        value: countPerDay[date].totalCount,
        medals: countPerDay[date].countsPerMedal,
      })),
      dict: countPerDay,
    };
  }, [props.performanceRecordings]);

  useLayoutEffect(() => {
    if (!cal.current) {
      cal.current = new CalHeatmap();
    }

    setLoading(true);
    const paint = async () => {
      const { list: data, dict } = calculateData();
      await cal.current.on("click", (_event: any, timestamp: string) => {
        const date = dayjs(timestamp);
        setSelectedDate(date.format("YYYY-MM-DD"));
        setPerformanceRecordingViewModalOpen(true);
      });

      const options = {
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
              colorScheme == "dark"
                ? ["#14432a", "#166b34", "#37a446", "#4dd05a"]
                : ["#14432a", "#166b34", "#37a446", "#4dd05a"].reverse(),
            domain: [1, 2, 5],
          },
        },
        domain: {
          type: "month",
          label: { format: "%Y-%m" },
        },
        theme: colorScheme ?? "red",
        subDomain: { type: "day", radius: 2 },
        animationDuration: 0,
      };
      await cal.current.paint(options, [
        [
          Tooltip,
          {
            // @ts-expect-error hihi library doesnt support types correctly
            text: function (date, value, dayjsDate) {
              const key = dayjsDate.format("YYYY-MM-DD");
              const values =
                key in dict
                  ? dict[key]
                  : {
                      countsPerMedal: {
                        [Medals.GOLD]: 0,
                        [Medals.SILVER]: 0,
                        [Medals.BRONZE]: 0,
                      },
                    };
              return (
                (!value
                  ? t("components.athleteActivityChart.tooltipText.noData")
                  : value +
                    t(
                      "components.athleteActivityChart.tooltipText.data." +
                        (value > 1 ? "plural" : "singular"),
                    )) +
                (values.countsPerMedal.GOLD > 0
                  ? "<br>Gold: " + values.countsPerMedal.GOLD
                  : "") +
                (values.countsPerMedal.SILVER > 0
                  ? "<br>Silver: " + values.countsPerMedal.SILVER
                  : "") +
                (values.countsPerMedal.BRONZE > 0
                  ? "<br>Bronze: " + values.countsPerMedal.BRONZE
                  : "") +
                "<br>" +
                t("generic.date.on") +
                " " +
                dayjsDate.format("LL")
              );
            },
          },
        ],
      ]);
      setLoading(false);
    };

    paint();
    return () => cal.current.destroy();
  }, [colorScheme, calculateData, i18n.language, t]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "105px",
          overflowX: "scroll",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton loading={loading} height={"105px"}></Skeleton>
        <Box
          id={"cal-heatmap"}
          sx={{
            height: "105px",
            overflowX: "scroll",
            overflowY: "hidden",
            width: "fit-content",
            display: loading ? "none" : "inherit",
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
