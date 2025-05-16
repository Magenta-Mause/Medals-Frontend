import useWindowDimensions from "@hooks/useWindowDimensions";
import { FilterAlt, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  ButtonPropsVariantOverrides,
  ColorPaletteProp,
  Divider,
  FormControl,
  FormLabel,
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
import FullScreenTable, { Column, PageControl } from "./FullScreenTable";
import FilterComponent, {
  Filter,
} from "./GenericResponsiveDatagridFilterComponent";
import MobileTable, { MobileTableRendering } from "./MobileTable";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const ESTIMATED_HEIGHT_OF_ROW = 95;
const DEFAULT_MAX_VISIBLE_ON_PAGE = Math.floor(
  window.innerHeight / ESTIMATED_HEIGHT_OF_ROW,
);

export interface Action<T> {
  label: React.ReactNode;
  key: string;
  operation: (item: T) => Promise<void>;
  color?: OverridableStringUnion<
    ColorPaletteProp,
    ListItemButtonPropsColorOverrides
  >;
  variant?: OverridableStringUnion<VariantProp, ButtonPropsVariantOverrides>;
}

export interface ToolbarAction extends Action<null> {
  operation: () => Promise<void>;
  icon?: React.ReactNode;
  collapseToText?: boolean;
  content: React.ReactNode;
  label: string;
}

interface GenericResponsiveDatagridProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: Filter<T>[];
  toolbarActions?: ToolbarAction[];
  isLoading?: boolean;
  actionMenu?: Action<T>[] | ((item: T) => Action<T>[]);
  itemSelectionActions?: Action<T>[];
  keyOf: (item: T) => Key;
  elementsPerPage?: number;
  mobileRendering: MobileTableRendering<T>;
  onItemClick?: (item: T) => void;
  disablePaging?: boolean;
  messageIfNoEntriesFound?: React.ReactNode;
  heightIfNoEntriesFound?: string;
  itemClickableFilter?: (item: T) => boolean;
}

/**
 * GenericResponsiveDatagrid is a reusable and highly customizable React component
 * for rendering a responsive data grid with filtering, pagination, and actions.
 *
 * @template T - The type of data to be displayed in the grid.
 *
 * @param {T[]} data - The array of data items to be rendered in the grid.
 * @param {Column<T>[]} columns - The column definitions for the grid.
 * @param {Filter<T>[]} filters - The filters that can be applied to the data.
 * @param {boolean} isLoading - Indicates whether the data is still being loaded.
 * @param {Action<T>[]} [actionMenu] - Actions available for each row, shown in a dropdown menu.
 * @param {Action<T>[]} [itemSelectionActions] - Actions that can be applied to selected rows.
 * @param {(item: T) => Key} keyOf - Function to derive a unique key for each data item.
 * @param {number} [elementsPerPage=5] - Number of rows to display per page. Defaults to 5.
 * @param {MobileTableRendering<T>} mobileRendering - Configuration for rendering the grid on smaller screens.
 * @param {(item: T) => void} onItemClick - Method which gets called when clicking on a table entry
 * @param {boolean} disablePaging - Disable the "paging" functionality (this will show all entries on one page and disable the page control buttons)
 *
 * @description
 * This component supports:
 * - Mobile and desktop layouts for data display.
 * - Filtering via a modal on mobile or inline for larger screens.
 * - Pagination and dynamic page size adjustment.
 * - Row-level actions and multi-selection actions.
 *
 * Example usage:
 * ```jsx
 * const data = [...]; // Your data array
 * const columns = [...]; // Your column definitions
 * const filters = [...]; // Your filter definitions
 *
 * <GenericResponsiveDatagrid
 *   data={data}
 *   columns={columns}
 *   filters={filters}
 *   isLoading={false}
 *   keyOf={(item) => item.id}
 *   elementsPerPage={10}
 *   mobileRendering={{
 *     searchFilter: { name: "search", label: "Search", apply: (query) => (item) => ... }
 *   }}
 * />
 * ```
 */
const GenericResponsiveDatagrid = <T,>(
  props: GenericResponsiveDatagridProps<T>,
) => {
  const [selected, setSelected] = useState<Key[]>([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSizeInternal] = useState(
    props.elementsPerPage ?? DEFAULT_MAX_VISIBLE_ON_PAGE,
  );
  const windowDimensions = useWindowDimensions();
  const [wasPageSizeChanged, setPageSizeChanged] = useState(false);
  const setPageSize = useCallback(
    (elementsPerPage: number) => {
      setPageSizeInternal(elementsPerPage);
      setPageSizeChanged(true);
    },
    [setPageSizeInternal, setPageSizeChanged],
  );

  const cleanupSelection = useCallback(() => {
    const newSelected = selected.filter(
      (key) => props.data.findIndex((item) => props.keyOf(item) == key) != -1,
    );
    if (newSelected.length != selected.length) {
      setSelected(newSelected);
    }
  }, [selected, props]);

  const getAllSelectedItems = useCallback(() => {
    return props.data.filter((item) => selected.includes(props.keyOf(item)));
  }, [selected, props]);

  const getFilteredContent = useCallback(() => {
    if (
      props.filters == undefined ||
      props.mobileRendering.searchFilter == undefined
    ) {
      return props.data;
    }

    return props.data
      .filter((item) =>
        props.filters!.reduce<boolean>(
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

  const getRenderedPage = useCallback(() => {
    if (props.disablePaging) {
      return getFilteredContent();
    }
    return getFilteredContent().slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize,
    );
  }, [currentPage, getFilteredContent, pageSize, props.disablePaging]);

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
  }, [selected, props, cleanupSelection]);

  useEffect(() => {
    if (!wasPageSizeChanged && !props.elementsPerPage) {
      setPageSizeInternal(
        Math.floor(windowDimensions.height / ESTIMATED_HEIGHT_OF_ROW),
      );
    }
  }, [windowDimensions, wasPageSizeChanged, props.elementsPerPage]);

  return (
    <>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        {props.mobileRendering.searchFilter != undefined ? (
          <Input
            size="sm"
            placeholder={String(
              props.mobileRendering.searchFilter.label ??
                props.mobileRendering.searchFilter.name,
            )}
            value={filterValues[props.mobileRendering.searchFilter.name]}
            startDecorator={<Search />}
            sx={{ flexGrow: 1 }}
            onChange={(event) => {
              setFilter(
                props.mobileRendering.searchFilter!.name,
                event.target.value,
              );
            }}
          />
        ) : (
          <></>
        )}
        {props.filters ? (
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setFilterOpen(true)}
          >
            <FilterAlt />
          </Button>
        ) : (
          <></>
        )}
        <Modal open={isFilterOpen} onClose={() => setFilterOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="center">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {props.filters != undefined ? (
                <>
                  <FilterComponent
                    filters={props.filters}
                    setFilter={setFilter}
                    filterValues={filterValues}
                  />
                  <Button color="primary" onClick={() => setFilterOpen(false)}>
                    {t("generic.confirm")}
                  </Button>
                </>
              ) : (
                <> </>
              )}
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      {props.filters?.length || props.toolbarActions?.length ? (
        <Box
          className="SearchAndFiltersTooltip-tabletUp"
          sx={{
            borderRadius: "sm",
            py: 2,
            display: { xs: "none", sm: "flex" },
            flexWrap: "wrap",
            gap: 1.5,
            "& > *": {
              minWidth: { xs: "120px", md: "100px" },
            },
          }}
        >
          {props.filters ? (
            <FilterComponent
              filters={props.filters}
              setFilter={setFilter}
              filterValues={filterValues}
            />
          ) : (
            <></>
          )}
          {props.toolbarActions ? (
            props.toolbarActions.map((action) => (
              <FormControl size="sm" key={action.key}>
                <FormLabel>{action.label}</FormLabel>
                <Button
                  value="button"
                  size="sm"
                  sx={{ width: action.collapseToText ? "fit-content" : "auto" }}
                  color={action.color ?? "neutral"}
                  onClick={action.operation}
                  key={action.key}
                  variant={action.variant ?? "outlined"}
                  startDecorator={action.icon}
                >
                  {action.content}
                </Button>
              </FormControl>
            ))
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}
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
          rowOnClick={props.onItemClick}
          allItems={props.data}
          messageIfNoEntriesFound={props.messageIfNoEntriesFound}
          heightIfNoEntriesFound={props.heightIfNoEntriesFound}
          itemClickableFilter={props.itemClickableFilter}
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
              <ActionButton
                buttonAction={action}
                disabled={selected.length == 0}
                getSelectedItems={getAllSelectedItems}
                key={action.key}
              />
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
          disablePaging={props.disablePaging ?? false}
        />
      </Box>

      <Sheet
        sx={{
          flex: "1 1 auto",
          background: "transparent",
        }}
      />
      {!props.disablePaging ? (
        <PageControl
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          elementsPerPage={pageSize}
          rowCount={getFilteredContent().length}
          setElementsPerPage={setPageSize}
          showPreviousAndNextButtons={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};

const ActionButton = <T,>(
  props: ButtonProps & {
    buttonAction: Action<T>;
    getSelectedItems: () => T[];
    disabled: boolean;
  },
) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const triggerActionForSelected = async () => {
    setLoading(true);
    const items = props.getSelectedItems();
    for (const item of items) {
      await props.buttonAction.operation(item);
    }
    setLoading(false);
  };

  const propsWithoutStuff: any = { ...props };
  delete propsWithoutStuff.getSelectedItems;
  delete propsWithoutStuff.buttonAction;

  return (
    <Button
      {...propsWithoutStuff}
      color={props.buttonAction.color ?? "neutral"}
      onClick={() => triggerActionForSelected()}
      key={props.buttonAction.key}
      disabled={props.disabled || loading}
      variant={props.buttonAction.variant ?? "outlined"}
    >
      {!loading ? props.buttonAction.label : t("generic.loading")}
    </Button>
  );
};

export default GenericResponsiveDatagrid;
