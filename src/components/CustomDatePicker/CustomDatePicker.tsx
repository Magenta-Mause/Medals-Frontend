import { useColorScheme } from "@mui/joy";
import { SxProps, Theme } from "@mui/material";
import {
  DatePicker,
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";

const CustomDatePicker = (props: {
  sx: SxProps<Theme>;
  value: any;
  error: boolean;
  onChange:
    | ((
        value: any,
        context: PickerChangeHandlerContext<DateValidationError>,
      ) => void)
    | undefined;
  format: string | undefined;
  disabled?: boolean;
}) => {
  const { mode } = useColorScheme();
  const styles: Record<"dark" | "light", SxProps<Theme> | undefined> = {
    dark: {
      backgroundColor: "none",
      color: "white",
    },
    light: { backgroundColor: "blue" },
  };

  return (
    <DatePicker
      disabled={props.disabled}
      sx={
        {
          ...props.sx,
          ...styles[(mode as "dark" | "light" | undefined) ?? "light"],
          backgroundColor: mode === "dark" ? "#0b0d0e" : "white",
        } as SxProps<Theme>
      }
      slotProps={{
        textField: {
          disabled: props.disabled,
          error: props.error,
          sx: {
            // shared height
            height: { sx: "3vh", md: "5vh", xs: "5vh" },
          },
          InputProps: {
            disabled: props.disabled,
            sx: {
              "> input": {
                color: props.disabled
                  ? "var(--variant-outlinedDisabledColor, var(--joy-palette-neutral-outlinedDisabledColor, var(--joy-palette-neutral-400, #9FA6AD))) !important"
                  : "var(--mui-palette-text-primary)",
                "-webkit-text-fill-color": props.disabled
                  ? "var(--variant-outlinedDisabledColor, var(--joy-palette-neutral-outlinedDisabledColor, var(--joy-palette-neutral-400, #9FA6AD))) !important"
                  : mode === "dark"
                    ? "white"
                    : "black",
                p: 0,
                pl: 1,
                fontSize: "var(--joy-fontSize-md, 1rem) !important",
              },
              "> fieldset": {
                display: "none",
              },
              height: { sx: "3vh", md: "5vh", xs: "5vh" },
              borderRadius: "7px",
              borderColor: props.disabled
                ? "var(--variant-outlinedDisabledBorder, var(--joy-palette-neutral-outlinedDisabledBorder, var(--joy-palette-neutral-200, #DDE7EE))) !important"
                : "var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1))) !important",
              border: "var(--variant-borderWidth) solid",
              color: props.disabled
                ? mode === "dark"
                  ? "#aaa"
                  : "neutral.100"
                : props.error
                  ? mode === "dark"
                    ? "#f7c5c5"
                    : "#c41c1c"
                  : mode === "dark"
                    ? "white"
                    : "#333333",
              fontSize: "large",
              "& .MuiOutlinedInput-root": {
                backgroundColor: mode === "dark" ? "#0b0d0e" : "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  mode === "dark" ? "rgb(61, 65, 68)" : "rgb(205, 215, 225)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "dark" ? "#bbb" : "rgb(205, 215, 225)",
              },
              "& .MuiSvgIcon-root": {
                color: mode === "dark" ? "rgb(61, 65, 68)" : "rgb(61, 65, 68)",
              },
              "& .css-ayg7vk-MuiFormControl-root-MuiTextField-root": {
                backgroundColor: mode === "dark" ? "rgb(61, 65, 68)" : "white",
              },
            },
          },
        },
        popper: {
          sx: {
            "& .MuiPaper-root": {
              backgroundColor: mode === "dark" ? "#222" : "#fff",
              color: mode === "dark" ? "#fff" : "#000",
            },
            ".css-1191e5t-MuiTypography-root-MuiDayCalendar-weekDayLabel": {
              color: mode === "dark" ? "white !important" : "#000",
            },
            ".css-8hoymy-MuiSvgIcon-root": {
              color: mode === "dark" ? "white !important" : "#000",
            },
            ".css-wnony7-MuiSvgIcon-root-MuiPickersCalendarHeader-switchViewIcon":
              {
                color: mode === "dark" ? "white !important" : "#000",
              },
          },
        },
      }}
      value={props.value}
      onChange={props.onChange}
      format={props.format}
      maxDate={dayjs()}
    />
  );
};

export default CustomDatePicker;
