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
        } as SxProps<Theme>
      }
      slotProps={{
        textField: {
          InputProps: {
            sx: {
              backgroundColor: mode === "dark" ? "#333" : "#fff",
              color: mode === "dark" ? "#fff" : "#000",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "dark" ? "#777" : "rgb(205, 215, 225)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "dark" ? "#bbb" : "rgb(205, 215, 225)",
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
