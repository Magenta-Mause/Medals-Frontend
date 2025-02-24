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
  const { t } = useTranslation();
  const formatValue = useCallback(
    (value: number, unit: string): string => {
      console.log(value);
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
      }
      return "";
    },
    [t],
  );

  return { formatValue };
};

export default useFormatting;
