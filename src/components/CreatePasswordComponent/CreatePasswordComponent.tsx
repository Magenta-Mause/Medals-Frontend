import PasswordStrengthBar from "@components/PasswordStrengthBar/PasswordStrengthBar";
import usePasswordValidation, {
  PasswordStrengthChecks,
  requiredPasswordChecks,
} from "@hooks/usePasswordValidation";
import { Check, Close } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Tooltip,
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
    console.log("validating")
    props.setPasswordValid(valid);
  }, [valid]);

  return (
    <>
      <FormControl>
        <FormLabel>
          {t("components.passwordStrengthIndicator.password")}
        </FormLabel>
        <Input
          type="password"
          name="password"
          disabled={props.isPending || props.isSuccess}
          onChange={(event) => setCurrentPassword(event.target.value)}
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
              <Tooltip
                title={t("components.passwordStrengthIndicator.required")}
                sx={{
                  userSelect: "none",
                }}
              >
                <Typography level="body-sm">
                  {requiredPasswordChecks[key as PasswordStrengthChecks]
                    ? "*"
                    : ""}
                </Typography>
              </Tooltip>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
      <Typography level="body-xs" color="neutral">
        * Constraint is required
      </Typography>
    </>
  );
};

export default CreatePasswordComponent;
