import {
  Avatar,
  Box,
  IconButton,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { Action } from "./GenericResponsiveDatagrid";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Key, ReactNode } from "react";
import RowMenu from "./RowMenu";
import { Filter } from "./GenericResponsiveDatagridFilterComponent";

export interface MobileTableRendering<T> {
  avatar?: (row: T) => ReactNode;
  h1?: (row: T) => ReactNode;
  h2?: (row: T) => ReactNode;
  h3?: (row: T) => ReactNode;
  bottomButtons?: Action<T>[];
  additionalActions?: Action<T>[];
  topRightInfo?: (row: T) => ReactNode;
  searchFilter: Filter<T>;
}

const MobileTable = <T,>(props: {
  rows: T[];
  rendering: MobileTableRendering<T>;
  currentPage: number;
  setCurrentPage: (callback: (prevNumber: number) => number) => void;
  keyOf: (item: T) => Key;
  maxPage: number;
}) => {
  return (
    <>
      <List size="sm" sx={{ "--ListItem-paddingX": 0 }}>
        {props.rows.map((listItem) => (
          <>
            <ListItem
              key={props.keyOf(listItem)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <ListItemContent
                sx={{ display: "flex", gap: 2, alignItems: "start" }}
              >
                {props.rendering.avatar ? (
                  <ListItemDecorator>
                    <Avatar size="sm">
                      {props.rendering.avatar(listItem)}
                    </Avatar>
                  </ListItemDecorator>
                ) : (
                  <></>
                )}
                <div>
                  {props.rendering.h1 ? (
                    <Typography gutterBottom sx={{ fontWeight: 600 }}>
                      {props.rendering.h1(listItem)}
                    </Typography>
                  ) : (
                    <></>
                  )}
                  {props.rendering.h2 ? (
                    <Typography level="body-xs" gutterBottom>
                      {props.rendering.h2(listItem)}
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
                      {props.rendering.h3(listItem)}
                    </Box>
                  ) : (
                    <></>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    {props.rendering.bottomButtons?.map((action) => (
                      <Link
                        level="body-sm"
                        color={action.color}
                        key={action.key}
                        component="button"
                        onClick={() => action.operation(listItem)}
                      >
                        {action.label}
                      </Link>
                    ))}
                    {props.rendering.additionalActions ? (
                      <RowMenu
                        item={listItem}
                        actionMenu={props.rendering.additionalActions}
                      />
                    ) : (
                      <></>
                    )}
                  </Box>
                </div>
              </ListItemContent>
              {props.rendering.topRightInfo ? (
                props.rendering.topRightInfo(listItem)
              ) : (
                <></>
              )}
            </ListItem>
            <ListDivider />
          </>
        ))}
      </List>
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
          Page {props.currentPage + 1} of {props.maxPage}
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
    </>
  );
};

export default MobileTable;
