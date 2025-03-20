import useApi from "@hooks/useApi";

import { Box, Button, Input, List, ListItem, Typography } from "@mui/joy";

import { useTranslation } from "react-i18next";

import { useState, useEffect, useContext } from "react";

import { ListItemText } from "@mui/material";

import { Athlete } from "@customTypes/backendTypes";

import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

import GenericModal from "@components/modals/GenericModal";

const AthleteInviteButton = () => {
  const { t } = useTranslation();

  const { searchAthletes, requestAthlete } = useApi();

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

    requestAthlete(athleteId, trainerId);
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

    const delayDebounceFn = setTimeout(async () => {
      try {
        const athletes = await searchAthletes(searchAthlete);

        setFilteredResults(athletes);
      } catch (error) {
        console.error("Error fetching athletes", error);

        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchAthletes, searchAthlete]);

  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteOverviewPage.inviteButton")}
      </Button>

      <GenericModal
        header={t("components.athleteDatagrid.inviteModal.header")}
        open={isPopupOpen}
        setOpen={setPopupOpen}
        modalSX={{
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
            width: { md: "35vw" },

            borderRadius: "8px",

            background: "rgba(255, 255, 255, 1)",

            [thema.getColorSchemeSelector("dark")]: {
              background: "rgba(11, 13, 14, 1)",
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
                  padding: 1,

                  marginBottom: 1,

                  width: { md: "28vw" },

                  borderRadius: 10,

                  borderBottom: "2px solid rgba(0, 0, 0, 0.1)",

                  "&:hover": {
                    background: "rgba(199, 199, 199, 0.6)",
                  },

                  [thema.getColorSchemeSelector("dark")]: {
                    borderBottom: "2px solid rgba(199, 199, 199, 0.1)",

                    "&:hover": {
                      background: "rgba(64, 64, 64, 0.6)",
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
      </GenericModal>
    </>
  );
};

export default AthleteInviteButton;
