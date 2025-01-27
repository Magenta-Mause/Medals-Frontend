import { MoreHorizRounded } from "@mui/icons-material";
import { Dropdown, MenuButton, Button, Menu, MenuItem } from "@mui/joy";
import { Action } from "./GenericResponsiveDatagrid";

const RowMenu = <T,>(props: { item: T; actionMenu: Action<T>[] }) => {
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
            onClick={() => action.operation(props.item)}
            key={action.key}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default RowMenu;
