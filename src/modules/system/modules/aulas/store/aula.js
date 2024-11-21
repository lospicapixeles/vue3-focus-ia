import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'

export const aula = defineStore("aula", {
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
        cant_reg: 999,
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
            toast.success(data.message)
            this.openModal = false
          }catch(e){
            toast.error(e.response.data.message)
          }finally{
            this.isLoading = false
          }
       }
    },
    async onDelete(id){
      try{
        const { data } = await systemApi.delete(`/aulas/${id}`)
        toast.success(data.message)
        await this.getAulas()
      }catch(e){
        toast.error(e.response.data.message)
      }
    }
  }
})
