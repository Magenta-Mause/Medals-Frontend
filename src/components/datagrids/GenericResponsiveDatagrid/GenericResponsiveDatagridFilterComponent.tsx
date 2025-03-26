import { Search } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  ToggleButtonGroup,
} from "@mui/joy";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface Filter<T> {
  name: string;
  apply: (filterParameter: string) => (item: T) => boolean;
  type: "TEXT" | "SELECTION" | "TOGGLE";
  selection?: (string | FilterValue)[];
  label?: string | ReactNode;
  option?: string;
}

interface FilterValue {
  displayValue: React.ReactNode;
  value: string;
}

const FilterComponent = <T,>(props: {
  filters: Filter<T>[];
  setFilter: (
    key: string,
    value: string | ((oldVal: string) => string),
  ) => void;
  filterValues: Record<string, string>;
}) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {props.filters.map((filter) => (
        <FormControl size="sm" key={filter.name}>
          <FormLabel>{filter.label}</FormLabel>
          {filter.type == "SELECTION" ? (
            <Select
              size="sm"
              placeholder={t("generic.all")}
              onChange={(_event, newValue) => {
                props.setFilter(filter.name, newValue as string);
              }}
              value={props.filterValues[filter.name]}
              sx={{ minHeight: "35px" }}
            >
              {filter.selection?.map((value) => {
                if (typeof value === "string") {
                  return (
                    <Option value={value} key={value}>
                      {value}
                    </Option>
                  );
                }
                return (
                  <Option value={value.value} key={value.value}>
                    {value.displayValue}
                  </Option>
                );
              })}
            </Select>
          ) : filter.type == "TOGGLE" ? (
            <ToggleButtonGroup
              value={[props.filterValues[filter.name] == "1" ? "button" : ""]}
              onChange={(_event, newValue) => {
                if (newValue.includes("button")) {
                  props.setFilter(filter.name, "1");
                } else {
                  props.setFilter(filter.name, "0");
                }
              }}
            >
              <Button
                sx={{ flexGrow: 1, minHeight: "35px", p: "2px" }}
                value="button"
              >
                {filter.option ?? filter.label}
              </Button>
            </ToggleButtonGroup>
          ) : (
            <FormControl sx={{ flex: 1 }} size="sm">
              <Input
                size="sm"
                placeholder={String(filter.label ?? filter.name)}
                startDecorator={<Search />}
                sx={{ minHeight: "35px", p: "2px" }}
                value={props.filterValues[filter.name]}
                onChange={(event) => {
                  props.setFilter(filter.name, () => event.target.value);
                }}
              />
            </FormControl>
          )}
        </FormControl>
      ))}
    </React.Fragment>
  );
};

export default FilterComponent;
