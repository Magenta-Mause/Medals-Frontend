import { useColorScheme } from "@mui/joy";
import { SxProps, Theme } from "@mui/material";
import {
  DatePicker,
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";

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
      sx={
        {
          ...props.sx,
          ...styles[(mode as "dark" | "light" | undefined) ?? "light"],
          backgroundColor: mode === "dark" ? "#0b0d0e" : "white",
        } as SxProps<Theme>
      }
      slotProps={{
        day: {
          sx: {
            color: mode === "dark" ? "white" : "black",
          },
        },
        textField: {
          error: props.error,
          sx: {
            height: { sx: "3vh", md: "5vh", xs: "5vh" },
          },
          InputProps: {
            sx: {
              height: { sx: "3vh", md: "5vh", xs: "5vh" },
              borderRadius: "7px",
              backgroundColor: mode === "dark" ? "#0b0d0e" : "white",
              color: props.error
                ? "#f7c5c5"
                : mode === "dark"
                  ? "white"
                  : "black",
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
    />
  );
};

export default CustomDatePicker;
