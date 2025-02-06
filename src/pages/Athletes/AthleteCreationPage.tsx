import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/joy";
import * as React from "react";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";

interface Athlete {
  firstname: string;
  lastname: string;
  email: string;
  birthdate: string;
  gender: string;
}

const AthleteCreationForm = () => {
  const { t } = useTranslation();
  const [gender, setgender] = React.useState("female");
  const [fname, setfname] = React.useState("");
  const [lname, setlname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [birthdate, setbirthdate] = React.useState("");
  const [valid, setvalid] = React.useState(true);
  const { createAthlete } = useApi();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = (email: string) => emailRegex.test(email);

  React.useEffect(() => {
    setvalid(isAccepted());
  }),
    [];

  const newAthlete: Athlete = {
    firstname: fname,
    lastname: lname,
    birthdate: birthdate,
    email: email,
    gender: gender,
  };

  const isAccepted = () => {
    if (fname.length > 255 || fname.length === 0) {
      return true;
    }
    if (lname.length > 255 || lname.length === 0) {
      return true;
    }
    if (!isValidEmail(email)) {
      return true;
    }
    if (birthdate === "tt.mm.jjjj" || birthdate === "") {
      return true;
    }
    return false;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setgender(event.target.value);
  };

  const createAth = (newAthlete: Athlete) => {
    createAthlete(newAthlete);
  };

  return (
    <div>
      <Typography level="h2" component="h1">
        {t("pages.athleteOverviewPage.createButton")};
      </Typography>

      <Input
        sx={{
          width: "30vw",
          marginTop: "8vh",
          marginBottom: "2vh",
        }}
        color="neutral"
        size="lg"
        variant="outlined"
        placeholder={t("pages.athleteCreationPage.firstName")}
        value={fname}
        onChange={(e) => setfname(e.target.value)}
      />
      <Input
        sx={{
          width: "30vw",
          marginTop: "2vh",
          marginBottom: "2vh",
        }}
        color="neutral"
        size="lg"
        variant="outlined"
        placeholder={t("pages.athleteCreationPage.lastName")}
        value={lname}
        onChange={(e) => setlname(e.target.value)}
      />
      <Input
        sx={{
          width: "30vw",
          marginTop: "2vh",
          marginBottom: "2vh",
        }}
        color="neutral"
        size="lg"
        variant="outlined"
        placeholder={t("pages.athleteCreationPage.E-Mail")}
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />

      <Input
        sx={{
          width: "30vw",
          marginBottom: "2vh",
        }}
        type="date"
        slotProps={{
          input: {
            min: "1900-01-01",
          },
        }}
        value={birthdate}
        onChange={(e) => setbirthdate(e.target.value)}
      />

      <FormControl>
        <FormLabel>{t("pages.athleteCreationPage.gender")}</FormLabel>
        <RadioGroup
          defaultValue="female"
          name="controlled-radio-buttons-group"
          value={gender}
          onChange={handleChange}
          sx={{ my: 1 }}
        >
          <Radio value="female" label={t("genders.FEMALE")} />
          <Radio value="male" label={t("genders.MALE")} />
          <Radio value="other" label={t("genders.DIVERSE")} />
        </RadioGroup>
      </FormControl>

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
        {t("pages.athleteOverviewPage.createButton")}
      </Button>
    </div>
  );
};

export default AthleteCreationForm;
