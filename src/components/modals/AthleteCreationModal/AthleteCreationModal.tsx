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
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import GenericModal from "../GenericModal";
import { emailRegex } from "constants/regex";
import { Genders } from "@customTypes/enums";
import Checkbox from "@mui/joy/Checkbox";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

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

// Define props for the component.
interface AthleteCreationFormProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const AthleteCreationForm = ({ isOpen, setOpen }: AthleteCreationFormProps) => {
  const { t, i18n } = useTranslation();
  const { createAthlete, getAthleteId, requestAthlete } = useApi();
  const { selectedUser } = useContext(AuthContext);
  const [athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: undefined,
    has_access: false,
  });
  const [manage, setManage] = useState(true);

  // Track if field has been touched (to avoid showing errors initially)
  const [touched, setTouched] = useState<FormTouched>({
    first_name: false,
    last_name: false,
    email: false,
    birthdate: false,
    gender: false,
  });

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  // Get date format based on current locale
  const dateFormat = getDateFormatForLocale(i18n.language);

  const handleCheckboxChange = (e: any) => {
    setManage(e.target.checked); // true when checked, false when unchecked
  };

  // Validate form fields
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

  // Handle field changes
  const handleFieldChange = (field: keyof Athlete, value: any) => {
    setAthlete((prev) => ({ ...prev, [field]: value }));

    // Mark field as touched
    if (!touched[field as keyof FormTouched]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }

    // Validate field
    const error = validateField(field as keyof FormErrors, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle date change specifically
  const handleDateChange = (date: Date | null) => {
    // Mark as touched
    if (!touched.birthdate) {
      setTouched((prev) => ({ ...prev, birthdate: true }));
    }

    if (date) {
      // Format to ISO string for backend compatibility
      const isoDate = dayjs(date).format("YYYY-MM-DD");
      handleFieldChange("birthdate", isoDate);
    } else {
      handleFieldChange("birthdate", "");
    }
  };

  const requestAccess = async (email: string, birthdate: string) => {
    try {
      await requestAthlete(await getAthleteId(email, birthdate), selectedUser!.id);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error requesting athlete", error);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.failed"), {
        variant: "error", // Changed to 'error'
      });
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.keys(errors).every((field) => touched[field as keyof FormTouched])
    );
  };

  // Mark all fields as touched when submit button is clicked
  const handleSubmitAttempt = () => {
    const allTouched: FormTouched = {
      first_name: true,
      last_name: true,
      email: true,
      birthdate: true,
      gender: true,
    };

    setTouched(allTouched);

    // Revalidate all fields
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

  // Reset form
  const resetForm = () => {
    setAthlete({
      first_name: "",
      last_name: "",
      email: "",
      gender: undefined,
      birthdate: "",
      has_access: false,
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

  // Function to mark field as touched
  const markTouched = (field: keyof FormTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getDatePickerValue = (): Dayjs | null => {
    if (!athlete.birthdate) return null;

    try {
      // Convert the ISO string (or Date) to a Dayjs object
      return dayjs(athlete.birthdate);
    } catch (e) {
      console.error("Invalid date format:", athlete.birthdate, e);
      return null;
    }
  };

  return (
    <GenericModal
      header={t("pages.athleteCreationPage.createHeader")}
      open={isOpen}
      setOpen={setOpen}
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
        }}
      >
        <FormControl error={touched.first_name && !!errors.first_name}>
          <FormLabel>{t("pages.athleteCreationPage.firstName")}</FormLabel>
          <Input
            placeholder={t("pages.athleteCreationPage.firstName")}
            size="lg"
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
            size="lg"
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
          <FormLabel>{t("pages.athleteCreationPage.email")}</FormLabel>
          <Input
            placeholder={t("pages.athleteCreationPage.email")}
            size="lg"
            variant="outlined"
            value={athlete.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => markTouched("email")}
          />
          {touched.email && errors.email && (
            <FormHelperText>{errors.email}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.birthdate && !!errors.birthdate}>
          <FormLabel>{t("pages.athleteCreationPage.birthdate")}</FormLabel>
          <CustomDatePicker
            sx={{ width: "100%" }}
            value={getDatePickerValue()}
            onChange={handleDateChange}
            format={dateFormat}
            error={touched.birthdate && !!errors.birthdate}
          />
          {touched.birthdate && errors.birthdate && (
            <FormHelperText>{errors.birthdate}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={touched.gender && !!errors.gender}>
          <FormLabel>{t("pages.athleteCreationPage.gender")}</FormLabel>
          <Select
            placeholder={t("pages.athleteCreationPage.gender")}
            value={athlete.gender}
            onChange={(_, newValue) => handleFieldChange("gender", newValue)}
            onBlur={() => markTouched("gender")}
          >
            <Option value={Genders.FEMALE}>{t("genders.FEMALE")}</Option>
            <Option value={Genders.MALE}>{t("genders.MALE")}</Option>
            <Option value={Genders.DIVERSE}>{t("genders.DIVERSE")}</Option>
          </Select>
          {touched.gender && errors.gender && (
            <FormHelperText>{errors.gender}</FormHelperText>
          )}
        </FormControl>

        <Checkbox
          label={t("pages.athleteCreationPage.sendMangementRequest")}
          checked={manage}
          onChange={handleCheckboxChange}
        />

        <Button
          fullWidth
          disabled={!isFormValid()}
          sx={{
            mt: 4,
            mb: 2,
          }}
          onClick={async () => {
            if (handleSubmitAttempt()) {
              try {
                await createAthlete(athlete);
                setOpen(false);
                resetForm();
                if (manage) {
                  await requestAccess(athlete.email, athlete.birthdate);
                }
              } catch (error) {
                console.error(
                  "Error creating athlete or requesting access",
                  error,
                );
              }
            }
          }}
        >
          {t("pages.athleteCreationPage.createButton")}
        </Button>
      </Box>
    </GenericModal>
  );
};

export default AthleteCreationForm;