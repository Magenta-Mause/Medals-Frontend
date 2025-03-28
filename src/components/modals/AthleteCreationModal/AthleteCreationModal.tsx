import { Athlete } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import { Box, Button, FormLabel, Input } from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import GenericModal from "../GenericModal";
import { Genders } from "@customTypes/enums";

const emailRegex = // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/i;

const isValidEmail = (email: string) => emailRegex.test(email);

interface AthleteCreateModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteCreationForm = (props: AthleteCreateModalProps) => {
  const { t } = useTranslation();
  const { createAthlete } = useApi();
  const [athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: undefined,
  });
  const [inputValid, setInputValid] = useState({
    first_name: false,
    last_name: false,
    email: false,
    birthdate: false,
    gender: false,
  });

  const isAccepted = () => {
    if (athlete.first_name.length > 255 || athlete.first_name === "") {
      return false;
    }
    if (athlete.last_name.length > 255 || athlete.last_name.length === 0) {
      return false;
    }
    if (!isValidEmail(athlete.email)) {
      return false;
    }
    if (athlete.birthdate === "tt.mm.jjjj" || athlete.birthdate === "") {
      return false;
    }
    if (athlete.gender === undefined) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (athlete.first_name.length! > 255 || athlete.first_name !== "") {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        first_name: true,
      }));
    } else {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        first_name: false,
      }));
    }
    if (athlete.last_name.length! > 255 || athlete.last_name !== "") {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        last_name: true,
      }));
    } else {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        last_name: false,
      }));
    }
    if (isValidEmail(athlete.email)) {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        email: true,
      }));
    } else {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        email: false,
      }));
    }
    if (athlete.birthdate !== "") {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        birthdate: true,
      }));
    } else {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        birthdate: false,
      }));
    }
    if (athlete.gender !== undefined) {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        gender: true,
      }));
    } else {
      setInputValid((prevUser: any) => ({
        ...prevUser,
        gender: false,
      }));
    }
  }, [athlete]);

  const handleChangeGender = (
    event: React.SyntheticEvent | null,
    newGender: string | null,
  ) => {
    setAthlete((prevUser: Athlete) => ({
      ...prevUser,
      gender: newGender! as Genders,
    }));
  };

  return (
    <>
      <GenericModal
        header={t("pages.athleteCreationPage.createHeader")}
        open={props.isOpen}
        setOpen={props.setOpen}
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
