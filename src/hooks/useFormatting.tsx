import { MetricUnits } from "@customTypes/enums";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const pad = (num: number, size: number) => num.toString().padStart(size, "0");

const useFormatting = () => {
  const { t, i18n } = useTranslation();
  const formatNumber = useCallback(
    (value: number) => {
      return new Intl.NumberFormat(i18n.language).format(value);
    },
    [i18n.language],
  );
  const formatValue = useCallback(
    (value: number, unit: MetricUnits): string => {
      switch (unit) {
        case MetricUnits.SECONDS: {
          return (
            pad(Math.floor(value / 60), 2) +
            ":" +
            pad(Math.floor(value % 60), 2) +
            " " +
            t("units.MINUTES")
          );
        }
        case MetricUnits.METERS: {
          return formatNumber(value) + " " + t("units.METERS");
        }
        case MetricUnits.POINTS: {
          return formatNumber(value) + " " + t("units.POINTS");
        }
        default: {
          return formatNumber(value);
        }
      }
      return "";
    },
    [t, formatNumber],
  );

  const formatDate = useCallback(
    (value: number): string => {
      return new Intl.DateTimeFormat(i18n.language).format(value);
    },
    [i18n.language],
  );

  return { formatValue, formatDate, formatNumber };
};

export default useFormatting;
