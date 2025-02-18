import PasswordStrengthBar from "@components/PasswordStrengthBar/PasswordStrengthBar";
import usePasswordValidation, {
  PasswordStrengthChecks,
  requiredPasswordChecks,
} from "@hooks/usePasswordValidation";
import { Check, Close } from "@mui/icons-material";
import {
  Input,
  Typography,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Tooltip,
  FormLabel,
} from "@mui/joy";
import { t } from "i18next";
import { useEffect, useState } from "react";

const CreatePasswordComponent = (props: {
  isPending: boolean;
  isSuccess: boolean;
  setPasswordValid: (valid: boolean) => void;
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const { checks, strength, valid } = usePasswordValidation(currentPassword);

  useEffect(() => {
    props.setPasswordValid(valid);
  }, [props, valid]);

  return (
    <>
      <FormLabel>Password</FormLabel>
      <Input
        type="password"
        name="password"
        disabled={props.isPending || props.isSuccess}
        onChange={(event) => setCurrentPassword(event.target.value)}
      />
      <PasswordStrengthBar passwordStrength={strength} />
      <Typography level="body-sm" textAlign={"left"}>
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
      </Typography>
      <Typography level="body-xs" color="neutral">
        * Constraint is required
      </Typography>
    </>
  );
};

export default CreatePasswordComponent;
