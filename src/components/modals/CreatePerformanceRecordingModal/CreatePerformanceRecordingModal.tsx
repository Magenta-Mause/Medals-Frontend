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
  Divider,
} from "@mui/joy";
import { useTypedSelector } from "@stores/rootReducer";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import GenericModal from "../GenericModal";
import AthleteDetailHeader from "@components/AthleteDetailHeader/AthleteDetailHeader";
import { isDisciplineInvalid } from "@utils/disciplineValidationUtil";

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

  // Sort disciplines within each category
  const sortedDisciplines = useMemo(() => {
    // No need to sort the entire list - we'll let the groupBy function handle the categories
    // But we need to sort within each category when displaying
    return [...disciplines].sort((a, b) => {
      const categoryComparison = a.category.localeCompare(b.category);
      if (categoryComparison !== 0) return categoryComparison;

      const isAInvalid = isDisciplineInvalid(
        a,
        selectedAthlete,
        selectedDate?.year(),
        ratingMetrics,
      );
      const isBInvalid = isDisciplineInvalid(
        b,
        selectedAthlete,
        selectedDate?.year(),
        ratingMetrics,
      );

      if (isAInvalid && !isBInvalid) return 1;
      if (!isAInvalid && isBInvalid) return -1;

      return a.name.localeCompare(b.name);
    });
  }, [disciplines, selectedAthlete, selectedDate, ratingMetrics]);

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
            options={sortedDisciplines}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(d) =>
              t("disciplines.categories." + d.category.toUpperCase() + ".label")
            }
            renderGroup={(params) => {
              const children = params.children
                ? Array.isArray(params.children)
                  ? params.children
                  : [params.children]
                : [];

              const validOptions: React.ReactNode[] = [];
              const invalidOptions: React.ReactNode[] = [];

              children.forEach((child) => {
                if (React.isValidElement(child)) {
                  const typedChild = child as React.ReactElement<{
                    disabled?: boolean;
                  }>;
                  if (typedChild.props.disabled) {
                    invalidOptions.push(child);
                  } else {
                    validOptions.push(child);
                  }
                }
              });

              return (
                <li key={params.key}>
                  <div
                    style={{
                      paddingLeft: 19,
                      margin: 2,
                      fontWeight: 600,
                      fontSize: "0.75em",
                      opacity: 0.7,
                    }}
                  >
                    {params.group.toUpperCase()}
                  </div>
                  <Divider
                    sx={{
                      marginInline: 2,
                    }}
                  />
                  <ul style={{ paddingLeft: 8, margin: 0 }}>
                    {[...validOptions, ...invalidOptions].map((option) =>
                      React.isValidElement(option)
                        ? React.cloneElement(option, {
                            ...option.props,
                            style: {
                              ...(option.props.style || {}),
                              paddingLeft: 12,
                            },
                          })
                        : option,
                    )}
                  </ul>
                </li>
              );
            }}
            getOptionLabel={(d: Discipline) => d.name}
            getOptionDisabled={(discipline) =>
              isDisciplineInvalid(
                discipline,
                selectedAthlete,
                selectedDate?.year(),
                ratingMetrics,
              )
            }
            error={isDisciplineInvalid(
              discipline,
              selectedAthlete,
              selectedDate?.year(),
              ratingMetrics,
            )}
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

        <Button
          type={"submit"}
          disabled={
            loading ||
            selectedDiscipline == null ||
            selectedAthlete == null ||
            selectedDate == null ||
            value == null ||
            value == "" ||
            isDisciplineInvalid(
              discipline,
              selectedAthlete,
              selectedDate?.year(),
              ratingMetrics,
            )
          }
        >
          {!loading ? t("generic.submit") : t("generic.loading")}
        </Button>
      </form>
    </GenericModal>
  );
};

export default CreatePerformanceRecordingModal;
