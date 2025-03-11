import { MoreHorizRounded } from "@mui/icons-material";
import { Button, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { Action } from "./GenericResponsiveDatagrid";

const RowMenu = <T,>(props: { item: T; actionMenu: Action<T>[] }) => {
  console.log(props.actionMenu);
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <MoreHorizRounded />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140, zIndex: 99999999999 }}>
        {props.actionMenu?.map((action) => (
          <MenuItem
            color={action.color ?? "neutral"}
            onClick={(e) => {
              e.stopPropagation();
              action.operation(props.item);
            }}
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
