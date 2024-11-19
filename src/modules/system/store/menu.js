import { defineStore } from "pinia";
import systemApi from "../../../apis/systemApi";

export const menu = defineStore("menu", {
  state: () => ({
    menus: [],
  }),
  actions: {
    async getMenus() {
      if(localStorage.getItem("_m_")){
        this.menus = JSON.parse(localStorage.getItem("_m_"));
        return;
      }
      try {
        const { data } = await systemApi.get("/menuusers");
        this.menus = data;
        localStorage.setItem("_m_", JSON.stringify(data));
      } catch (e) {
        console.log(e);
      }
    },
  },
});
