import { useColorScheme } from "@mui/joy";
import { InputAdornment, SxProps, Theme } from "@mui/material";
import {
  DatePicker,
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

const CustomDatePicker = (
  props: {
    sx: SxProps<Theme>;
    value: any;
    onChange:
      | ((
          value: any,
          context: PickerChangeHandlerContext<DateValidationError>,
        ) => void)
      | undefined;
    format: string | undefined;
    valid: boolean;
  },
  valid: boolean,
) => {
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
          sx: {
            height: { sx: "3vh", md: "5vh", xs: "5vh" },
          },
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                {valid ? (
                  <DoneIcon sx={{ color: "green" }} />
                ) : (
                  <ClearIcon sx={{ color: "red" }} />
                )}
              </InputAdornment>
            ),
            sx: {
              height: { sx: "3vh", md: "5vh", xs: "5vh" },
              width: {
                xs: "70vw",
                sm: "35vw",
                md: "30vw",
                lg: "30vw",
                xl: "30vw",
              },
              borderRadius: "7px",
              backgroundColor: mode === "dark" ? "#0b0d0e" : "white",
              color: mode === "dark" ? "white" : "black",
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
