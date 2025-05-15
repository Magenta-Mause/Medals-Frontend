import { Button, Card, ColorPaletteProp, Typography } from "@mui/joy";

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
      sx={{ boxShadow: "none", display: "flex", gap: "10px" }}
    >
      <Typography level="title-sm">{props.header}</Typography>
      <Typography level="body-xs">{props.text}</Typography>
      {props.buttonText ? (
        <Button size="sm" onClick={props.buttonCallback}>
          {props.buttonText}
        </Button>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default InfoCard;
