import { Athlete } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import GenericModal from "../GenericModal";
import { emailRegex } from "constants/regex";
import { Genders } from "@customTypes/enums";
import InfoTooltip from "@components/InfoTooltip/InfoTooltip";
import { useSnackbar } from "notistack";

const isValidEmail = (email: string) => emailRegex.test(email);

// Default date format based on locale
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
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  athleteToEdit?: Athlete;
  updateAthlete?: (athlete: Athlete) => Promise<boolean>;
}

const AthleteCreationForm = ({
  isOpen,
  setOpen,
  athleteToEdit,
  updateAthlete,
}: AthleteCreationFormProps) => {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { createAthlete, updateAthlete: apiUpdateAthlete } = useApi();
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

  const isEditMode = !!athleteToEdit;

  const validateField = useCallback(
    (field: keyof FormErrors, value: any): string => {
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
          if (!isEditMode) {
            if (!value) return t("generic.validation.required");
            if (!isValidEmail(value))
              return t("generic.validation.invalidEmail");
          }
          return "";
        case "birthdate":
          if (!isEditMode && !value) return t("generic.validation.required");
          return "";
        case "gender":
          if (!isEditMode && value === undefined)
            return t("generic.validation.required");
          return "";
        default:
          return "";
      }
    },
    [t, isEditMode],
  );

  const resetForm = useCallback(() => {
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
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (!isEditMode) {
      resetForm();
    }
  }, [setOpen, resetForm, isEditMode]);

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      resetForm();
    }
  }, [isOpen, resetForm, isEditMode]);

  useEffect(() => {
    if (athleteToEdit) {
      setAthlete(athleteToEdit);
      // Mark relevant fields as touched in edit mode
      setTouched({
        first_name: true,
        last_name: true,
        email: true,
        birthdate: true,
        gender: true,
      });
      // Validate the initial values
      setErrors({
        first_name: validateField("first_name", athleteToEdit.first_name),
        last_name: validateField("last_name", athleteToEdit.last_name),
        email: "", // Email is not editable in edit mode
        birthdate: "", // Not editable in edit mode
        gender: "", // Not editable in edit mode
      });
    } else if (isOpen) {
      resetForm();
    }
  }, [athleteToEdit, validateField, resetForm, isOpen]);

  const dateFormat = getDateFormatForLocale(i18n.language);

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
      const isoDate = dayjs(date).format("YYYY-MM-DD");
      handleFieldChange("birthdate", isoDate);
    } else {
      handleFieldChange("birthdate", "");
    }
  };

  const isFormValid = () => {
    if (isEditMode) {
      return !errors.first_name && !errors.last_name;
    }

    return (
      Object.values(errors).every((error) => !error) &&
      Object.keys(errors).every((field) => touched[field as keyof FormTouched])
    );
  };

  const handleSubmitAttempt = () => {
    const fieldsToTouch = isEditMode
      ? {
          first_name: true,
          last_name: true,
          email: touched.email,
          birthdate: touched.birthdate,
          gender: touched.gender,
        }
      : {
          first_name: true,
          last_name: true,
          email: true,
          birthdate: true,
          gender: true,
        };

    setTouched((prev) => ({
      ...prev,
      ...fieldsToTouch,
    }));

    const newErrors: FormErrors = {
      first_name: validateField("first_name", athlete.first_name),
      last_name: validateField("last_name", athlete.last_name),
      email: isEditMode ? "" : validateField("email", athlete.email),
      birthdate: isEditMode
        ? ""
        : validateField("birthdate", athlete.birthdate),
      gender: isEditMode ? "" : validateField("gender", athlete.gender),
    };

    setErrors(newErrors);

    return isFormValid();
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

  const handleFormSubmit = async () => {
    if (handleSubmitAttempt()) {
      try {
        if (isEditMode) {
          const updateFn = updateAthlete || apiUpdateAthlete;
          if (updateFn) {
            await updateFn(athlete);
            enqueueSnackbar(t("snackbar.update.success"), {
              variant: "success",
            });
          }
        } else {
          await createAthlete(athlete);
          enqueueSnackbar(t("snackbar.invite.success"), {
            variant: "success",
          });
        }
        setOpen(false);
        resetForm();
      } catch (error: any) {
        const serverMessage = error?.response?.data?.data;
        if (
          serverMessage ===
          "An athlete with the same email and birthdate already exists."
        ) {
          setErrors((prev) => ({
            ...prev,
            email: t("backendErrors.athleteAlreadyExists"),
            birthdate: t("backendErrors.athleteAlreadyExists"),
          }));
          setTouched((prev) => ({
            ...prev,
            email: true,
            birthdate: true,
          }));
        } else {
          enqueueSnackbar(t("generic.errors.unknownError"), {
            variant: "error",
          });
          console.error("Unhandled form submission error:", error);
        }
      }
    }
  };

  return (
    <GenericModal
      header={
        isEditMode
          ? t("pages.athleteEditPage.editHeader")
          : t("pages.athleteCreationPage.createHeader")
      }
      open={isOpen}
      setOpen={(open) => {
        if (!open) {
          handleClose();
        } else {
          setOpen(open);
        }
      }}
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "100%", md: "30vw" },
          p: 2,
        }}
      >
        <FormControl error={touched.first_name && !!errors.first_name}>
          <FormLabel>{t("pages.athleteCreationPage.firstName")}</FormLabel>
          <Input
            placeholder={t("pages.athleteCreationPage.firstName")}
            size="md"
            variant="outlined"
            value={athlete.first_name}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            onBlur={() => markTouched("first_name")}
          />
          {touched.first_name && errors.first_name && (
            <FormHelperText>{errors.first_name}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.last_name && !!errors.last_name}>
          <FormLabel>{t("pages.athleteCreationPage.lastName")}</FormLabel>
          <Input
            placeholder={t("pages.athleteCreationPage.lastName")}
            size="md"
            variant="outlined"
            value={athlete.last_name}
            onChange={(e) => handleFieldChange("last_name", e.target.value)}
            onBlur={() => markTouched("last_name")}
          />
          {touched.last_name && errors.last_name && (
            <FormHelperText>{errors.last_name}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.email && !!errors.email}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <FormLabel>{t("pages.athleteCreationPage.email")}</FormLabel>
            {isEditMode && (
              <InfoTooltip
                text={t("components.tooltip.emailNotEditable")}
                position="right"
              />
            )}
          </Box>
          <Input
            placeholder={t("pages.athleteCreationPage.email")}
            size="md"
            variant="outlined"
            value={athlete.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => markTouched("email")}
            disabled={isEditMode}
            sx={
              isEditMode
                ? {
                    opacity: 0.7,
                    backgroundColor: "neutral.100",
                  }
                : {}
            }
          />
          {touched.email && errors.email && (
            <FormHelperText>{errors.email}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.birthdate && !!errors.birthdate}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <FormLabel>{t("pages.athleteCreationPage.birthdate")}</FormLabel>
            {isEditMode && (
              <InfoTooltip
                text={t("components.tooltip.birthdateNotEditable")}
                position="right"
              />
            )}
          </Box>
          <CustomDatePicker
            sx={{
              width: "100%",
              ...(isEditMode
                ? { opacity: 0.7, backgroundColor: "neutral.100" }
                : {}),
            }}
            value={getDatePickerValue()}
            onChange={!isEditMode ? handleDateChange : undefined}
            format={dateFormat}
            error={touched.birthdate && !!errors.birthdate}
            disabled={isEditMode}
          />
          {touched.birthdate && errors.birthdate && (
            <FormHelperText>{errors.birthdate}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.gender && !!errors.gender}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <FormLabel>{t("pages.athleteCreationPage.gender")}</FormLabel>
            {isEditMode && (
              <InfoTooltip
                text={t("components.tooltip.genderNotEditable")}
                position="right"
              />
            )}
          </Box>
          <Select
            placeholder={t("pages.athleteCreationPage.gender")}
            value={athlete.gender}
            onChange={
              !isEditMode
                ? (_, newValue) => handleFieldChange("gender", newValue)
                : undefined
            }
            onBlur={() => {
              const value = athlete.gender;
              markTouched("gender");
              setErrors((prev) => ({
                ...prev,
                gender: validateField("gender", value),
              }));
            }}
            disabled={isEditMode}
            sx={
              isEditMode
                ? {
                    opacity: 0.7,
                    backgroundColor: "neutral.100",
                  }
                : {}
            }
          >
            <Option value={Genders.FEMALE}>{t("genders.FEMALE")}</Option>
            <Option value={Genders.MALE}>{t("genders.MALE")}</Option>
            <Option value={Genders.DIVERSE}>{t("genders.DIVERSE")}</Option>
          </Select>
          {touched.gender && errors.gender && (
            <FormHelperText>{errors.gender}</FormHelperText>
          )}
        </FormControl>

        <Button
          fullWidth
          size="md"
          disabled={!isFormValid()}
          sx={{
            mt: 2,
          }}
          onClick={handleFormSubmit}
        >
          {isEditMode
            ? t("pages.athleteEditPage.updateButton")
            : t("pages.athleteCreationPage.createButton")}
        </Button>
      </Box>
    </GenericModal>
  );
};

export default AthleteCreationForm;
