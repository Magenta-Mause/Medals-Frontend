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
    },
    [t, formatNumber],
  );

  const formatLocalizedDate = useCallback(
    (
      dateInput: string | number | Date | null | undefined,
      fallback = "-",
    ): string => {
      if (!dateInput) return fallback;

      const parsedDate =
        typeof dateInput === "string" || typeof dateInput === "number"
          ? new Date(dateInput)
          : dateInput;

      if (isNaN(parsedDate.getTime())) return fallback;

      return new Intl.DateTimeFormat(i18n.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(parsedDate);
    },
    [i18n.language],
  );

  return { formatValue, formatLocalizedDate, formatNumber };
};

export default useFormatting;
