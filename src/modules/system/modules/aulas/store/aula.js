import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'

export const aulas = defineStore("aulas", {
  state: () => ({
    isLoading: false,
    openModal: false,
    aulas: [],
    new_aula: {
      nombre: '',
      ubicacion: ''
    },
    pag: {
        buscar: '', 
        total: 0,
        page: 1, 
        cant_reg: 10,
    } 
  }),
  actions: {
    async getAulas(){
      const { data } = await systemApi.get('/aulas', {
        params: this.pag
      })
      this.aulas = data.data;
      this.pag.total = data.total;
    },
    async onSubmit(){
       this.isLoading = true
       if(this.new_aula.id){
            
       }else{
          try{
            const { data } = await systemApi.post('/aulas', this.new_aula)
            await this.getAulas()
            this.openModal = false
          }catch(e){
            toast.error(e.response.data.message)
          }finally{
            this.isLoading = false
          }
       }
    }
  }
}
