import {
  Table,
  Checkbox,
  Typography,
  Box,
  Button,
  iconButtonClasses,
  Input,
} from "@mui/joy";
import { Key, useCallback } from "react";
import { Action } from "./GenericResponsiveDatagrid";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
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
}

const PageControll = (props: {
  currentPage: number;
  setCurrentPage: (changePage: (currPage: number) => number) => void;
  elementsPerPage: number;
  rowCount: number;
  setElementsPerPage: (elementsPerPage: number) => void;
  showPreviousAndNextButtons: boolean;
}) => {
  const getPageCount = useCallback(
    () => Math.ceil(props.rowCount / props.elementsPerPage),
    [props.rowCount, props.elementsPerPage],
  );

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

  const PageButton = (pageButtonProps: { page: number }) => (
    <Button
      size="sm"
      variant={"outlined"}
      color="neutral"
      key={"pageButton" + pageButtonProps.page}
      aria-pressed={pageButtonProps.page == props.currentPage}
      onClick={() => props.setCurrentPage(() => pageButtonProps.page)}
      sx={{
        width: "2rem",
      }}
    >
      {pageButtonProps.page + 1}
    </Button>
  );

  const pageButtonMapping = (page: number, index: number, array: number[]) => (
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
      <PageButton page={page} />
    </>
  );

  return (
    <Box
      className="Pagination-laptopUp"
      sx={{
        pt: 2,
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
        >
          Previous
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
          {getVisiblePageButtonsLeftSide().map(pageButtonMapping)}
        </Box>
        <PageButton page={props.currentPage} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            width: "45%",
          }}
        >
          {getVisiblePageButtonsRightSide().map(pageButtonMapping)}
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />
      <Input
        type={"tel"}
        onChange={(e) =>
          e.target.value != "" &&
          e.target.value != "0" &&
          props.setElementsPerPage(parseInt(e.target.value))
        }
        defaultValue={props.elementsPerPage}
        size="md"
        sx={{
          width: 40,
          padding: 0,
          textAlign: "center",
        }}
        slotProps={{ input: { min: 0, style: { textAlign: "center" } } }}
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
        >
          Next
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
}) => {
  return (
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      sx={{
        "--TableCell-headBackground": "var(--joy-palette-background-level1)",
        "--Table-headerUnderlineThickness": "1px",
        "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
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
                  props.selected.length > 0 &&
                  props.selected.length !== props.renderedPage.length
                }
                checked={
                  props.selected.length === props.renderedPage.length &&
                  props.renderedPage.length !== 0
                }
                onChange={(event) => {
                  props.setSelected((prevSelected: Key[]) =>
                    event.target.checked
                      ? [
                          ...prevSelected,
                          ...props.renderedPage.map(props.keyOf),
                        ]
                      : [],
                  );
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
        {props.renderedPage.map((row) => (
          <tr key={props.keyOf(row)}>
            {props.itemSelectionActions ? (
              <td style={{ textAlign: "center", width: 120 }}>
                <Checkbox
                  size="sm"
                  checked={props.selected.includes(props.keyOf(row))}
                  color={
                    props.selected.includes(props.keyOf(row))
                      ? "primary"
                      : undefined
                  }
                  onChange={(event) => {
                    props.setSelected((ids) =>
                      event.target.checked
                        ? ids.concat(props.keyOf(row))
                        : ids.filter((itemId) => itemId !== props.keyOf(row)),
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
                <RowMenu item={row} actionMenu={props.actionMenu} />
              </td>
            ) : (
              <></>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export { PageControll };
export default FullScreenTable;
