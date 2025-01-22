import { UtilContext } from "App";
import { useContext } from "react";

const useSidebar = () => {
  const { sideBarExtended, setSideBarExtended } = useContext(UtilContext);

  const toggleSidebar = () => {
    setSideBarExtended(!sideBarExtended);
    console.log(sideBarExtended);
  };

  const extendSidebar = () => {
    setSideBarExtended(true);
  };

  const collapseSidebar = () => {
    setSideBarExtended(false);
  };

  return {
    toggleSidebar,
    extendSidebar,
    collapseSidebar,
    sideBarExtended 
  };
};

export default useSidebar;
