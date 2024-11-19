import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";

export const usuario = defineStore("usuario", {
  state: () => ({
    openModal: false,
    usuarios: [],
    pag: {
        buscar: '', 
        total: 0,
        page: 1, 
        cant_reg: 10,
    }
  }),
  actions: {
    async getUsuarios(){
        const { data } = await systemApi.get('/usuarios', {
            params: this.pag
        })
        this.usuarios = data.data;
        this.pag.total = data.total;
    }
  }
});