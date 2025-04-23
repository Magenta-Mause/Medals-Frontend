import { Medals } from "@customTypes/enums";

const TotalMedalIcon = (props: { medalType: Medals }) => {
  return <img src={`/medals/${props.medalType}.svg`} />;
};

export default TotalMedalIcon;
