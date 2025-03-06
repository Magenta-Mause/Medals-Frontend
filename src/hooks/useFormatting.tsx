import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const pad = (num: number, size: number) => {
  let res = num.toString();
  while (res.length < size) {
    res = "0" + res;
  }
  return res;
};

const useFormatting = () => {
  const { t, i18n } = useTranslation();
  const formatNumber = useCallback(
    (value: number) => {
      return new Intl.NumberFormat(i18n.language).format(value);
    },
    [i18n.language],
  );
  const formatValue = useCallback(
    (value: number, unit: string): string => {
      switch (unit) {
        case "seconds": {
          return (
            pad(Math.floor(value / 60), 2) +
            ":" +
            pad(Math.floor(value % 60), 2) +
            " " +
            t("units.minutes")
          );
        }
        case "meters": {
          return formatNumber(value) + " " + t("units.meters");
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
