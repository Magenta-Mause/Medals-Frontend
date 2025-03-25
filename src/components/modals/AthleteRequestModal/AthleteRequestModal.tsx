import useApi from "@hooks/useApi";
import { Box, Button, List, Input, ListItem, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext, useRef } from "react";
import { ListItemText, Divider, CircularProgress } from "@mui/material";
import { Athlete } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GenericModal from "@components/modals/GenericModal";
import { enqueueSnackbar } from "notistack";
import React from "react";

const AthleteRequestButton = () => {
  const { t } = useTranslation();
  const { searchAthletes, requestAthlete } = useApi();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [icon, setShowScrollIcon] = useState(false);
  const [searchAthlete, setSearchAthlete] = useState("");
  const [filteredResults, setFilteredResults] = useState<Athlete[]>([]);
  const { selectedUser } = useContext(AuthContext);
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleInvite = async (
    athleteId: number | undefined,
    trainerId: number | undefined,
  ) => {
    if (athleteId === undefined || trainerId === undefined) {
      return;
    }

    try {
      await requestAthlete(athleteId, trainerId);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error inviting athlete", error);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.success"), {
        variant: "success",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAthlete(e.target.value);
  };

  useEffect(() => {
    if (searchAthlete.trim() === "") {
      setFilteredResults([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const athletes = await searchAthletes(searchAthlete);
        setFilteredResults(athletes);
        if (athletes.length > 5) {
          setShowScrollIcon(true);
        }
      } catch (error) {
        console.error("Error fetching athletes", error);
        setFilteredResults([]);
      }
      setLoading(false);
    }, 500);

    setLoading(true);
    return () => clearTimeout(delayDebounceFn);
  }, [searchAthletes, searchAthlete]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setShowScrollIcon(false);
      } else {
        setShowScrollIcon(true);
      }
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setPopupOpen(true)}>
        {t("pages.athleteOverviewPage.requestAccessButton")}
      </Button>

      <GenericModal
        header={t("components.requestAthleteModal.header")}
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
          sx={(theme) => ({
            width: { md: "35vw" },
            borderRadius: "8px",
            background: "rgba(251, 252, 254, 1)",
            [theme.getColorSchemeSelector("dark")]: {
              background: "rgba(11, 13, 14, 1)",
            },
          })}
        >
          <Box sx={{ position: "relative", width: "100%" }}>
            <Input
              sx={{
                width: "100%",
                marginBottom: "1vh",
                height: { sx: "3vh", md: "5vh", xs: "5vh" },
              }}
              placeholder={t("components.requestAthleteModal.searchAthlete")}
              size="lg"
              value={searchAthlete}
              onChange={handleSearchChange}
            />
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "5%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
          <List
            ref={listRef}
            onScroll={handleScroll}
            sx={{ maxHeight: 400, overflowY: "auto" }}
          >
            {filteredResults.length === 0 && (
              <Typography sx={{ padding: 2, paddingBottom: 1 }}>
                {t("components.requestAthleteModal.notFound")}
              </Typography>
            )}

            {filteredResults.map((athlete, index) => (
              <>
                <ListItem
                  key={index}
                  sx={(theme) => ({
                    padding: 1,
                    width: "100%",
                    borderRadius: 10,
                    "&:hover": {
                      background: "rgba(199, 199, 199, 0.6)",
                    },
                    [theme.getColorSchemeSelector("dark")]: {
                      "&:hover": {
                        background: "rgba(64, 64, 64, 0.6)",
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary={`${athlete.first_name} ${athlete.last_name}`}
                    secondary={`${athlete.birthdate}`}
                  />
                  <Button
                    onClick={() => {
                      handleInvite(athlete.id, selectedUser?.id);
                      setSearchAthlete("");
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                    disabled={loading}
                  >
                    {t("components.requestAthleteModal.requestAthleteButton")}
                  </Button>
                </ListItem>
                <Divider sx={{ margin: 0.7 }} variant="middle" component="li" />
              </>
            ))}
          </List>
          {icon && (
            <ExpandMoreIcon
              sx={{ position: "absolute", bottom: 15, left: "48%" }}
            />
          )}
        </Box>
      </GenericModal>
    </>
  );
};

export default AthleteRequestButton;
