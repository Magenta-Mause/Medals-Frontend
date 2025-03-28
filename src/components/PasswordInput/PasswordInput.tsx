import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, Input } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PasswordInput = (props: {
  onChange?: (value: string) => void;
  placeholder?: string;
  sx?: SxProps;
  disabled?: boolean;
}) => {
  const [hidden, setHidden] = useState(true);
  const { t } = useTranslation();
  return (
    <Input
      placeholder={props.placeholder ?? t("generic.password")}
      onChange={(e) => (props.onChange ? props.onChange(e.target.value) : null)}
      type={hidden ? "password" : "text"}
      name={"password"}
      disabled={props.disabled}
      endDecorator={
        <HoverTooltip text={t("components.tooltip.showPassword")}>
          <IconButton onClick={() => setHidden((current) => !current)}>
            {hidden ? (
              <Visibility fontSize="small" />
            ) : (
              <VisibilityOff fontSize="small" />
            )}
          </IconButton>
        </HoverTooltip>
      }
      sx={{ ...props.sx }}
    />
  );
};

export default PasswordInput;
