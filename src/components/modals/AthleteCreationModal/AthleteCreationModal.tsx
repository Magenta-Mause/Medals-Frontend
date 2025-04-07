import { Athlete } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Box, Button, FormLabel, Input } from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import GenericModal from "../GenericModal";
import { emailRegex } from "@components/Regex/Regex";
import { Genders } from "@customTypes/enums";

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

interface AthleteCreateModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCreationForm = (props: AthleteCreateModalProps) => {
  const { t, i18n } = useTranslation();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { createAthlete } = useApi();
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
      const isoDate = date.toISOString();
      handleFieldChange("birthdate", isoDate);
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

  const markTouched = (field: keyof FormTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
    if (!isPopupOpen) {
      resetForm();
    }
  }, [isPopupOpen]);

  return (
    <>
      <GenericModal
        header={t("pages.athleteOverviewPage.createButton")}
        open={props.isOpen}
        setOpen={props.setOpen}
        modalDialogSX={{ minWidth: "30%" }}
        modalSX={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
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
            value={null}
            onChange={(newDate) => {
              const localDate = new Date(newDate);
              const adjustedDate: any = new Date(
                localDate.getTime() - localDate.getTimezoneOffset() * 60000,
              );
              setAthlete((prevUser: Athlete) => ({
                ...prevUser,
                birthdate: adjustedDate,
              }));
            }}
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
          >
            <Option value={Genders.FEMALE}>{t("genders.FEMALE")}</Option>
            <Option value={Genders.MALE}>{t("genders.MALE")}</Option>
            <Option value={Genders.DIVERSE}>{t("genders.DIVERSE")}</Option>
          </Select>
        </Box>
        <Button
          fullWidth
          disabled={!isAccepted()}
          sx={{
            marginTop: "5vh",
            marginBottom: "2vh",
            color: "primary",
            width: { md: "30vw" },
          }}
          onClick={() => {
            {
              createAthlete(athlete);
              props.setOpen(false);
              setAthlete({
                first_name: "",
                last_name: "",
                email: "",
                gender: undefined,
                birthdate: "",
              });
            }
          }}
        >
          {t("pages.athleteCreationPage.createButton")}
        </Button>
      </GenericModal>
    </>
  );
};

export default AthleteCreationForm;
