<template>
   <v-container fluid>
    <center>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title class="text-center"><h1>จัดการรอบการประเมิน</h1></v-card-title>
                    <br>
                    <v-card-text class="bg-white">
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่เปิดรอบการประเมิน" type="date" v-model="form.day_open" :error-messages="error.day_open" prepend-inner-icon="mdi-clock"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่ปิดรอบการประเมิน" type="date" v-model="form.day_close" :error-messages="error.day_close" prepend-inner-icon="mdi-clock"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รอบการประเมิน" type="number" v-model="form.round_sys" :error-messages="error.round_sys" ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ปีการประเมิน" type="text" v-model="form.year_sys" :error-messages="error.year_sys"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="สถานะรอบการประเมิน" v-model="form.status_sys" :items="[{title:'เปิด',value:'y'},{title:'ปิด',value:'n'}]" :error-messages="error.status_sys"></v-select>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn type="submit" color="primary" class="text-center ma-3">{{ form.id_sys ? 'อัปเดต':'บันทึก' }}</v-btn>
                                        <v-btn color="#7d0c14" class="text-center ma-3" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
                <br>
                <v-table>
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">วันที่เปิดรอบการประเมิน</th>
                            <th class="border text-center">วันที่ปิดรอบการประเมิน</th>
                            <th class="border text-center">รอบการประเมิน</th>
                            <th class="border text-center">ปีการประเมิน</th>
                            <th class="border text-center">สถานะรอบการประเมิน</th>
                            <th class="border text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :item="items.id_sys">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ items.day_open }}</td>
                            <td class="border text-center">{{ items.day_close }}</td>
                            <td class="border text-center">{{ items.round_sys }}</td>
                            <td class="border text-center">{{ items.year_sys }}</td>
                            <td class="border text-center">{{ items.status_sys === 'y' ? 'เปิด':'ปิด' }}</td>
                            <td class="border text-center">
                                <center>
                                    <v-btn class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                    <v-btn class="text-center text-white ma-3" color="red" @click="del(items.id_sys)">ลบ</v-btn>
                                </center>
                            </td>
                        </tr>
                        <tr v-if="result.length ===0">
                            <td class="text-center text-red" colspan="10">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>

            </v-col>
        </v-row>
    </center>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const form = ref(
    {
        id_sys:null,
        day_open:'',
        day_close:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }
)

const reset = ()=>{

    form.value ={
        
        id_sys:null,
        day_open:'',
        day_close:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    
    }

}
    

const error = ref<Record<string,string>>({})
const result = ref([])
const search = ref('')
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i

function validateForm(){

    error.value = {}
    const f = form.value

    if(!f.day_open)error.value.day_open = 'กรุณากรอกวันที่เปิดรอบการประเมิน'
    if(!f.day_close)error.value.day_close = 'กรุณากรอกวันที่ปิดรอบการประเมิน'
    if(!f.round_sys)error.value.round_sys = 'กรุณากรอกรอบการประเมิน'
    if(!f.year_sys.trim())error.value.year_sys = 'กรุณากรอกปีการประเมิน'
    else if(f.year_sys.trim().length < 4)error.value.year_sys = 'กรอกปีการประเมินให้ถูกต้อง'

    if(!f.status_sys.trim())error.value.status_sys = 'กรุณากรอกสถานะการประเมิน'
    

    return Object.keys(error.value).length === 0

}
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    if(!validateForm())return
    try {
        form.value.id_sys
        ?await axios.put(`${staff}/round/update/${form.value.id_sys}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/round/save`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('เพิ่มข้อมูลสำเร็จ')
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error regis",error)
    }

}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/round/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error fetching",error)
    }

    
}

const edit = (items:any) => {

    form.value = {...items}

}

const del = async(id_sys:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้"))return
    try {
        await axios.delete(`${staff}/round/del/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error del",error)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>