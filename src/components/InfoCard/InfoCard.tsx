import { CloseRounded } from "@mui/icons-material";
import {
  Card,
  Stack,
  Typography,
  IconButton,
  LinearProgress,
  Button,
  ColorPaletteProp,
} from "@mui/joy";

interface InfoCardProps {
  header: string;
  text: string;
  type: ColorPaletteProp;
  percentage?: number;
  buttonText?: string;
  buttonCallback: () => void;
}

const InfoCard = (props: InfoCardProps) => {
  return (
    <Card
      invertedColors
      variant="soft"
      color={props.type}
      size="sm"
      sx={{ boxShadow: "none" }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography level="title-sm">{props.header}</Typography>
        <IconButton size="sm">
          <CloseRounded />
        </IconButton>
      </Stack>
      <Typography level="body-xs">{props.text}</Typography>
      <LinearProgress
        variant="outlined"
        value={80}
        determinate
        sx={{ my: 1 }}
      />
      {props.buttonText ? (
        <Button size="sm" variant="solid" onClick={props.buttonCallback}>
          {props.buttonText}
        </Button>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default InfoCard;
