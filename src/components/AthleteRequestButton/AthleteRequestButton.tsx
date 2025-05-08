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
import { ListItemText, debounce } from "@mui/material";
import { Athlete } from "@customTypes/bffTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const AthleteInviteButton = () => {
  const { t } = useTranslation();
  const { searchAthletes, requestAthleteAccess } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchAthlete, setSearchAthlete] = useState("");
  const [filteredResults, setFilteredResults] = useState<Athlete[]>([]);
  const { selectedUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

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

    requestAthleteAccess(athleteId, trainerId);
  };

  const fetchAthletes = async (searchTerm: string) => {
    try {
      const athletes = await searchAthletes(searchTerm);
      setFilteredResults(athletes);
    } catch (error) {
      console.error("Error fetching athletes", error);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchAthlete(searchTerm);
  };

  useEffect(() => {
    if (searchAthlete.trim() === "") {
      setFilteredResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      fetchAthletes(searchAthlete);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchAthlete]);

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
          sx={(thema) => ({
            padding: "2rem",
            width: { md: "35vw" },
            borderRadius: "8px",
            background: "white",
            [thema.getColorSchemeSelector("dark")]: {
              background: "rgba(19 19 24 / 0.8)",
            },
          })}
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
            onChange={handleSearchChange}
          />
          <List
            sx={{
              paddingInline: 2,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {filteredResults.length > 0 && loading && (
              <Typography>
                {t("components.athleteDatagrid.inviteModal.loading")}
              </Typography>
            )}
            {filteredResults.length === 0 && !loading && (
              <Typography>
                {t("components.athleteDatagrid.inviteModal.notFound")}
              </Typography>
            )}
            {filteredResults.map((athlete, index) => (
              <ListItem
                key={index}
                sx={(thema) => ({
                  padding: 0,
                  paddingBottom: 2,
                  width: { md: "28vw" },
                  borderRadius: 10,
                  "&:hover": {
                    width: { md: "29vw" },
                    background: "rgba(199, 199, 199, 0.8)",
                  },
                  [thema.getColorSchemeSelector("dark")]: {
                    "&:hover": {
                      background: "rgba(64, 64, 64, 0.8)",
                    },
                  },
                })}
              >
                <ListItemText
                  primary={`${athlete.first_name} ${athlete.last_name}`}
                  secondary={athlete.birthdate}
                />
                <Button
                  onClick={() => {
                    handleInvite(athlete.id, selectedUser?.id);
                    setPopupOpen(false);
                    setSearchAthlete("");
                  }}
                  sx={{
                    cursor: "pointer",
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
