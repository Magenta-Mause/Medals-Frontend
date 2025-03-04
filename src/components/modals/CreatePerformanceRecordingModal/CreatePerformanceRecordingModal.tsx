import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import {
  Athlete,
  Discipline,
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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";

interface CreatePerformanceRecordingElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  rating_value: HTMLInputElement;
}

const CreatePerformanceRecordingModal = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  athlete: Athlete;
  defaultSelected?: Discipline;
}) => {
  const disciplines = useTypedSelector(
    (state) => state.disciplines.data,
  ) as Discipline[];
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(
    null,
  );
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const { t } = useTranslation();
  const { createPerformanceRecording } = useApi();

  useEffect(() => {
    if (props.defaultSelected !== undefined) {
      setSelectedDiscipline(props.defaultSelected.id);
      setDiscipline(props.defaultSelected);
    }
  }, [props.defaultSelected]);

  useEffect(() => {
    if (!props.open) {
      setSelectedDiscipline(props.defaultSelected?.id ?? null);
    }
  }, [props.open, props.defaultSelected]);

  useEffect(() => {
    setDiscipline(disciplines.filter((d) => d.id == selectedDiscipline)[0]);
  }, [selectedDiscipline, setDiscipline, disciplines]);
  const [selectedDate, setDate] = useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
      modalSX={{ backdropFilter: "blur(0px)" }}
      modalDialogSX={{
        width: { md: "calc(30vw - var(--Sidebar-width))", xs: "90vw" },
      }}
    >
      <form
        onSubmit={(e: React.FormEvent<CreatePerformanceRecordingElement>) => {
          e.preventDefault();
          submitPerformanceRecording({
            athlete_id: props.athlete.id!,
            rating_value: parseInt(e.currentTarget.elements.rating_value.value),
            discipline_id: discipline!.id,
            date_of_performance: selectedDate!,
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
            {t("components.createPerformanceRecordingModal.form.discipline")}
          </FormLabel>
          <Autocomplete
            onChange={(_e, newVal: Discipline | null) =>
              setSelectedDiscipline(newVal?.id ?? null)
            }
            defaultValue={props.defaultSelected}
            autoSelect
            placeholder={t(
              "components.createPerformanceRecordingModal.form.discipline",
            )}
            options={disciplines}
            getOptionLabel={(d: Discipline) => d.name}
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
            type={"tel"}
            endDecorator={discipline ? t("units." + discipline.unit) : ""}
            name="rating_value"
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
            value={undefined}
            onChange={(val) => {
              const date = new Date(val.year(), val.month(), val.day());
              setDate(date.getTime());
            }}
            format={undefined}
          />
          <FormLabel>
            <Typography fontSize={15} pt={1} color="neutral">
              {t(
                "components.createPerformanceRecordingModal.form.ageAtRecording",
              )}
              {selectedDate
                ? new Date(selectedDate).getFullYear() >
                  new Date(Date.parse(props.athlete.birthdate)).getFullYear()
                  ? new Date(selectedDate).getFullYear() -
                    new Date(Date.parse(props.athlete.birthdate)).getFullYear()
                  : t("generic.invalid")
                : "-"}
            </Typography>
          </FormLabel>
        </FormControl>
        <Button type={"submit"} disabled={loading}>
          {!loading ? "Submit" : "Loading"}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreatePerformanceRecordingModal;
