import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Typography,
  Button,
  Sheet,
  Modal,
  ModalClose,
  Dropdown,
  MenuButton,
  Menu,
} from "@mui/joy";
import * as React from "react";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { Athlete } from "@customTypes/bffTypes";
import { useState } from "react";

const AthleteCreationForm = () => {
  const { t } = useTranslation();
  const [valid, setvalid] = useState(true);
  const { createAthlete } = useApi();
  const [openPopup, setOpenPopUp] = useState(false);
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
    setvalid(isAccepted());
  });

  const newAthlete: Athlete = {
    first_name: Athlete.first_name,
    last_name: Athlete.last_name,
    birthdate: Athlete.birthdate,
    email: Athlete.email,
    gender: Athlete.gender,
  };

  const isAccepted = () => {
    if (Athlete.first_name.length > 255 || Athlete.first_name.length === 0) {
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
    return false;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAthlete((prevUser) => ({
      ...prevUser,
      gender: event.target.value,
    }));
  };

  const createAth = (newAthlete: Athlete) => {
    createAthlete(newAthlete);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpenPopUp(true)}
      >
        {t("pages.athleteOverviewPage.createButton")}
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openPopup}
        onClose={() => setOpenPopUp(false)}
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
          <FormControl>
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
                setAthlete((prevUser) => ({
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
                setAthlete((prevUser) => ({
                  ...prevUser,
                  last_name: e.target.value,
                }))
              }
            />
            <FormLabel> {t("pages.athleteCreationPage.E-Mail")}</FormLabel>
            <Input
              sx={{
                width: { sx: "60vw", md: "30vw" },
                marginBottom: "2vh",
              }}
              color="neutral"
              size="lg"
              variant="outlined"
              placeholder={t("pages.athleteCreationPage.E-Mail")}
              value={Athlete.email}
              onChange={(e) =>
                setAthlete((prevUser) => ({
                  ...prevUser,
                  email: e.target.value,
                }))
              }
            />
            <FormLabel> {t("pages.athleteCreationPage.birthdate")}</FormLabel>
            <Input
              sx={{
                width: { sx: "60vw", md: "30vw" },
                marginBottom: "2vh",
              }}
              type="date"
              slotProps={{
                input: {
                  min: "1900-01-01",
                },
              }}
              value={Athlete.birthdate}
              onChange={(e) =>
                setAthlete((prevUser) => ({
                  ...prevUser,
                  birthdate: e.target.value,
                }))
              }
            />
            <Dropdown>
              <MenuButton>{t("pages.athleteCreationPage.gender")}</MenuButton>
              <Menu sx={{ zIndex: "99900000" }}>
                <FormControl>
                  <RadioGroup
                    defaultValue="female"
                    name="controlled-radio-buttons-group"
                    value={Athlete.gender}
                    onChange={handleChange}
                    sx={{
                      my: 1,
                      width: "30vw",
                      height: "10vh",
                      overflow: "hidden",
                    }}
                  >
                    <Radio value="female" label={t("genders.FEMALE")} />
                    <Radio value="male" label={t("genders.MALE")} />
                    <Radio value="other" label={t("genders.DIVERSE")} />
                  </RadioGroup>
                </FormControl>
              </Menu>
            </Dropdown>
            <Button
              disabled={valid}
              sx={{
                marginTop: "10vh",
              }}
              onClick={() => {
                {
                  createAth(newAthlete);
                }
              }}
            >
              {t("pages.athleteCreationPage.createButton")}
            </Button>
          </FormControl>
        </Sheet>
      </Modal>
    </div>
  );
};

export default AthleteCreationForm;
