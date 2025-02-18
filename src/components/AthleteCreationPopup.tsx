import { Athlete } from "@customTypes/bffTypes";
import useApi from "@hooks/useApi";
import { Button, FormLabel, Input, Modal, Sheet, Typography } from "@mui/joy";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "./CustomDatePicker/CustomDatePicker";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

const AthleteCreationForm = () => {
  const { t } = useTranslation();
  const { createAthlete } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [date] = useState<any>();
  const [athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = (email: string) => emailRegex.test(email);

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
    if (athlete.gender === "") {
      return false;
    }
    return true;
  };

  const handleChangeGender = (
    event: React.SyntheticEvent | null,
    newGender: string | null,
  ) => {
    setAthlete((prevUser: Athlete) => ({
      ...prevUser,
      gender: newGender!,
    }));
  };

  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setPopupOpen(true)}
      >
        {t("pages.athleteOverviewPage.createButton")}
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: {
            md: "var(--Sidebar-width)",
            sm: "0",
          },
        }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 1000, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          ></Typography>
          <Typography id="modal-desc" textColor="text.tertiary"></Typography>
          <Typography level="h2" component="h1">
            {t("pages.athleteCreationPage.createButton")}
          </Typography>
          <FormLabel sx={{ marginTop: "6vh" }}>
            {t("pages.athleteCreationPage.firstName")}
          </FormLabel>
          <Input
            sx={{
              width: { sx: "40vw", md: "30vw" },
              marginBottom: "2vh",
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            value={athlete.first_name}
            onChange={(e) =>
              setAthlete((prevUser: Athlete) => ({
                ...prevUser,
                first_name: e.target.value,
              }))
            }
          />
          <FormLabel> {t("pages.athleteCreationPage.lastName")}</FormLabel>
          <Input
            sx={{
              width: { sx: "60vw", md: "30vw" },
              marginBottom: "2vh",
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            value={athlete.last_name}
            onChange={(e) =>
              setAthlete((prevUser: Athlete) => ({
                ...prevUser,
                last_name: e.target.value,
              }))
            }
          />
          <FormLabel> {t("pages.athleteCreationPage.email")}</FormLabel>
          <Input
            sx={{
              width: { sx: "60vw", md: "30vw" },
              marginBottom: "2vh",
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            value={athlete.email}
            onChange={(e) =>
              setAthlete((prevUser: Athlete) => ({
                ...prevUser,
                email: e.target.value,
              }))
            }
          />
          <FormLabel> {t("pages.athleteCreationPage.birthdate")}</FormLabel>
          <CustomDatePicker
            sx={{
              width: { sx: "60vw", md: "30vw" },
              marginBottom: "1vh",
              position: "relative",
            }}
            value={date}
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
          <p>
            <FormLabel> {t("pages.athleteCreationPage.gender")}</FormLabel>
            <Select sx={{ height: "5vh" }} onChange={handleChangeGender}>
              <Option value="FEMALE">{t("genders.FEMALE")}</Option>
              <Option value="MALE">{t("genders.MALE")}</Option>
              <Option value="DIVERSE">{t("genders.DIVERSE")}</Option>
            </Select>
          </p>
          <Button
            fullWidth
            disabled={!isAccepted()}
            sx={{
              marginTop: "10vh",
            }}
            onClick={() => {
              {
                createAthlete(athlete);
                setPopupOpen(false);
                setAthlete((prevUser: Athlete) => ({
                  ...prevUser,
                  first_name: "",
                  last_name: "",
                  email: "",
                  gender: "",
                  birthdate: "",
                }));
              }
            }}
          >
            {t("pages.athleteCreationPage.createButton")}
          </Button>
        </Sheet>
      </Modal>
    </>
  );
};

export default AthleteCreationForm;
