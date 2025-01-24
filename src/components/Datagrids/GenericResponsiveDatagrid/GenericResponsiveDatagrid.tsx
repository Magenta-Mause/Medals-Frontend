import {
  Done,
  FilterAlt,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  MoreHorizRounded,
  Search,
} from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import {
  Box,
  Typography,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  FormControl,
  FormLabel,
  Checkbox,
  iconButtonClasses,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Table,
  Select,
  Option,
  ColorPaletteProp,
  ListItemButtonPropsColorOverrides,
  ToggleButtonGroup,
  ButtonGroup,
  ButtonPropsVariantOverrides,
  VariantProp,
} from "@mui/joy";
import React, {
  Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Athlete } from "@types/bffTypes";

const DEFAULT_MAX_VISIBLE_ON_PAGE = 5;

const COLUMN_SIZES = {
  xs: 70,
  s: 120,
  m: 150,
  l: 200,
  xl: 250,
};

export interface Column<T> {
  columnName: string;
  columnMapping: (item: T) => React.ReactNode;
  sortable?: boolean;
  size?: keyof typeof COLUMN_SIZES;
}

interface FilterValue {
  displayValue: React.ReactNode;
  value: string;
}

export interface Filter<T> {
  name: string;
  apply: (filterParameter: string) => (item: T) => boolean;
  type: "TEXT" | "SELECTION" | "TOGGLE";
  selection?: (string | FilterValue)[];
  label?: string;
}

export interface Action<T> {
  label: React.ReactNode;
  key: string;
  operation: (item: T) => void;
  color?: OverridableStringUnion<
    ColorPaletteProp,
    ListItemButtonPropsColorOverrides
  >;
  variant?: OverridableStringUnion<VariantProp, ButtonPropsVariantOverrides>;
}

interface GenericResponsiveDatagridProps<T> {
  data: T[];
  columns: Column<T>[];
  filters: Filter<T>[];
  athletes: Athlete[];
  isLoading: boolean;
  actionMenu?: Action<T>[];
  itemSelectionActions?: Action<T>[];
  keyOf: (item: T) => Key;
  elementsPerPage?: number;
}

const FilterComponent = <T,>(props: {
  filters: Filter<T>[];
  setFilter: (
    key: string,
    value: string | ((oldVal: string) => string),
  ) => void;
  filterValues: Record<string, string>;
}) => {
  return (
    <React.Fragment>
      {props.filters.map((filter) => (
        <FormControl size="sm" key={filter.name}>
          <FormLabel>{filter.name}</FormLabel>
          {filter.type == "SELECTION" ? (
            <Select
              size="sm"
              placeholder={filter.label ?? "All"}
              onChange={(event, newValue) => {
                props.setFilter(filter.name, newValue as string);
              }}
              value={props.filterValues[filter.name]}
            >
              {filter.selection?.map((value) => {
                if (value instanceof String) {
                  return (
                    <Option value={value} key={value as string}>
                      <>{value}</>
                    </Option>
                  );
                }
                return (
                  <Option
                    value={(value as FilterValue).value}
                    key={(value as FilterValue).value}
                  >
                    {(value as FilterValue).displayValue}
                  </Option>
                );
              })}
            </Select>
          ) : filter.type == "TOGGLE" ? (
            <ToggleButtonGroup
              value={[props.filterValues[filter.name] == "1" ? "button" : ""]}
              onChange={(_event, newValue) => {
                console.log(newValue);
                if (newValue.includes("button")) {
                  props.setFilter(filter.name, "1");
                } else {
                  props.setFilter(filter.name, "0");
                }
              }}
            >
              <Button sx={{ flexGrow: 1 }} value="button">
                {filter.label}
              </Button>
            </ToggleButtonGroup>
          ) : (
            <FormControl sx={{ flex: 1 }} size="sm">
              <Input
                size="sm"
                placeholder={filter.label ?? "Search"}
                startDecorator={<Search />}
                onChange={(event) => {
                  props.setFilter(
                    filter.name,
                    (oldValue) => event.target.value,
                  );
                }}
              />
            </FormControl>
          )}
        </FormControl>
      ))}
    </React.Fragment>
  );
};

const PageControll = (props: {
  currentPage: number;
  setCurrentPage: (changePage: (currPage: number) => number) => void;
  elementsPerPage: number;
  rowCount: number;
  setElementsPerPage: (elementsPerPage: number) => void;
}) => {
  const currentPageInputRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      className="Pagination-laptopUp"
      sx={{
        pt: 2,
        gap: 1,
        [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        disabled={props.currentPage <= 0}
        onClick={() => props.setCurrentPage((currPage) => currPage - 1)}
        startDecorator={<KeyboardArrowLeft />}
      >
        Previous
      </Button>

      <Box sx={{ flex: 1 }} />
      {Array.from(
        { length: Math.ceil(props.rowCount / props.elementsPerPage) },
        (v, k) => k + 1,
      ).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={Number(page) ? "outlined" : "plain"}
          color="neutral"
          aria-pressed={page - 1 == props.currentPage}
          onClick={() => props.setCurrentPage(() => page - 1)}
        >
          {page}
        </Button>
      ))}

      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          ml: 3
        }}
      >
        <Input
          type={"tel"}
          onChange={(e) => e.target.value != "" && props.setElementsPerPage(parseInt(e.target.value))}
          defaultValue={props.elementsPerPage}
          size="md"
          sx={{
            width: 40,
            padding: 0,
            textAlign: "center",
          }}
          slotProps={{ input: { min: 0, style: { textAlign: "center" } } }}
        />
        / {props.rowCount}
      </Typography>

      <Box sx={{ flex: 1 }} />
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        endDecorator={<KeyboardArrowRight />}
        disabled={
          props.currentPage >=
          Math.ceil(props.rowCount / props.elementsPerPage) - 1
        }
        onClick={() => {
          props.setCurrentPage((currPage) => currPage + 1);
        }}
      >
        Next {props.rowCount}
      </Button>
    </Box>
  );
};

const GenericResponsiveDatagrid = <T,>(
  props: GenericResponsiveDatagridProps<T>,
) => {
  const [selected, setSelected] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [elementsPerPage, setElementsPerPage] = useState(
    props.elementsPerPage ?? DEFAULT_MAX_VISIBLE_ON_PAGE,
  );

  const cleanupSelection = useCallback(() => {
    const newSelected = selected.filter(
      (key) => props.data.findIndex((item) => props.keyOf(item) == key) != -1,
    );
    if (newSelected.length != selected.length) {
      setSelected(newSelected);
    }
  }, [selected, props]);

  useEffect(() => {
    cleanupSelection();
  }, [props, selected, cleanupSelection]);

  const triggerActionForSelected = useCallback(
    (action: (item: T) => void) => {
      props.data
        .filter((item) => selected.includes(props.keyOf(item)))
        .forEach((item) => action(item));
    },
    [selected, props],
  );

  const getFilteredContent = useCallback(() => {
    return props.data.filter((item) =>
      props.filters.reduce<Boolean>(
        (previousValue, currentFilter) =>
          previousValue &&
          currentFilter.apply(filterValues[currentFilter.name] ?? "")(item),
        true,
      ),
    );
  }, [filterValues, props.data]);

  const getRenderedPage = useCallback(() => {
    console.log(
      getFilteredContent(),
      currentPage * elementsPerPage,
      (currentPage + 1) * elementsPerPage,
    );
    return getFilteredContent().slice(
      currentPage * elementsPerPage,
      (currentPage + 1) * elementsPerPage,
    );
  }, [currentPage, elementsPerPage, getFilteredContent]);

  useEffect(() => {
    console.log(getRenderedPage());
  }, [currentPage, getRenderedPage]);

  const setFilter = (
    key: string,
    value: string | ((prevState: string) => string),
  ) => {
    if (typeof value == "string") {
      setFilterValues((oldValue) => {
        return { ...oldValue, [key]: value };
      });
    } else {
      setFilterValues((oldValue) => {
        return { ...oldValue, [key]: value(oldValue[key]) };
      });
    }
  };

  const RowMenu = (rowMenuProps: { item: T }) => {
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: Button }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
          sx={{
            backgroundColor: "rgba(0, 0, 0, .1)",
          }}
        >
          <MoreHorizRounded />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          {props.actionMenu?.map((action) => (
            <MenuItem
              color={action.color ?? "neutral"}
              onClick={() => action.operation(rowMenuProps.item)}
              key={action.key}
            >
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      </Dropdown>
    );
  };

  useEffect(() => {
    console.log("rerender");
    console.log(getFilteredContent());
  }, [props.filters, getFilteredContent]);

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
          minHeight: "100dvh",
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<Search />}
          sx={{ flexGrow: 1 }}
        />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAlt />
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="center">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FilterComponent
                filters={props.filters}
                setFilter={setFilter}
                filterValues={filterValues}
              />
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FilterComponent
          filters={props.filters}
          setFilter={setFilter}
          filterValues={filterValues}
        />
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              {props.itemSelectionActions ? (
                <th
                  style={{
                    width: 48,
                    textAlign: "center",
                    padding: "12px 6px",
                  }}
                >
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length !== props.data.length
                    }
                    checked={selected.length === props.data.length}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked ? props.data.map(props.keyOf) : [],
                      );
                    }}
                    color={
                      selected.length > 0 ||
                      selected.length === props.data.length
                        ? "primary"
                        : undefined
                    }
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </th>
              ) : (
                <></>
              )}
              {props.columns.map((column) => (
                <th
                  style={{
                    width: column.size ? COLUMN_SIZES[column.size] : 150,
                    padding: "12px 6px",
                  }}
                  key={column.columnName}
                >
                  <Typography sx={{ paddingLeft: 2 }}>
                    {column.columnName}
                  </Typography>
                </th>
              ))}
              {props.actionMenu ? (
                <th
                  style={{
                    width: 80,
                  }}
                ></th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {getRenderedPage().map((row) => (
              <tr key={props.keyOf(row)}>
                {props.itemSelectionActions ? (
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(props.keyOf(row))}
                      color={
                        selected.includes(props.keyOf(row))
                          ? "primary"
                          : undefined
                      }
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(props.keyOf(row))
                            : ids.filter(
                                (itemId) => itemId !== props.keyOf(row),
                              ),
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                ) : (
                  <></>
                )}
                {props.columns.map((column) => (
                  <td key={column.columnName}>
                    <Typography
                      level="body-xs"
                      sx={{
                        padding: 1,
                        paddingLeft: 2,
                        alignContent: "center",
                        display: "flex",
                      }}
                    >
                      {column.columnMapping(row as T)}
                    </Typography>
                  </td>
                ))}
                {props.actionMenu ? (
                  <td>
                    <RowMenu item={row as unknown as T} />
                  </td>
                ) : (
                  <></>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      {props.itemSelectionActions ? (
        <Box
          className="ActionButtonGroup-bottom"
          sx={{
            display: "flex",
          }}
        >
          <ButtonGroup>
            {props.itemSelectionActions.map((action) => (
              <Button
                color={action.color ?? "neutral"}
                onClick={() => triggerActionForSelected(action.operation)}
                key={action.key}
                disabled={selected.length == 0}
                variant={action.variant ?? "outlined"}
              >
                {action.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      ) : (
        <></>
      )}
      <Sheet
        sx={{
          flex: "1 1 auto",
          background: "transparent",
        }}
      ></Sheet>
      <PageControll
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        elementsPerPage={elementsPerPage}
        rowCount={getFilteredContent().length}
        setElementsPerPage={setElementsPerPage}
      />
    </React.Fragment>
  );
};

export default GenericResponsiveDatagrid;
