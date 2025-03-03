import CustomDatePicker from "@components/CustomDatePicker/CustomDatePicker";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
  PerformanceRecordingCreationDto,
} from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  onCreatePerformanceRecording: (p: PerformanceRecording) => void;
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

  const submitPerformanceRecording = async (
    p: PerformanceRecordingCreationDto,
  ) => {
    try {
      if (! await careatePerformanceRecording(p)) {
        throw Error("Error while submitting performance recording");
      } else {
        enqueueSnackbar(t("snackbar.performanceRecording.creationSuccess"), {
          variant: "success",
        });
      }
    } catch {
      enqueueSnackbar(t("snackbar.performanceRecording.creationError"), {
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      sx={{
        left: {
          md: "var(--Sidebar-width)",
          sm: "0",
        },
      }}
    >
      <ModalDialog
        sx={{
          width: { md: "calc(30vw - var(--Sidebar-width))", xs: "90vw" },
          overflowY: "auto",
        }}
      >
        <ModalClose />
        <Typography>
          {t("components.createPerformanceRecordingModal.header")}
        </Typography>
        <Divider inset="none" sx={{ marginBottom: 1 }} />
        <form
          onSubmit={(e: React.FormEvent<CreatePerformanceRecordingElement>) => {
            e.preventDefault();
            submitPerformanceRecording({
              athlete_id: props.athlete.id,
              rating_value: parseInt(
                e.currentTarget.elements.rating_value.value,
              ),
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
            <Select
              onChange={(_e, newVal) => setSelectedDiscipline(newVal)}
              defaultValue={props.defaultSelected?.id}
              placeholder={t(
                "components.createPerformanceRecordingModal.form.discipline",
              )}
            >
              {disciplines.map((d) => (
                <Option value={d.id} key={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
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
          </FormControl>
          <Button type={"submit"}>Submit</Button>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default CreatePerformanceRecordingModal;
