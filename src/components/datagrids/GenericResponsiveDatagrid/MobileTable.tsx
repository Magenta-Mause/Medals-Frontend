import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { Key, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Action } from "./GenericResponsiveDatagrid";
import { Filter } from "./GenericResponsiveDatagridFilterComponent";
import RowMenu from "./RowMenu";

export interface MobileTableRendering<T> {
  avatar?: (row: T) => ReactNode;
  h1?: (row: T) => ReactNode;
  h2?: (row: T) => ReactNode;
  h3?: (row: T) => ReactNode;
  topRightMenu?: Action<T>[];
  additionalActions?: Action<T>[];
  topRightInfo?: (row: T) => ReactNode;
  contentRow?: (row: T) => ReactNode;
  searchFilter?: Filter<T>;
  onElementClick?: (row: T) => void;
}

const Row = <T,>(props: {
  item: T;
  totalCount: number;
  index: number;
  rendering: MobileTableRendering<T>;
  keyOf: (item: T) => Key;
}) => {
  return (
    <>
      <ListItem
        key={props.keyOf(props.item)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          backgroundColor: props.rendering.onElementClick
            ? "var(--joy-palette-background-level1)"
            : "initial",
          padding: 1,
          borderRadius: 5,
          ":active": {
            backgroundColor: props.rendering.onElementClick
              ? "var(--joy-palette-background-level2)"
              : "initial",
          },
        }}
        onClick={(e) => {
          if (props.rendering.onElementClick) {
            e.stopPropagation();
            props.rendering.onElementClick(props.item);
          }
        }}
      >
        <ListItemContent
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "start",
            pl: props.rendering.avatar ? 0 : "10px",
          }}
        >
          {props.rendering.avatar ? (
            <ListItemDecorator>
              {props.rendering.avatar(props.item)}
            </ListItemDecorator>
          ) : (
            <></>
          )}
          <div>
            {props.rendering.h1 ? (
              <Typography gutterBottom sx={{ fontWeight: 600 }}>
                {props.rendering.h1(props.item)}
              </Typography>
            ) : (
              <></>
            )}
            {props.rendering.h2 ? (
              <Typography level="body-xs" gutterBottom>
                {props.rendering.h2(props.item)}
              </Typography>
            ) : (
              <></>
            )}
            {props.rendering.h3 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 0.5,
                  mb: 1,
                }}
              >
                {props.rendering.h3(props.item)}
              </Box>
            ) : (
              <></>
            )}
            {/* Content row */}
            {props.rendering.contentRow ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                {props.rendering.contentRow(props.item)}
              </Box>
            ) : (
              <></>
            )}
            {/* Additional actions */}
            {props.rendering.additionalActions ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <RowMenu
                  item={props.item}
                  actionMenu={props.rendering.additionalActions}
                />
              </Box>
            ) : (
              <></>
            )}
          </div>
        </ListItemContent>

        <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
          {props.rendering.topRightInfo ? (
            props.rendering.topRightInfo(props.item)
          ) : (
            <></>
          )}

          {props.rendering.topRightMenu &&
          props.rendering.topRightMenu.length > 0 ? (
            <RowMenu
              item={props.item}
              actionMenu={props.rendering.topRightMenu}
            />
          ) : (
            <></>
          )}
        </Box>
      </ListItem>
      {props.index < props.totalCount - 1 ? (
        <ListDivider key={props.keyOf(props.item) + "divider"} />
      ) : (
        <></>
      )}
    </>
  );
};

const MobileTable = <T,>(props: {
  rows: T[];
  rendering: MobileTableRendering<T>;
  currentPage: number;
  setCurrentPage: (callback: (prevNumber: number) => number) => void;
  keyOf: (item: T) => Key;
  maxPage: number;
  disablePaging: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <List size="sm" sx={{ "--ListItem-paddingX": 0 }}>
        {props.rows.map((listItem, index) => (
          <Row
            item={listItem}
            index={index}
            keyOf={props.keyOf}
            totalCount={props.rows.length}
            rendering={props.rendering}
            key={props.keyOf(listItem)}
          />
        ))}
        {props.rows.length == 0 ? (
          <Typography color="neutral" textAlign={"center"} p={2}>
            {t("components.genericResponsiveDatagrid.fullScreenTable.empty")}
          </Typography>
        ) : (
          <></>
        )}
      </List>
      {!props.disablePaging ? (
        <Box
          className="Pagination-mobile"
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            py: 2,
          }}
        >
          <IconButton
            aria-label="previous page"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled={props.currentPage == 0}
            onClick={() => props.setCurrentPage((prevPage) => prevPage - 1)}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography level="body-sm" sx={{ mx: "auto" }}>
            {t(
              "components.genericResponsiveDatagrid.mobileList.pageControl.pageLabels",
            )
              .replace("{currPage}", (props.currentPage + 1).toString())
              .replace("{maxPage}", props.maxPage.toString())}
          </Typography>
          <IconButton
            aria-label="next page"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled={props.currentPage >= props.maxPage - 1}
            onClick={() => props.setCurrentPage((prevPage) => prevPage + 1)}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default MobileTable;
