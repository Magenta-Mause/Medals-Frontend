import {Box, FormControl, FormLabel, Input, Radio, RadioGroup, Select, Option, Typography, Button} from "@mui/joy";
import * as React from 'react';
import { useTranslation } from "react-i18next";
import { createAthlete } from "@api/APIService";

interface Athlete{
firstname: string;
lastname: string;
email: string;
birthdate: string;
gender: string
}



const AthleteCreationForm  = () => {
     const { t } = useTranslation();
     const [gender, setgender] = React.useState('female');
     const [fname, setfname] = React.useState("");
     const [lname, setlname] = React.useState("");
     const [email, setemail] = React.useState("");
     const [birthdate, setbirthdate] = React.useState("");
     const [valid, setvalid] = React.useState(false)
     const [valid2, setvalid2] = React.useState(false)
     const [valid3, setvalid3] = React.useState(false)
     const [accept, setaccept] = React.useState(true)

     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

     React.useEffect(() => {
      checkemail();
      accepted();
    })
    
    
     const newAthlete: Athlete = {
        firstname: fname,
        lastname: lname,
        birthdate:birthdate,
        email: email,
        gender: gender,
      };

    const accepted = () => {
        if(valid && valid2 && valid3 === true){
          setaccept(false)
        }
    }  

    const checklength1 =(word:string) => {
      if (word.length < 255) {
        setvalid(true)
        return true
      } else {setvalid(false)} return false
    }

    const checklength2 =(word:string) => {
      if (word.length < 255) {
        setvalid2(true)
        return true
      } else {setvalid2(false)} return false

    }

    const isValidEmail = (email:string) => emailRegex.test(email);
     
    const checkemail= () => {
        if(isValidEmail(email)){
          setvalid3(true)
          return true
        } else {
          setvalid3(false)
          return false
        }
    }

     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setgender(event.target.value);
     };

     const createAth = (newAthlete:Athlete) =>{
        createAthlete(newAthlete);
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
            value={fname}
            onChange={(e) => checklength1(e.target.value) && setfname(e.target.value)}
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
            value={lname}
            onChange={(e) => checklength2(e.target.value) && setlname(e.target.value)}
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
            value={email}
            onChange={(e) => setemail(e.target.value)}
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

        <Button disabled={accept}
        sx={{
            marginTop:'10vh'
        }}
        onClick={() => {
            {checkemail()&&  createAth(newAthlete), setaccept(false)}
          }}>
            {t("pages.athleteOverviewPage.createButton")}
        </Button>








    </div>
      );

}

export default AthleteCreationForm;