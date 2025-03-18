import Tooltip from "@components/Tooltip/Tooltip";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, useColorScheme } from "@mui/joy";
import { useColorScheme as useMuiColorScheme } from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";

const ColorSchemeToggle = (props: IconButtonProps) => {
  const { onClick, sx, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const { setMode: setMUIMode } = useMuiColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        {...other}
        sx={sx}
        disabled
      />
    );
  }
  return (
    <Tooltip text={t("components.tooltip.colorSchemeToggle")} position="right">
    <IconButton
      data-screenshot="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
          setMUIMode("dark");
        } else {
          setMode("light");
          setMUIMode("light");
        }
        onClick?.(event);
      }}
      sx={[
        mode === "dark"
          ? { "& > *:first-of-type": { display: "none" } }
          : { "& > *:first-of-type": { display: "initial" } },
        mode === "light"
          ? { "& > *:last-of-type": { display: "none" } }
          : { "& > *:last-of-type": { display: "initial" } },
        { aspectRatio: 1, height: 35 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRounded />
      <LightModeRounded />
    </IconButton>
    </Tooltip>
    
  );
};

export default ColorSchemeToggle;
