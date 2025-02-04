import { useEffect, useState } from "react";

export enum PasswordStrength {
  "0%" = "0%",
  "25%" = "25%",
  "50%" = "50%",
  "75%" = "75%",
  "100%" = "100%",
}

export enum PasswordStrengthChecks {
  is8Characters = "is8Characters",
  hasNumber = "hasNumber",
  hasUpperCase = "hasUpperCase",
  hasSpecial = "hasSpecial",
}

const requiredPasswordChecks = {
  [PasswordStrengthChecks.is8Characters]: true,
  [PasswordStrengthChecks.hasNumber]: false,
  [PasswordStrengthChecks.hasUpperCase]: false,
  [PasswordStrengthChecks.hasSpecial]: false,
};

const usePasswordValidation = (password: string) => {
  const validatePassword = (
    password: string,
  ): {
    valid: boolean;
    strength: PasswordStrength;
    checks: {
      [PasswordStrengthChecks.is8Characters]: boolean;
      [PasswordStrengthChecks.hasNumber]: boolean;
      [PasswordStrengthChecks.hasUpperCase]: boolean;
      [PasswordStrengthChecks.hasSpecial]: boolean;
    };
  } => {
    const checks = {
      is8Characters: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/.test(password),
    };

    return {
      valid: checks["is8Characters"],
      strength: (Object.values(checks).filter((check) => check).length * 25 +
        "%") as PasswordStrength,
      checks: checks,
    };
  };

  const [currentState, setCurrentState] = useState(validatePassword(password));
  useEffect(() => {
    setCurrentState(validatePassword(password));
  }, [password]);

  return currentState;
};

export { requiredPasswordChecks };
export default usePasswordValidation;
