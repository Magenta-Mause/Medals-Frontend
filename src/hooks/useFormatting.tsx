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
  const formatValue = useCallback(
    (value: number, unit: string): string => {
      switch (unit) {
        case "seconds": {
          return (
            pad(Math.floor(value / 60), 2) +
            ":" +
            pad(value % 60, 2) +
            " " +
            t("units.minutes")
          );
        }
        case "meters": {
          return value + " " + t("units.meters");
        }
      }
      return "";
    },
    [t],
  );

  const formatDate = useCallback(
    (value: number): string => {
      return new Intl.DateTimeFormat(i18n.language).format(value);
    },
    [i18n.language],
  );

  return { formatValue, formatDate };
};

export default useFormatting;
