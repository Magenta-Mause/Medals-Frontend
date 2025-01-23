import {
  Done,
  FilterAlt,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  MoreHorizRounded,
  Pageview,
  RunCircle,
  Search,
} from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Link,
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
import React, { Key, useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MAX_VISIBLE_ON_PAGE = 10;

const COLUMN_SIZES = {
  xs: 70,
  s: 120,
  m: 150,
  l: 200,
  xl: 250,
};

export interface Column<T> {
  rowName: string;
  rowMapping: (item: T) => React.ReactNode;
  sortable?: boolean;
  size?: keyof typeof COLUMN_SIZES;
}

interface FilterValue {
  displayValue: React.ReactNode;
  value: string;
}

export interface Filter<T> {
  filterName: string;
  applyFilter: (filterParameter: string) => (item: T) => boolean;
  filterType: "TEXT" | "SELECTION" | "TOGGLE";
  selection?: (string | FilterValue)[];
  filterLabel?: string;
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

const GenericResponsiveDatagrid = <T,>(
  props: GenericResponsiveDatagridProps<T>,
) => {
  const [selected, setSelected] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const currentPageInputRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [elementsPerPage, setElementsPerPage] = useState(
    props.elementsPerPage ?? DEFAULT_MAX_VISIBLE_ON_PAGE,
  );

  const cleanupSelection = useCallback(() => {
    setSelected(
      selected.filter(
        (key) => props.data.findIndex((item) => props.keyOf(item) == key) != -1,
      ),
    );
  }, [selected, props.data]);

  useEffect(() => {
    cleanupSelection();
  }, [props.data, selected]);

  const triggerActionForSelected = useCallback(
    (action: (item: T) => void) => {
      props.data
        .filter((item) => selected.includes(props.keyOf(item)))
        .forEach((item) => action(item));
    },
    [selected],
  );

  const getRenderedPage = useCallback(() => {
    return props.data.slice(
      currentPage * elementsPerPage,
      (currentPage + 1) * elementsPerPage,
    );
  }, [currentPage, props.data, elementsPerPage]);

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
            marginLeft: 2,
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

  const FiltersComponent = () => {
    return (
      <React.Fragment>
        {props.filters.map((filter) => (
          <FormControl size="sm" key={filter.filterName}>
            <FormLabel>{filter.filterName}</FormLabel>
            {filter.filterType == "SELECTION" ? (
              <Select size="sm" placeholder={filter.filterLabel ?? "All"}>
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
            ) : filter.filterType == "TOGGLE" ? (
              <ToggleButtonGroup>
                <Button aria-pressed={true} sx={{ flexGrow: 1 }}>
                  {filter.filterLabel}
                </Button>
              </ToggleButtonGroup>
            ) : (
              <FormControl sx={{ flex: 1 }} size="sm">
                <Input
                  size="sm"
                  placeholder={filter.filterLabel ?? "Search"}
                  startDecorator={<Search />}
                />
              </FormControl>
            )}
          </FormControl>
        ))}
      </React.Fragment>
    );
  };

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
              <FiltersComponent />
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
        <FiltersComponent />
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
                  key={column.rowName}
                >
                  <Typography sx={{ paddingLeft: 2 }}>
                    {column.rowName}
                  </Typography>
                </th>
              ))}
              {props.actionMenu ? (
                <th
                  style={{
                    width: 50,
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
                  <td key={column.rowName}>
                    <Typography
                      level="body-xs"
                      sx={{
                        padding: 1,
                        paddingLeft: 2,
                        alignContent: "center",
                        display: "flex",
                      }}
                    >
                      {column.rowMapping(row as T)}
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
                key={action.operation}
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
          disabled={currentPage <= 0}
          onClick={() => setCurrentPage((currPage) => currPage - 1)}
          startDecorator={<KeyboardArrowLeft />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {Array.from(
          { length: Math.ceil(props.data.length / elementsPerPage) },
          (v, k) => k + 1,
        ).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
            aria-pressed={page - 1 == currentPage}
            onClick={() => setCurrentPage(page - 1)}
          >
            {page}
          </Button>
        ))}

        <Input
          ref={currentPageInputRef}
          type="tel"
          size="md"
          sx={{
            width: 80,
            ml: 3,
          }}
          placeholder={elementsPerPage.toString()}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              setElementsPerPage(
                parseInt(
                  currentPageInputRef.current?.getElementsByTagName("input")[0]
                    .value!,
                ),
              );
            }
          }}
          endDecorator={
            <Button
              onClick={() => {
                setElementsPerPage(
                  parseInt(
                    currentPageInputRef.current?.getElementsByTagName(
                      "input",
                    )[0].value!,
                  ),
                );
              }}
              sx={{
                width: 2,
              }}
            >
              <Done />
            </Button>
          }
        />
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRight />}
          disabled={
            currentPage >= Math.ceil(props.data.length / elementsPerPage) - 1
          }
          onClick={() => {
            setCurrentPage((currPage) => currPage + 1);
          }}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default GenericResponsiveDatagrid;
