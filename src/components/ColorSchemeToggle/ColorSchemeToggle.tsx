import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, useColorScheme } from "@mui/joy";
import { useEffect, useState } from "react";

const ColorSchemeToggle = (props: IconButtonProps) => {
  const { onClick, sx, ...other } = props;
  const { mode, setMode } = useColorScheme();
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
    <IconButton
      data-screenshot="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
        onClick?.(event);
      }}
      sx={[
        mode === "dark"
          ? { "& > *:first-child": { display: "none" } }
          : { "& > *:first-child": { display: "initial" } },
        mode === "light"
          ? { "& > *:last-child": { display: "none" } }
          : { "& > *:last-child": { display: "initial" } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRounded />
      <LightModeRounded />
    </IconButton>
  );
};

export default ColorSchemeToggle;
