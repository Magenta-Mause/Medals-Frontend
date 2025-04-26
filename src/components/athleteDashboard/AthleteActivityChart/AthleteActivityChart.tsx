import React, { useCallback, useLayoutEffect, useState } from "react";
import dayjs from "dayjs";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import { PerformanceRecording } from "@customTypes/backendTypes";
import { Box, useColorScheme } from "@mui/joy";
import "./AthleteActivityChart.css";
import { useTranslation } from "react-i18next";
import PerformanceRecordingViewModal from "@components/modals/PerformanceRecordingViewModal/PerformanceRecordingViewModal";
import { Medals } from "@customTypes/enums";
import { calculatePerformanceRecordingMedal } from "@utils/calculationUtil";
import CalHeatmapComponent from "@components/athleteDashboard/AthleteActivityChart/CalHeatmapComponent";

const AthleteActivityChart = (props: {
  performanceRecordings: PerformanceRecording[];
}) => {
  const { colorScheme } = useColorScheme();
  const [calData, setCalData] = useState<{
    options: any;
    plugins: any[];
    clickListener: (date: string) => void;
  } | null>(null);
  const { t, i18n } = useTranslation();
  const [
    performanceRecordingViewModalOpen,
    setPerformanceRecordingViewModalOpen,
  ] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    const { list: data, dict } = calculateData();

    const clickListener = (date: string) => {
      setSelectedDate(date);
      setPerformanceRecordingViewModalOpen(true);
    };

    const options = {
      data: {
        source: data,
        x: "date",
        y: "value",
      },
      date: {
        start: new Date(dayjs().year() + "-01-01"),
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

    const plugins = [
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
              (value > 1
                ? "<br>" +
                  Object.keys(values.countsPerMedal)
                    .map((medal) => {
                      const value =
                        values.countsPerMedal[
                          medal as Medals.GOLD | Medals.SILVER | Medals.BRONZE
                        ];
                      if (medal == Medals.NONE) {
                        return undefined;
                      }
                      return value == 0
                        ? ""
                        : t("medals." + medal) + ": " + value;
                    })
                    .filter((i) => i != undefined && i != "")
                    .join("<br>") +
                  "<br>"
                : "") +
              t("generic.date.on") +
              " " +
              dayjsDate.format("LL")
            );
          },
        },
      ],
    ];

    setCalData({
      plugins,
      clickListener,
      options,
    });
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
        {calData ? (
          <CalHeatmapComponent
            heatmapOptions={calData.options}
            heatmapPlugins={calData.plugins}
            onclick={calData.clickListener}
            height={"105px"}
            sx={{
              height: "105px",
              overflowX: "scroll",
              overflowY: "hidden",
              width: "fit-content",
            }}
          />
        ) : (
          <></>
        )}
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
