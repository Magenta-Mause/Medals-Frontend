import useApi from "@hooks/useApi";
import {
  Box,
  Button,
  Divider,
  Input,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Athlete } from "@customTypes/backendTypes";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GenericModal from "@components/modals/GenericModal";
import { enqueueSnackbar } from "notistack";
import useFormatting from "@hooks/useFormatting";
import { useTypedSelector } from "@stores/rootReducer";

interface AthleteRequestModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AthleteRequestButton = (props: AthleteRequestModalProps) => {
  const athletes = useTypedSelector((state) => state.athletes.data);
  const requestedAthletes = useMemo(
    () => athletes.filter((athlete) => !athlete.has_access),
    [athletes],
  );
  const accessibleAthletes = useMemo(
    () => athletes.filter((athlete) => athlete.has_access),
    [athletes],
  );
  const { t } = useTranslation();
  const { searchAthletes, requestAthlete } = useApi();
  const [loading, setLoading] = useState(false);
  const [icon, setShowScrollIcon] = useState(false);
  const [searchAthlete, setSearchAthlete] = useState("");
  const [fetchedAthletes, setFetchedAthletes] = useState<Athlete[]>([]);
  const athletesShown = useMemo(
    () =>
      fetchedAthletes.filter(
        (athlete) =>
          accessibleAthletes.filter((athlete2) => athlete2.id == athlete.id)
            .length == 0,
      ),
    [accessibleAthletes, fetchedAthletes],
  );
  const { formatLocalizedDate } = useFormatting();
  const { selectedUser } = useContext(AuthContext);
  const [buttonState, setButtonState] = useState<{
    [key: number]: { loading: boolean; send: boolean };
  }>({});
  const listRef = useRef<HTMLUListElement | null>(null);

  const isButtonDisabled = (athleteId: number | undefined): boolean => {
    if (athleteId === undefined) return true;

    const athleteState = buttonState[athleteId];
    if (
      requestedAthletes.filter((athlete) => athlete.id == athleteId).length > 0
    ) {
      return true;
    }
    return athleteState?.loading || athleteState?.send || false;
  };

  const handleInvite = async (
    athleteId: number | undefined,
    trainerId: number | undefined,
  ) => {
    if (athleteId === undefined || trainerId === undefined) {
      return;
    }
    setButtonState((prevState) => ({
      ...prevState,
      [athleteId]: { loading: true, send: true },
    }));

    try {
      await requestAthlete(athleteId);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.success"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error requesting athlete", error);
      enqueueSnackbar(t("snackbar.requestAthleteAccess.failed"), {
        variant: "success",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAthlete(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const athletes = await searchAthletes(searchAthlete);
        setFetchedAthletes(athletes);
        if (athletes.length > 5) {
          setShowScrollIcon(true);
        }
      } catch (error) {
        console.error("Error fetching athletes", error);
        setFetchedAthletes([]);
      }
      setLoading(false);
    }, 500);

    setLoading(true);
    return () => clearTimeout(delayDebounceFn);
  }, [searchAthletes, searchAthlete, props.isOpen]);

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

  useEffect(() => {
    const checkScrollable = () => {
      if (listRef.current) {
        const { scrollHeight, clientHeight } = listRef.current;
        setShowScrollIcon(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
  }, [fetchedAthletes]);

  return (
    <>
      <GenericModal
        header={t("components.requestAthleteModal.header")}
        open={props.isOpen}
        setOpen={props.setOpen}
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
            {athletesShown.length === 0 && (
              <Typography sx={{ padding: 2, paddingBottom: 1 }}>
                {t("components.requestAthleteModal.notFound")}
              </Typography>
            )}

            {athletesShown.map((athlete, index) => (
              <React.Fragment key={athlete.id}>
                <ListItem
                  key={index}
                  sx={(theme) => ({
                    padding: 1,
                    width: "100%",
                    borderRadius: 3,
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
                  <ListItemContent>
                    <Typography level="title-sm">{`${athlete.first_name} ${athlete.last_name}`}</Typography>
                    <Typography level="body-sm" noWrap>
                      {`${formatLocalizedDate(athlete.birthdate)}`}
                    </Typography>
                  </ListItemContent>
                  <Button
                    onClick={() => {
                      handleInvite(athlete.id, selectedUser?.id);
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                    disabled={isButtonDisabled(athlete.id)}
                  >
                    {isButtonDisabled(athlete.id)
                      ? t("components.requestAthleteModal.sendButton")
                      : t(
                          "components.requestAthleteModal.requestAthleteButton",
                        )}
                  </Button>
                </ListItem>
                {index != athletesShown.length - 1 ? (
                  <Divider sx={{ margin: 0.7 }} component="li" />
                ) : (
                  <></>
                )}
              </React.Fragment>
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
