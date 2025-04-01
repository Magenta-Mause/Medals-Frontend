import { Athlete } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Box, Button, FormLabel, Input, FormControl, FormHelperText } from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import GenericModal from "../GenericModal";
import { Genders } from "@customTypes/enums";

const emailRegex = // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/i;

const isValidEmail = (email: string) => emailRegex.test(email);

// Default date format based on locale
const getDateFormatForLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    'en': 'MM/DD/YYYY',
    'de': 'DD.MM.YYYY',
    'fr': 'DD/MM/YYYY',
    // Add more locales as needed
  };
  return localeMap[locale.split('-')[0]] || 'DD/MM/YYYY'; // Default to European format
};

const AthleteCreationForm = () => {
  const { t, i18n } = useTranslation();
  const { createAthlete } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: undefined,
  });
  
  // Track if field has been touched (to avoid showing errors initially)
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    email: false,
    birthdate: false,
    gender: false,
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  // Get date format based on current locale
  const dateFormat = getDateFormatForLocale(i18n.language);

  // Validate form fields
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'first_name':
        if (!value) return t("validation.required");
        if (value.length > 255) return t("validation.tooLong");
        return "";
      case 'last_name':
        if (!value) return t("validation.required");
        if (value.length > 255) return t("validation.tooLong");
        return "";
      case 'email':
        if (!value) return t("validation.required");
        if (!isValidEmail(value)) return t("validation.invalidEmail");
        return "";
      case 'birthdate':
        if (!value) return t("validation.required");
        return "";
      case 'gender':
        if (value === undefined) return t("validation.required");
        return "";
      default:
        return "";
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof Athlete, value: any) => {
    setAthlete(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    if (!touched[field as keyof typeof touched]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
    
    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return Object.values(errors).every(error => !error) && 
           Object.keys(errors).every(field => touched[field as keyof typeof touched]);
  };

  // Mark all fields as touched when submit button is clicked
  const handleSubmitAttempt = () => {
    const allTouched = Object.keys(touched).reduce((acc, field) => {
      acc[field as keyof typeof touched] = true;
      return acc;
    }, { ...touched });
    
    setTouched(allTouched);
    
    // Revalidate all fields
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      acc[field] = validateField(field, athlete[field as keyof Athlete]);
      return acc;
    }, { ...errors });
    
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

  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteOverviewPage.createButton")}
      </Button>
      <GenericModal
        header={t("pages.athleteCreationPage.createHeader")}
        open={isPopupOpen}
        setOpen={setPopupOpen}
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
            width: { xs: "100%", md: "30vw" }
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
              onBlur={() => setTouched(prev => ({ ...prev, first_name: true }))}
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
              onBlur={() => setTouched(prev => ({ ...prev, last_name: true }))}
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
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            />
            {touched.email && errors.email && (
              <FormHelperText>{errors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={touched.birthdate && !!errors.birthdate}>
            <FormLabel>{t("pages.athleteCreationPage.birthdate")}</FormLabel>
            <CustomDatePicker
              sx={{ width: "100%" }}
              value={athlete.birthdate || null}
              onChange={(newDate) => {
                if (newDate) {
                  const localDate = new Date(newDate);
                  const adjustedDate = new Date(
                    localDate.getTime() - localDate.getTimezoneOffset() * 60000,
                  );
                  handleFieldChange("birthdate", adjustedDate);
                } else {
                  handleFieldChange("birthdate", "");
                }
              }}
              onBlur={() => setTouched(prev => ({ ...prev, birthdate: true }))}
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
              onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
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
            disabled={!isFormValid()}
            sx={{
              mt: 4,
              mb: 2,
            }}
            onClick={() => {
              if (handleSubmitAttempt()) {
                createAthlete(athlete);
                setPopupOpen(false);
                resetForm();
              }
            }}
          >
            {t("pages.athleteCreationPage.createButton")}
          </Button>
        </Box>
      </GenericModal>
    </>
  );
};

export default AthleteCreationForm;
