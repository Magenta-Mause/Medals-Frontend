import { Athlete } from "@customTypes/backendTypes";
import { useTypedSelector } from "@stores/rootReducer";

const useAthleteLookup = () => {
  const useAthleteNameLookup = (userId: string) => {
    const athletes = useTypedSelector(
      (state) => state.athletes.data,
    ) as Athlete[];
    const filtered = athletes.filter((ath) => ath.id == parseInt(userId));
    return (
      <>
        {filtered.length == 0
          ? "Not found"
          : filtered[0].first_name + " " + filtered[0].last_name}
      </>
    );
  };
  return { useAthleteNameLookup };
};

export default useAthleteLookup;
