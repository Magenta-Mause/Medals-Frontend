import { Athlete } from "bffTypes";
import useApi from "@hooks/useApi";
import {
  Button,
  Dropdown,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  Modal,
  ModalClose,
  Radio,
  RadioGroup,
  Sheet,
  Typography,
} from "@mui/joy";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "./CustomDatePicker/CustomDatePicker";
import dayjs from "dayjs";


const AthleteCreationForm = () => {
  const { t } = useTranslation();
  const [valid, setValid] = useState(true);
  const { createAthlete } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [date] = useState<any>();
  const [Athlete, setAthlete] = useState<Athlete>({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = (email: string) => emailRegex.test(email);

  React.useEffect(() => {
    setValid(isAccepted());
  }, [Athlete]);

  const isAccepted = () => {
    if (Athlete.first_name.length > 255 || Athlete.first_name === "") {
      return true;
    }
    if (Athlete.last_name.length > 255 || Athlete.last_name.length === 0) {
      return true;
    }
    if (!isValidEmail(Athlete.email)) {
      return true;
    }
    if (Athlete.birthdate === "tt.mm.jjjj" || Athlete.birthdate === "") {
      return true;
    }
    if (Athlete.gender === "") {
      return true;
    }
    return false;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAthlete((prevUser: Athlete) => ({
      ...prevUser,
      gender: event.target.value,
    }));
  };

  const createAth = (newAthlete: Athlete) => {
    createAthlete(newAthlete);
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
          left: "10vw",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 1000, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
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
            {" "}
            {t("pages.athleteCreationPage.firstName")}
          </FormLabel>
          <Input
            sx={{
              width: { sx: "60vw", md: "30vw" },
              marginBottom: "2vh",
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            placeholder={t("pages.athleteCreationPage.firstName")}
            value={Athlete.first_name}
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
            placeholder={t("pages.athleteCreationPage.lastName")}
            value={Athlete.last_name}
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
            placeholder={t("pages.athleteCreationPage.email")}
            value={Athlete.email}
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
              marginBottom: "2vh",
              position: "relative",
            }}
            value={date}
            onChange={(newDate) => {
              const localDate = new Date(newDate);
              const adjustedDate:any = new Date(
                localDate.getTime() - localDate.getTimezoneOffset() * 60000
              );
              setAthlete((prevUser: Athlete) => ({
                ...prevUser,
                birthdate: adjustedDate,
              }));
            }}
            format="DD/MM/YYYY"
          />
          <p>
            <Dropdown>
              <MenuButton sx={{ width: "30vw", marginTop: "" }}>
                {t("pages.athleteCreationPage.gender")}
              </MenuButton>
              <Menu sx={{ zIndex: "9999", height: "20" }}>
                <FormControl>
                  <RadioGroup
                    defaultValue="FEMALE"
                    name="controlled-radio-buttons-group"
                    value={Athlete.gender}
                    onChange={handleChange}
                    sx={{
                      my: 1,
                      width: "30vw",
                      height: "11vh",
                      overflow: "hidden",
                    }}
                  >
                    <Radio value="FEMALE" label={t("genders.FEMALE")} />
                    <Radio value="MALE" label={t("genders.MALE")} />
                    <Radio value="DIVERSE" label={t("genders.DIVERSE")} />
                  </RadioGroup>
                </FormControl>
              </Menu>
            </Dropdown>
          </p>
          <Button
            fullWidth
            disabled={valid}
            sx={{
              marginTop: "10vh",
            }}
            onClick={() => {
              {
                createAth(Athlete);
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
