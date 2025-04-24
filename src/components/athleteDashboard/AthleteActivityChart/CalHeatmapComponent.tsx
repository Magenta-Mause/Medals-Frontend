import { Box, BoxProps, Skeleton } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
// @ts-expect-error cal-heatmap weird exports
import CalHeatmap from "cal-heatmap";

import "cal-heatmap/cal-heatmap.css";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const CalHeatmapComponent = (props: {
  heatmapOptions: any;
  heatmapPlugins: any[];
  onclick: (date: string) => void;
  sx: BoxProps["sx"];
  height: string;
  setLoading?: (loading: boolean) => void;
}) => {
  const renderTimeout = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const calInstanceRef = useRef<CalHeatmap | null>(null);
  const options = props.heatmapOptions;
  const propsSetLoading = props.setLoading ?? undefined;
  const plugins = props.heatmapPlugins;
  const { enqueueSnackbar } = useSnackbar();
  const onclick = props.onclick;
  const { t } = useTranslation();

  useEffect(() => {
    if (renderTimeout.current) clearTimeout(renderTimeout.current);
    if (propsSetLoading) propsSetLoading(true);
    setLoading(true);
    // timeout is used as a debounce to not interfere with the rendering of the cal-heatmap chart
    renderTimeout.current = setTimeout(async () => {
      if (calInstanceRef.current) {
        calInstanceRef.current.destroy();
      }

      const cal = new CalHeatmap();
      calInstanceRef.current = cal;
      cal.on("click", (_event: any, timestamp: string) => {
        onclick(dayjs(timestamp).format("YYYY-MM-DD"));
      });
      try {
        await cal.paint(options, plugins);
        if (propsSetLoading) propsSetLoading(false);
        setLoading(false);
      } catch (error) {
        // this mainly catches network errors which can occur when selecting a different language then english
        enqueueSnackbar(t("components.calHeatmap.loadingError"), {
          variant: "error",
        });
        console.error("Paint error:", error);
      }
    }, 500);
  }, [propsSetLoading, options, plugins, onclick, enqueueSnackbar, t]);

  return (
    <>
      <Box
        id={"cal-heatmap"}
        sx={{ display: loading ? "none" : "inherit", ...props.sx }}
      ></Box>
      <Skeleton
        sx={{ width: "100%", height: "105px" }}
        height={props.height}
        loading={loading}
      />
    </>
  );
};

export default CalHeatmapComponent;
