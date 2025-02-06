import AthleteDatagrid from "@components/Datagrids/AthleteDatagrid/AthleteDatagrid";
import { Box, Button, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { useTranslation } from "react-i18next";
import AthleteCreationForm from "./AthleteCreationPage";
import React, { useState } from "react";

const AthleteOverviewPage = () => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const athleteState = useTypedSelector((state) => state.athletes.state);
  const { t } = useTranslation();
  const [open, setOpen] = useState(Boolean);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          {t("pages.athleteOverviewPage.header")}
        </Typography>

        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            {t("pages.athleteOverviewPage.createButton")}
          </Button>
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
              <Typography id="modal-desc" textColor="text.tertiary">
                <AthleteCreationForm></AthleteCreationForm>
              </Typography>
            </Sheet>
          </Modal>
        </React.Fragment>
      </Box>
      <AthleteDatagrid
        athletes={athletes}
        isLoading={athleteState == "LOADING"}
      />
    </>
  );
};

export default AthleteOverviewPage;
