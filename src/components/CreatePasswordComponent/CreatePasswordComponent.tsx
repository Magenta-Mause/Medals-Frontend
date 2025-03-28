import HoverTooltip from "@components/HoverTooltip/HoverTooltip";
import PasswordInput from "@components/PasswordInput/PasswordInput";
import PasswordStrengthBar from "@components/PasswordStrengthBar/PasswordStrengthBar";
import usePasswordValidation, {
  PasswordStrengthChecks,
  requiredPasswordChecks,
} from "@hooks/usePasswordValidation";
import { Check, Close } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CreatePasswordComponent = (props: {
  isPending: boolean;
  isSuccess: boolean;
  setPasswordValid: (valid: boolean) => void;
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const { checks, strength, valid } = usePasswordValidation(currentPassword);
  const { t } = useTranslation();

  useEffect(() => {
    props.setPasswordValid(valid);
  }, [valid, props]);

  return (
    <>
      <FormControl>
        <FormLabel>
          {t("components.passwordStrengthIndicator.password")}
        </FormLabel>
        <PasswordInput
          onChange={setCurrentPassword}
          disabled={props.isPending || props.isSuccess}
        />
      </FormControl>
      <PasswordStrengthBar passwordStrength={strength} />
      <List>
        {Object.keys(checks).map((key) => (
          <ListItem key={key}>
            <ListItemDecorator>
              {checks[key as PasswordStrengthChecks] ? (
                <Check
                  sx={{
                    fill: "green",
                  }}
                />
              ) : (
                <Close />
              )}
            </ListItemDecorator>
            <ListItemContent sx={{ display: "flex" }}>
              <Typography level="body-sm">
                {t("components.passwordStrengthIndicator." + key)}
              </Typography>

              {requiredPasswordChecks[key as PasswordStrengthChecks] ? (
                <HoverTooltip
                  text={t("components.passwordStrengthIndicator.fieldRequired")}
                >
                  <Typography
                    level="body-sm"
                    sx={{ ml: "2px", userSelect: "none" }}
                  >
                    *
                  </Typography>
                </HoverTooltip>
              ) : (
                <></>
              )}
            </ListItemContent>
          </ListItem>
        ))}
      </List>
      <Typography level="body-xs" color="neutral" sx={{ userSelect: "none" }}>
        * {t("components.passwordStrengthIndicator.fieldRequired")}
      </Typography>
    </>
  );
};

export default CreatePasswordComponent;
