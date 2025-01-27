import { Search } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  Select,
  ToggleButtonGroup,
  Button,
  Input,
  Option,
} from "@mui/joy";
import React from "react";

export interface Filter<T> {
  name: string;
  apply: (filterParameter: string) => (item: T) => boolean;
  type: "TEXT" | "SELECTION" | "TOGGLE";
  selection?: (string | FilterValue)[];
  label?: string;
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
  return (
    <React.Fragment>
      {props.filters.map((filter) => (
        <FormControl size="sm" key={filter.name}>
          <FormLabel>{filter.label}</FormLabel>
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
                {filter.option ?? filter.label}
              </Button>
            </ToggleButtonGroup>
          ) : (
            <FormControl sx={{ flex: 1 }} size="sm">
              <Input
                size="sm"
                placeholder={filter.label ?? filter.name}
                startDecorator={<Search />}
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
