import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";

export const usuario = defineStore("usuario", {
  state: () => ({
    openModal: false,
    isLoading: false,
    isLoadingMessage: '',
    usuarios: [],
    new_usuario: {
        name: '',
        email: '',
        password: '123456',
        rol: 'alumno',
        face_image_url: '',
        face_image: null,
        face_descriptor: null
    },
    pag: {
        buscar: '', 
        total: 0,
        page: 1, 
        cant_reg: 10,
    }
  }),
  actions: {
    resetForm(){
        this.new_usuario = {
            name: '',
            email: '',
            password: '123456',
            rol: 'alumno',
            face_image_url: '',
            face_image: null,
            face_descriptor: null
        }
    },
    async getUsuarios(){
        const { data } = await systemApi.get('/usuarios', {
            params: this.pag
        })
        this.usuarios = data.data;
        this.pag.total = data.total;
    },
    async onSubmit(){
        this.isLoading = true
        if(this.new_usuario.id){

        }else{
            try{
                const { data } = await systemApi.post('/usuarios', this.new_usuario)
                await this.getUsuarios()
                this.openModal = false
            }catch(e){
                console.log(e)
            }finally{
                this.isLoading = false
            }     
        }
    }
  }
});
