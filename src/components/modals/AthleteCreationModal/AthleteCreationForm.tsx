import { Athlete } from "@customTypes/backendTypes";
import { Box, Button, FormLabel, Input } from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import { emailRegex } from "@components/Regex/Regex";
import { Genders } from "@customTypes/enums";
import dayjs, { Dayjs } from "dayjs";

const isValidEmail = (email: string) => emailRegex.test(email);

const getDateFormatForLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    en: "MM/DD/YYYY",
    de: "DD.MM.YYYY",
    fr: "DD/MM/YYYY",
    nl: "DD-MM-YYYY",
    es: "DD/MM/YYYY",
  };
  return localeMap[locale.split("-")[0]] || "DD/MM/YYYY";
};

interface FormTouched {
  first_name: boolean;
  last_name: boolean;
  email: boolean;
  birthdate: boolean;
  gender: boolean;
}

interface FormErrors {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  gender: string;
}

interface AthleteCreationFormProps {
  submitCallback: (data: Athlete) => void;
  isPending: boolean;
}

const AthleteCreationForm = (props: AthleteCreationFormProps) => {
  const { t, i18n } = useTranslation();
  const [athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: undefined,
  });

  const [touched, setTouched] = useState<FormTouched>({
    first_name: false,
    last_name: false,
    email: false,
    birthdate: false,
    gender: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  const dateFormat = getDateFormatForLocale(i18n.language);

  const validateField = (field: keyof FormErrors, value: any): string => {
    switch (field) {
      case "first_name":
        if (!value) return t("generic.validation.required");
        if (value.length > 255) return t("generic.validation.tooLong");
        return "";
      case "last_name":
        if (!value) return t("generic.validation.required");
        if (value.length > 255) return t("generic.validation.tooLong");
        return "";
      case "email":
        if (!value) return t("generic.validation.required");
        if (!isValidEmail(value)) return t("generic.validation.invalidEmail");
        return "";
      case "birthdate":
        if (!value) return t("generic.validation.required");
        return "";
      case "gender":
        if (value === undefined) return t("generic.validation.required");
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (field: keyof Athlete, value: any) => {
    setAthlete((prev) => ({ ...prev, [field]: value }));

    if (!touched[field as keyof FormTouched]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }

    const error = validateField(field as keyof FormErrors, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleDateChange = (date: Date | null) => {
    if (!touched.birthdate) {
      setTouched((prev) => ({ ...prev, birthdate: true }));
    }

    if (date) {
      const localDate = new Date(date);
      const adjustedDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );
      handleFieldChange("birthdate", adjustedDate.toISOString());
    } else {
      handleFieldChange("birthdate", "");
    }
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.keys(errors).every((field) => touched[field as keyof FormTouched])
    );
  };

  const handleSubmitAttempt = () => {
    const allTouched: FormTouched = {
      first_name: true,
      last_name: true,
      email: true,
      birthdate: true,
      gender: true,
    };
    setTouched(allTouched);

    const newErrors: FormErrors = {
      first_name: validateField("first_name", athlete.first_name),
      last_name: validateField("last_name", athlete.last_name),
      email: validateField("email", athlete.email),
      birthdate: validateField("birthdate", athlete.birthdate),
      gender: validateField("gender", athlete.gender),
    };
    setErrors(newErrors);

    return isFormValid();
  };

  // Reset form to its initial state
  const resetForm = () => {
    setAthlete({
      first_name: "",
      last_name: "",
      email: "",
      gender: undefined,
      birthdate: "",
    });
    setTouched({
      first_name: false,
      last_name: false,
      email: false,
      birthdate: false,
      gender: false,
    });
    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      birthdate: "",
      gender: "",
    });
  };

  const getDatePickerValue = (): Dayjs | null => {
    if (!athlete.birthdate) return null;
    try {
      return dayjs(athlete.birthdate);
    } catch (e) {
      console.error("Invalid date format:", athlete.birthdate, e);
      return null;
    }
  };

  useEffect(() => {
    resetForm();
  }, []);

  const inputValid = {
    first_name: touched.first_name && !errors.first_name,
    last_name: touched.last_name && !errors.last_name,
    email: touched.email && !errors.email,
    birthdate: touched.birthdate && !errors.birthdate,
    gender: touched.gender && !errors.gender,
  };

  function handleChangeGender(
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: string | null
  ): void {
    if (value) {
      handleFieldChange("gender", value);
    }
  }

  const isAccepted = () => isFormValid();

  const handleSubmit = () => {
    if (handleSubmitAttempt()) {
      props.submitCallback(athlete);
      resetForm();
    }
  };

  return (
    <>
      <FormLabel>{t("pages.athleteCreationPage.firstName")}</FormLabel>
      <Input
        sx={{
          width: { sx: "40vw", md: "30vw" },
          marginBottom: "2vh",
          height: { sx: "3vh", md: "5vh", xs: "5vh" },
        }}
        placeholder={t("pages.athleteCreationPage.firstName")}
        size="lg"
        variant="outlined"
        value={athlete.first_name}
        onChange={(e) =>
          setAthlete((prevUser: Athlete) => ({
            ...prevUser,
            first_name: e.target.value,
          }))
        }
        error={!inputValid.first_name}
      />
      <FormLabel>{t("pages.athleteCreationPage.lastName")}</FormLabel>
      <Input
        sx={{
          width: { sx: "60vw", md: "30vw" },
          marginBottom: "2vh",
          height: { sx: "3vh", md: "5vh", xs: "5vh" },
        }}
        placeholder={t("pages.athleteCreationPage.lastName")}
        size="lg"
        error={!inputValid.last_name}
        variant="outlined"
        value={athlete.last_name}
        onChange={(e) =>
          setAthlete((prevUser: Athlete) => ({
            ...prevUser,
            last_name: e.target.value,
          }))
        }
      />
      <FormLabel>{t("pages.athleteCreationPage.email")}</FormLabel>
      <Input
        sx={{
          width: { sx: "60vw", md: "30vw" },
          marginBottom: "2vh",
          height: { sx: "3vh", md: "5vh", xs: "5vh" },
        }}
        placeholder={t("pages.athleteCreationPage.email")}
        size="lg"
        variant="outlined"
        value={athlete.email}
        onChange={(e) =>
          setAthlete((prevUser: Athlete) => ({
            ...prevUser,
            email: e.target.value,
          }))
        }
        error={!inputValid.email}
      />
      <FormLabel>{t("pages.athleteCreationPage.birthdate")}</FormLabel>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        <CustomDatePicker
          error={!inputValid.birthdate}
          sx={{
            width: { sx: "60vw", md: "30vw" },
            marginBottom: "1vh",
            position: "relative",
          }}
          value={getDatePickerValue()}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
        />
      </Box>
      <Box sx={{ marginTop: "2vh" }}>
        <FormLabel>{t("pages.athleteCreationPage.gender")}</FormLabel>
        <Select
          placeholder={t("pages.athleteCreationPage.gender")}
          sx={{ height: { sx: "3vh", md: "5vh" }, width: { md: "30vw" } }}
          onChange={handleChangeGender}
          color={inputValid.gender ? "neutral" : "danger"}
          value={athlete.gender || ""}
        >
          <Option value={Genders.FEMALE}>{t("genders.FEMALE")}</Option>
          <Option value={Genders.MALE}>{t("genders.MALE")}</Option>
          <Option value={Genders.DIVERSE}>{t("genders.DIVERSE")}</Option>
        </Select>
      </Box>
      <Button
        fullWidth
        disabled={!isAccepted() || props.isPending}
        sx={{
          marginTop: "5vh",
          marginBottom: "2vh",
          color: "primary",
          width: { md: "30vw" },
        }}
        onClick={handleSubmit}
      >
        {t("pages.athleteCreationPage.createButton")}
      </Button>
    </>
  );
};

export default AthleteCreationForm;
