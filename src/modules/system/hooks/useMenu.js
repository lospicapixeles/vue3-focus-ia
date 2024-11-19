import { storeToRefs } from "pinia";
import { menu } from "../store/menu";

const useMenu = () => {
  const storeRef = storeToRefs(menu());

  return {
    ...storeRef,
    getMenus: menu().getMenus,
  };
};

export default useMenu;
