import {
  Athlete,
  Discipline,
  PerformanceRecording,
  PerformanceRecordingCreationDto,
} from "@customTypes/backendTypes";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import {  useEffect, useState } from "react";
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

  const createPerformanceRecording = (p: PerformanceRecordingCreationDto) => {};

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
          pt: 6,
          width: { md: "calc(30vw - var(--Sidebar-width))", xs: "90vw" },
          overflowY: "auto",
        }}
      >
        <ModalClose />
        <form
          onSubmit={(e: React.FormEvent<CreatePerformanceRecordingElement>) => {
            createPerformanceRecording({
              athlete_id: props.athlete.id,
              rating_value: parseInt(e.currentTarget.elements.rating_value.value),
              discipline_id: discipline!.id,
              selected_year: 20,
              date_of_performance: 0,
            });
            e.preventDefault();
          }}
        >
          <FormControl>
            <FormLabel>Discipline:</FormLabel>
            <Select
              onChange={(_e, newVal) => setSelectedDiscipline(newVal)}
              defaultValue={props.defaultSelected?.id}
              placeholder={"Discipline"}
            >
              {disciplines.map((d) => (
                <Option value={d.id} key={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Input
              disabled={!selectedDiscipline}
              placeholder="Amount"
              type={"number"}
              endDecorator={discipline ? t("units." + discipline.unit) : ""}
              name="value"
            />
          </FormControl>
          <Button type={"submit"}>Submit</Button>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default CreatePerformanceRecordingModal;
