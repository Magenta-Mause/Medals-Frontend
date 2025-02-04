import { PasswordStrength } from "@hooks/usePasswordValidation";
import { Box } from "@mui/joy";

const passwordColors = {
  "0%": "red",
  "25%": "#FF0000",
  "50%": "#FF8000",
  "75%": "#80C000",
  "100%": "#80CC00",
};

const PasswordStrengthBar = (props: { passwordStrength: PasswordStrength }) => (
  <Box
    sx={(theme) => ({
      width: "calc(100% - 6px)",
      [theme.getColorSchemeSelector("dark")]: {
        background: "gray",
      },
      background: "lightgray",
      height: 5,
      m: "5px 3px",
      mt: "15px",
      borderRadius: "sm",
      zIndex: 0,
      position: "relative",
      "::after": {
        transition: "all ease 0.5s",
        backgroundColor: passwordColors[props.passwordStrength],
        zIndex: 1,
        position: "absolute",
        content: '""',
        width: props.passwordStrength,
        height: "100%",
        borderRadius: "sm",
      },
    })}
  ></Box>
);

export default PasswordStrengthBar;
