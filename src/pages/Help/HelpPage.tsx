import { Download, Pages } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next"

const HelpPage=()=>{
    const { t } = useTranslation();

    return (
        <>
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h2" component="h1">
                    {t("pages.helpPage.header")}
                </Typography>
                <Button>
                    <Download/>
                    {t("pages.helpPage.button")}
                </Button>
            </Box>
            <Typography sx={{ mt: 1 }}>
                {t("pages.helpPage.intro")}
            </Typography>
        </Box>

        <Box>
            <Typography level="h3" sx={{mt: 3}}>
                Lorem ipsum header
            </Typography>
            <Typography sx={{mt: 1}}>
                Lorem ipsum text
            </Typography>

        </Box>
        </>
    );
};

export default HelpPage;