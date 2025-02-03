import { Box } from "@mui/joy";
import logo from "@assets/logo.svg";

const MedalsIcon = (props: { size: "inline" | "large" }) => {
  return (
    <Box
      fontSize={"1.2rem"}
      sx={{
        display: "flex",
        width: props.size == "inline" ? "1.2rem" : "auto",
        aspectRatio: 1,
        height: "auto",
      }}
    >
      <img
        src={logo}
        style={{ aspectRatio: 1, flexGrow: 1, width: "100%", height: "auto" }}
      />
    </Box>
  );
};

export default MedalsIcon;
