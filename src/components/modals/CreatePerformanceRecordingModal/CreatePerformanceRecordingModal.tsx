import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import {
  Athlete,
  Discipline,
  DisciplineRatingMetric,
  PerformanceRecordingCreationDto,
} from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import {
  Autocomplete,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";
import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";

interface CreatePerformanceRecordingElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  rating_value: HTMLInputElement;
}

const CreatePerformanceRecordingModal = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  athlete?: Athlete;
  discipline?: Discipline;
}) => {
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const athletes = useTypedSelector(
    (state) => state.athletes.data,
  ) as Athlete[];
  const ratingMetrics = useTypedSelector(
    (state) => state.disciplineMetrics.data,
  ) as DisciplineRatingMetric[];
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(
    null,
  );
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(
    props.athlete ?? null,
  );
  const [discipline, setDiscipline] = useState<Discipline | null>(
    props.discipline ?? null,
  );
  const [selectedDate, setDate] = useState<Dayjs | null>(dayjs());
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const { t } = useTranslation();
  const { createPerformanceRecording } = useApi();

  const isDisciplineInvalid = useCallback(
    (discipline: Discipline | null) => {
      if (!selectedDate || !discipline || !selectedAthlete) {
        return false;
      }
      const age =
        selectedDate.year() -
        new Date(Date.parse(selectedAthlete.birthdate)).getFullYear();
      return (
        ratingMetrics.filter(
          (metric) =>
            metric.discipline.id == discipline.id &&
            metric.end_age >= age &&
            metric.start_age <= age &&
            (selectedAthlete.gender == "FEMALE"
              ? metric.rating_female != null
              : metric.rating_male != null),
        ).length <= 0
      );
    },
    [selectedAthlete, selectedDate, ratingMetrics],
  );

  useEffect(() => {
    if (props.discipline !== undefined) {
      setSelectedDiscipline(props.discipline.id);
      setDiscipline(props.discipline);
    }
  }, [props.discipline]);

  useEffect(() => {
    if (!props.open) {
      setSelectedDiscipline(props.discipline?.id ?? null);
    }
  }, [props.open, props.discipline]);

  useEffect(() => {
    setDiscipline(disciplines.filter((d) => d.id == selectedDiscipline)[0]);
  }, [selectedDiscipline, setDiscipline, disciplines]);

  const submitPerformanceRecording = async (
    p: PerformanceRecordingCreationDto,
  ) => {
    setLoading(true);
    try {
      if (!(await createPerformanceRecording(p))) {
        throw Error("Error while submitting performance recording");
      } else {
        enqueueSnackbar(t("snackbar.performanceRecording.creationSuccess"), {
          variant: "success",
        });
        setLoading(false);
        props.setOpen(false);
      }
    } catch {
      enqueueSnackbar(t("snackbar.performanceRecording.creationError"), {
        variant: "error",
      });
      setLoading(false);
    }
  };

  return (
    <GenericModal
      header={t("components.createPerformanceRecordingModal.header")}
      open={props.open}
      setOpen={props.setOpen}
      disableEscape
      modalDialogSX={{
        width: { md: "500px", xs: "90vw" },
      }}
    >
      <form
        onSubmit={(e: React.FormEvent<CreatePerformanceRecordingElement>) => {
          e.preventDefault();
          submitPerformanceRecording({
            athlete_id: selectedAthlete!.id!,
            rating_value: parseFloat(
              e.currentTarget.elements.rating_value.value.replace(",", "."),
            ),
            discipline_id: discipline!.id,
            date_of_performance: selectedDate!.unix() * 1000,
          });
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        <FormControl>
          <FormLabel>
            {t("components.createPerformanceRecordingModal.form.athlete")}
          </FormLabel>
          <Autocomplete
            onChange={(_e, newVal: Athlete | null) =>
              setSelectedAthlete(newVal ?? null)
            }
            defaultValue={props.athlete}
            autoSelect
            placeholder={t(
              "components.createPerformanceRecordingModal.form.athlete",
            )}
            options={athletes}
            getOptionLabel={(a: Athlete) => a.first_name + " " + a.last_name}
            slotProps={{
              listbox: { sx: { maxHeight: 200 } },
            }}
          />
        </FormControl>
        <AthleteDetailHeader athlete={selectedAthlete} scalingFactor={2} />

        <FormControl>
          <FormLabel>
            {t("components.createPerformanceRecordingModal.form.discipline")}
          </FormLabel>
          <Autocomplete
            onChange={(_e, newVal: Discipline | null) =>
              setSelectedDiscipline(newVal?.id ?? null)
            }
            defaultValue={props.discipline}
            placeholder={t(
              "components.createPerformanceRecordingModal.form.discipline",
            )}
            options={disciplines}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(d: Discipline) => d.name}
            getOptionDisabled={(discipline) => isDisciplineInvalid(discipline)}
            error={isDisciplineInvalid(discipline)}
            aria-errormessage={"Discipline not valid"}
          />
        </FormControl>
        <FormControl>
          <FormLabel>
            {t("components.createPerformanceRecordingModal.form.amount")}
          </FormLabel>
          <Input
            disabled={!selectedDiscipline}
            placeholder={t(
              "components.createPerformanceRecordingModal.form.amount",
            )}
            type={"number"}
            slotProps={{ input: { step: "any" } }}
            endDecorator={discipline ? t("units." + discipline.unit) : ""}
            name="rating_value"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>
            {t(
              "components.createPerformanceRecordingModal.form.dateOfRecording",
            )}
          </FormLabel>
          <CustomDatePicker
            sx={{ width: "10%" }}
            error={false}
            value={selectedDate}
            onChange={(val) => {
              setDate(dayjs(val));
            }}
            format={undefined}
          />
          <FormLabel>
            <Typography fontSize={15} color="neutral">
              {t(
                "components.createPerformanceRecordingModal.form.ageAtRecording",
              )}
              {selectedDate && selectedAthlete
                ? selectedDate.year() >
                  new Date(Date.parse(selectedAthlete.birthdate)).getFullYear()
                  ? selectedDate.year() -
                    new Date(
                      Date.parse(selectedAthlete.birthdate),
                    ).getFullYear()
                  : t("generic.invalid")
                : "-"}
            </Typography>
          </FormLabel>
        </FormControl>

        <Button
          type={"submit"}
          disabled={
            loading ||
            selectedDiscipline == null ||
            selectedAthlete == null ||
            selectedDate == null ||
            value == null ||
            value == "" ||
            isDisciplineInvalid(discipline)
          }
        >
          {!loading ? t("generic.submit") : t("generic.loading")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreatePerformanceRecordingModal;
