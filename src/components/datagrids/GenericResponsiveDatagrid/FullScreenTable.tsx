import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  iconButtonClasses,
  Input,
  Table,
  Typography,
} from "@mui/joy";
import { Key, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Action } from "./GenericResponsiveDatagrid";
import RowMenu from "./RowMenu";

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
  disableSpan?: boolean;
}

const PageButton = (props: {
  page: number;
  setCurrentPage: (callback: (prevPage: number) => number) => void;
  currentPage: number;
}) => (
  <Button
    size="sm"
    variant={"outlined"}
    color="neutral"
    key={"pageButton" + props.page}
    aria-pressed={props.page == props.currentPage}
    onClick={() => props.setCurrentPage(() => props.page)}
    sx={{
      width: "2rem",
    }}
  >
    {props.page + 1}
  </Button>
);

const PageButtonMapping = (props: {
  page: number;
  index: number;
  array: number[];
  setPage: (callback: (prevPage: number) => number) => void;
  currentPage: number;
}) => {
  const { page, index, array } = props;

  return (
    <>
      {index > 0 && array[index - 1] != page - 1 ? (
        <Typography
          key={"divider " + page}
          color={"neutral"}
          sx={{ pl: 1, pr: 1, userSelect: "none" }}
        >
          ...
        </Typography>
      ) : (
        <></>
      )}
      <PageButton
        page={page}
        key={"button " + page}
        setCurrentPage={props.setPage}
        currentPage={props.currentPage}
      />
    </>
  );
};

const PageControl = (props: {
  currentPage: number;
  setCurrentPage: (changePage: (currPage: number) => number) => void;
  elementsPerPage: number;
  rowCount: number;
  setElementsPerPage: (elementsPerPage: number) => void;
  showPreviousAndNextButtons: boolean;
}) => {
  const pageSizeInputRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const getPageCount = useCallback(
    () => Math.ceil(props.rowCount / props.elementsPerPage),
    [props.rowCount, props.elementsPerPage],
  );

  useEffect(() => {
    pageSizeInputRef.current!.getElementsByTagName("input")[0].value =
      props.elementsPerPage.toString();
  }, [props.elementsPerPage]);

  const getVisiblePageButtonsLeftSide = useCallback(() => {
    const visibleButtons = new Set([0, 1]);
    visibleButtons.add(props.currentPage - 1);
    return Array.from(visibleButtons)
      .filter(
        (button) =>
          button >= 0 &&
          button <= getPageCount() - 1 &&
          button < props.currentPage,
      )
      .sort((a, b) => a - b);
  }, [getPageCount, props.currentPage]);

  const getVisiblePageButtonsRightSide = useCallback(() => {
    const visibleButtons = new Set([getPageCount() - 2, getPageCount() - 1]);
    visibleButtons.add(props.currentPage + 1);
    return Array.from(visibleButtons)
      .filter(
        (button) =>
          button >= 0 &&
          button <= getPageCount() - 1 &&
          button > props.currentPage,
      )
      .sort((a, b) => a - b);
  }, [getPageCount, props.currentPage]);

  return (
    <Box
      className="Pagination-laptopUp"
      sx={{
        pt: 2,
        pb: 2,
        gap: 1,
        [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
        display: {
          sm: "flex",
          xs: "none",
        },
      }}
    >
      {props.showPreviousAndNextButtons ? (
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          disabled={props.currentPage <= 0}
          onClick={() => props.setCurrentPage((currPage) => currPage - 1)}
          startDecorator={<KeyboardArrowLeft />}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {t("components.buttons.previous")}
        </Button>
      ) : (
        <></>
      )}

      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "50%" }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            width: "45%",
          }}
        >
          {getVisiblePageButtonsLeftSide().map((page, index, array) => (
            <PageButtonMapping
              page={page}
              index={index}
              array={array}
              setPage={props.setCurrentPage}
              currentPage={props.currentPage}
              key={page}
            />
          ))}
        </Box>
        <PageButton
          page={props.currentPage}
          setCurrentPage={props.setCurrentPage}
          currentPage={props.currentPage}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            width: "45%",
          }}
        >
          {getVisiblePageButtonsRightSide().map((page, index, array) => (
            <PageButtonMapping
              page={page}
              index={index}
              array={array}
              setPage={props.setCurrentPage}
              currentPage={props.currentPage}
              key={page}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />
      <Typography
        color="neutral"
        sx={{ display: "flex", alignItems: "center", userSelect: "none" }}
      >
        {t(
          "components.genericResponsiveDatagrid.fullScreenTable.pageControl.pageSize.label",
        )}
      </Typography>
      <Input
        type={"number"}
        onChange={(e) =>
          e.target.value != "" &&
          e.target.value != "0" &&
          props.setElementsPerPage(parseInt(e.target.value))
        }
        defaultValue={props.elementsPerPage}
        ref={pageSizeInputRef}
        sx={{
          width: 40,
          p: 0,
          pl: 1,
          pr: 1,
          textAlign: "left",
        }}
        slotProps={{ input: { min: 0, style: { textAlign: "left" } } }}
      />
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        / {props.rowCount}
      </Typography>

      <Typography
        color="neutral"
        sx={{ userSelect: "none", display: "flex", alignItems: "center" }}
      >
        {t(
          "components.genericResponsiveDatagrid.fullScreenTable.pageControl.pageSize.inputPostfix",
        )}
      </Typography>

      {props.showPreviousAndNextButtons ? (
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
          sx={{
            ml: 5,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {t("components.buttons.next")}
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
};

const FullScreenTable = <T,>(props: {
  itemSelectionActions?: Action<T>[];
  actionMenu?: Action<T>[];
  selected: Key[];
  renderedPage: T[];
  setSelected: (callback: (prevState: Key[]) => Key[]) => void;
  columns: Column<T>[];
  keyOf: (item: T) => Key;
  rowOnClick?: (item: T) => void;
  allItems: T[];
}) => {
  const { t } = useTranslation();

  return (
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      sx={{
        "--TableCell-headBackground": "var(--joy-palette-background-level1)",
        "--Table-headerUnderlineThickness": "1px",
        "--TableCell-paddingY": "4px",
        "--TableCell-paddingX": "8px",
        "--TableRow-hoverBackground":
          props.rowOnClick && props.renderedPage.length > 0
            ? "var(--joy-palette-background-level1)"
            : "var(--joy-palette-background-surface)",
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
                  props.selected.length > 0 &&
                  props.selected.length !== props.allItems.length
                }
                checked={
                  props.selected.length === props.allItems.length &&
                  props.allItems.length !== 0
                }
                onChange={(event) => {
                  if (props.selected.length >= props.allItems.length) {
                    props.setSelected(() => []);
                  } else {
                    props.setSelected(() =>
                      event.target.checked
                        ? props.allItems.map(props.keyOf)
                        : [],
                    );
                  }
                }}
                color={
                  props.selected.length > 0 ||
                  props.selected.length === props.renderedPage.length
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
              key={column.columnName}
              style={{
                width: column.size ? COLUMN_SIZES[column.size] : 150,
                padding: "12px 6px",
                whiteSpace: "normal",       // Allow text to wrap
                wordBreak: "break-word",    // Break long words if needed
              }}
            >
              <Typography
                sx={{ paddingLeft: column.disableSpan ? 0 : 2, width: "100%" }}
              >
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
      <tbody
        style={{
          position: "relative",
          height: props.renderedPage.length == 0 ? "50px" : "auto",
        }}
      >
        {props.renderedPage.length == 0 ? (
          <tr>
            <td
              style={{
                display: "flex",
                height: "50px",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "calc(50%)",
                transform: "translateX(-50%)",
              }}
              colSpan={props.columns.length}
            >
              <Typography color="neutral">
                {t(
                  "components.genericResponsiveDatagrid.fullScreenTable.empty",
                )}
              </Typography>
            </td>
          </tr>
        ) : (
          props.renderedPage.map((row) => (
            <tr
              key={props.keyOf(row)}
              onClick={() => {
                if (props.rowOnClick) {
                  props.rowOnClick(row);
                }
              }}
              style={{
                cursor:
                  props.rowOnClick && props.renderedPage.length > 0
                    ? "pointer"
                    : "inherit",
              }}
            >
              {props.itemSelectionActions ? (
                <td style={{ textAlign: "center", width: 120 }}>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      size="sm"
                      checked={props.selected.includes(props.keyOf(row))}
                      color={
                        props.selected.includes(props.keyOf(row))
                          ? "primary"
                          : undefined
                      }
                      onChange={(event) => {
                        event.stopPropagation();
                        props.setSelected((ids) =>
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
                  </Box>
                </td>
              ) : (
                <></>
              )}
              {props.columns.map((column) => (
                <td key={column.columnName}>
                  {column.disableSpan ? (
                    column.columnMapping(row as T)
                  ) : (
                    <Typography
                      level="body-xs"
                      sx={{
                        padding: 1,
                        paddingLeft: 2,
                        alignContent: "center",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      {column.columnMapping(row as T)}
                    </Typography>
                  )}
                </td>
              ))}
              {props.actionMenu ? (
                <td>
                  <RowMenu item={row} actionMenu={props.actionMenu} />
                </td>
              ) : (
                <></>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export { PageControl as PageControll };
export default FullScreenTable;
