import { FilterAlt, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  ButtonPropsVariantOverrides,
  ColorPaletteProp,
  Divider,
  Input,
  ListItemButtonPropsColorOverrides,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Typography,
  VariantProp,
} from "@mui/joy";
import { OverridableStringUnion } from "@mui/types";
import React, { Key, useCallback, useEffect, useState } from "react";
import FilterComponent, {
  Filter,
} from "./GenericResponsiveDatagridFilterComponent";
import FullScreenTable, { Column, PageControll } from "./FullScreenTable";
import MobileTable, { MobileTableRendering } from "./MobileTable";
import useWindowDimensions from "@hooks/useWindowDimensions";

const DEFAULT_MAX_VISIBLE_ON_PAGE = 5;

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
  isLoading: boolean;
  actionMenu?: Action<T>[];
  itemSelectionActions?: Action<T>[];
  keyOf: (item: T) => Key;
  elementsPerPage?: number;
  mobileRendering: MobileTableRendering<T>;
}

const GenericResponsiveDatagrid = <T,>(
  props: GenericResponsiveDatagridProps<T>,
) => {
  const [selected, setSelected] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSizeInternal] = useState(
    props.elementsPerPage ?? DEFAULT_MAX_VISIBLE_ON_PAGE,
  );
  const windowDimensions = useWindowDimensions();
  const [wasPageSizeChanged, setPageSizeChanged] = useState(false);

  const setPageSize = (elementsPerPage: number) => {
    setPageSizeInternal(elementsPerPage);
    setPageSizeChanged(true);
  }

  const cleanupSelection = useCallback(() => {
    const newSelected = selected.filter(
      (key) => props.data.findIndex((item) => props.keyOf(item) == key) != -1,
    );
    if (newSelected.length != selected.length) {
      setSelected(newSelected);
    }
  }, [selected, props]);

  const triggerActionForSelected = useCallback(
    (action: (item: T) => void) => {
      props.data
        .filter((item) => selected.includes(props.keyOf(item)))
        .forEach((item) => action(item));
    },
    [selected, props],
  );

  const getFilteredContent = useCallback(() => {
    return props.data
      .filter((item) =>
        props.filters.reduce<boolean>(
          (previousValue, currentFilter) =>
            previousValue &&
            currentFilter.apply(filterValues[currentFilter.name] ?? "")(item),
          true,
        ),
      )
      .filter(
        props.mobileRendering.searchFilter.apply(
          filterValues[props.mobileRendering.searchFilter.name],
        ),
      );
  }, [
    filterValues,
    props.data,
    props.filters,
    props.mobileRendering.searchFilter,
  ]);

  const getRenderedPage = useCallback(
    () =>
      getFilteredContent().slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize,
      ),
    [currentPage, pageSize, getFilteredContent],
  );

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

  useEffect(() => {
    setCurrentPage(
      Math.max(
        Math.min(
          currentPage,
          Math.ceil(getFilteredContent().length / pageSize) - 1,
        ),
        0,
      ),
    );
  }, [currentPage, getFilteredContent, pageSize]);

  useEffect(() => {
    cleanupSelection();
  }, [props, selected, cleanupSelection]);

  useEffect(() => {
    console.log(windowDimensions, wasPageSizeChanged)
    if (!wasPageSizeChanged) {
      setPageSizeInternal(Math.floor(windowDimensions.height / 95));
      console.log(windowDimensions.height / 50)
    }
  }, [windowDimensions, wasPageSizeChanged]);

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder={
            props.mobileRendering.searchFilter.label ??
            props.mobileRendering.searchFilter.name
          }
          value={filterValues[props.mobileRendering.searchFilter.name]}
          startDecorator={<Search />}
          sx={{ flexGrow: 1 }}
          onChange={(event) => {
            setFilter(
              props.mobileRendering.searchFilter.name,
              event.target.value,
            );
          }}
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
        <FullScreenTable<T>
          itemSelectionActions={props.itemSelectionActions}
          selected={selected}
          renderedPage={getRenderedPage()}
          setSelected={setSelected}
          columns={props.columns}
          keyOf={props.keyOf}
          actionMenu={props.actionMenu}
        />
      </Sheet>

      {props.itemSelectionActions ? (
        <Box
          className="ActionButtonGroup-bottom"
          sx={{
            display: { xs: "none", sm: "flex" },
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

      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileTable<T>
          rows={getRenderedPage()}
          rendering={props.mobileRendering}
          keyOf={props.keyOf}
          currentPage={currentPage}
          setCurrentPage={(callback: (prevNumber: number) => number) => {
            setCurrentPage((prevPage) => callback(prevPage));
          }}
          maxPage={Math.ceil(getFilteredContent().length / pageSize)}
        />
      </Box>

      <Sheet
        sx={{
          flex: "1 1 auto",
          background: "transparent",
        }}
      />
      <PageControll
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        elementsPerPage={pageSize}
        rowCount={getFilteredContent().length}
        setElementsPerPage={setPageSize}
        showPreviousAndNextButtons={false}
      />
    </React.Fragment>
  );
};

export default GenericResponsiveDatagrid;
