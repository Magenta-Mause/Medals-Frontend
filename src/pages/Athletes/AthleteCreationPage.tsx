import {Box, FormControl, FormLabel, Input, Radio, RadioGroup, Select, Option, Typography, Button} from "@mui/joy";
import * as React from 'react';
import { useTranslation } from "react-i18next";
import { createAthlete } from "@api/APIService";

interface Athlete{
firstname: String;
lastname: String;
birthdate: String;
email: String;
gender: String
}



const AthleteCreationForm  = () => {
     const { t } = useTranslation();
     const [value, setValue] = React.useState('female');
     const fname = ""
     const lname = ""
     const email = ""
     const birthdate = ""

     const newAthlete: Athlete = {
        firstname: fname,
        lastname: lname,
        birthdate:birthdate,
        email: email,
        gender: value,
      };
     

     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setValue(event.target.value);
     };

     const createAth = () =>{
        
        createAthlete(newAthlete)
     }

return(
    <div>
         <Typography level="h2" component="h1">
          {t("pages.athleteOverviewPage.createButton")}
        </Typography>

        <Input
            sx={{
                width:'30vw',
                marginTop:'8vh',
                marginBottom:'2vh'
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            placeholder={t("pages.athleteCreationPage.firstName")}
        />
        <Input
            sx={{
                width:'30vw',
                marginTop:'2vh',
                marginBottom:'2vh'
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            placeholder={t("pages.athleteCreationPage.lastName")}
            value={""}
        />
        <Input
            sx={{
                width:'30vw',
                marginTop:'2vh',
                marginBottom:'2vh'
            }}
            color="neutral"
            size="lg"
            variant="outlined"
            placeholder={t("pages.athleteCreationPage.E-Mail")}
        />
        

        <Input 
        sx={{
            width:'30vw',
            marginBottom:'2vh'
        }}
        type="date"
        slotProps={{
          input: {
            min: '1900-01-01'
          },
        }}
      />


        <FormControl>
            <FormLabel>{t("pages.athleteCreationPage.gender")}</FormLabel>
                <RadioGroup
                     defaultValue="female"
                    name="controlled-radio-buttons-group"
                    value={value}
                     onChange={handleChange}
                    sx={{ my: 1 }}
                >
                    <Radio value="female" label={t("genders.FEMALE")} />
                    <Radio value="male" label={t("genders.MALE")} />
                    <Radio value="other" label={t("genders.DIVERSE")} />
                </RadioGroup>
        </FormControl>

        <Button
        sx={{
            marginTop:'10vh'
        }}
        onClick={() => {
            createAth()
          }}>
            {t("pages.athleteOverviewPage.createButton")}
        </Button>








    </div>
      );

}

export default AthleteCreationForm;