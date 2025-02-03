import { Check, LanguageOutlined } from "@mui/icons-material";
import {
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";

const LanguageSelectionButton = () => {
  const { t, i18n } = useTranslation();

  return (
    <Dropdown>
      <MenuButton sx={{ aspectRatio: 1, p: 0 }}>
        <LanguageOutlined />
      </MenuButton>
      <Menu size="sm" placement="top-end">
        {Object.keys(i18n.options.resources ?? []).map((language) => (
          <MenuItem
            sx={{ p: 1, pr: 2 }}
            onClick={() => i18n.changeLanguage(language)}
            key={language}
          >
            <ListItemDecorator>
              {i18n.language == language ? <Check /> : <></>}
            </ListItemDecorator>
            <Typography>{t("languages." + language)}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default LanguageSelectionButton;
