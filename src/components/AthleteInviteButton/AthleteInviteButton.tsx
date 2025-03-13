import useApi from "@hooks/useApi";
import {
  Box,
  Button,
  Input,
  List,
  ListItem,
  Modal,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import { ListItemText } from "@mui/material";
import { Athlete } from "@customTypes/bffTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const AthleteInviteButton = () => {
  const { t } = useTranslation();
  const { searchAthletes, inviteAthlete } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchAthlete, setSearchAthlete] = useState("");
  const [filteredResults, setFilteredResults] = useState<Athlete[]>([]);
  const { selectedUser } = useContext(AuthContext);

  const handleInvite = (
    athleteId: number | undefined,
    trainerId: number | undefined,
  ) => {
    if (athleteId === undefined) {
      throw new Error("Athlete ID is required");
    }

    if (trainerId === undefined) {
      throw new Error("Trainer ID is required");
    }

    inviteAthlete(athleteId, trainerId);
  };

  useEffect(() => {
    const fetchAthletes = async () => {
      if (searchAthlete.trim() === "") {
        setFilteredResults([]);
        return;
      }

      try {
        const athletes = await searchAthletes(searchAthlete);
        setFilteredResults(athletes);
      } catch (error) {
        console.error("Error fetching athletes", error);
        setFilteredResults([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchAthletes();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchAthlete, searchAthletes]);

  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteOverviewPage.inviteButton")}
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
        <Box
          sx={{
            padding: "2rem",
            width: { md: "35vw" },
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <Input
            sx={{
              width: { sx: "60vw", md: "30vw" },
              marginBottom: "2vh",
              height: { sx: "3vh", md: "5vh", xs: "5vh" },
            }}
            placeholder={t(
              "components.athleteDatagrid.inviteModal.searchAthlete",
            )}
            size="lg"
            value={searchAthlete}
            onChange={(e) => setSearchAthlete(e.target.value)}
          />
          <List
            sx={{
              paddingInline: 2,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {filteredResults.length === 0 && (
              <Typography>
                {t("components.athleteDatagrid.inviteModal.notFound")}
              </Typography>
            )}
            {filteredResults.map((athlete, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: 0,
                  paddingBottom: 2,
                  width: { md: "28vw" },
                }}
              >
                <ListItemText
                  primary={`${athlete.first_name} ${athlete.last_name}`}
                  secondary={athlete.email}
                />
                <Button
                  onClick={() => {
                    handleInvite(athlete.id, selectedUser?.id);
                    setPopupOpen(false);
                    setSearchAthlete("");
                  }}
                >
                  {t(
                    "components.athleteDatagrid.inviteModal.inviteAthleteButton",
                  )}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default AthleteInviteButton;
