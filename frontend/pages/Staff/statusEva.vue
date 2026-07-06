<template>
   <v-container fluid>
    <center>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title class="text-center"><h1>สถานะการประเมินของผู้รับการประเมินผล</h1></v-card-title>
                </v-card>
                <br>
                <v-table>
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ชื่อผู้รับการประเมินผล</th>
                            <th class="border text-center">รอบการประเมิน</th>
                            <th class="border text-center">วันที่ออกแบบประเมิน</th>
                            <th class="border text-center">สถานะการประเมิน</th>
                            <th class="border text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_eva">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ items.first_name }} {{ items.last_name }}</td>
                            <td class="border text-center">{{ items.round_sys }}</td>
                            <td class="border text-center">{{ items.day_eva }}</td>
                            <td class="border text-center">
                                {{ items.status_eva }}
                            </td>
                            <td class="border text-center">
                                <center>
                                    <v-btn class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                    <v-btn class="text-center text-white ma-3" color="red" @click="del(items.id_eva)">ลบ</v-btn>
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
        id_eva:null,
        id_member:null,
        id_sys:null,
        day_eva:''
    }
)

const reset = ()=>{

    form.value ={
        
        id_eva:null,
        id_member:null,
        id_sys:null,
        day_eva:''
    
    }

}
    

const error = ref<Record<string,string>>({})
const dataResult = ref([])
const search = ref('')
const eva = ref([])
const round = ref([])

function validateForm(){

    error.value = {}
    const f = form.value

    if(!f.id_member)error.value.id_member = 'กรุณาเลือกผู้รับการประเมินผล'
    if(!f.id_sys)error.value.id_sys = 'กรุณาเลือกรอบการประเมิน'
    if(!f.day_eva)error.value.day_eva = 'กรุณากรอกวันที่ออกแบบประเมิน'

    return Object.keys(error.value).length === 0

}
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    if(!validateForm())return
    try {
        form.value.id_eva
        ?await axios.put(`${staff}/eva/update/${form.value.id_eva}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/eva/save`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('เพิ่มข้อมูลสำเร็จ')
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error regis",error)
    }

}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
        const res2 = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        eva.value = res2.data
        const res3 =  await axios.get(`${staff}/round/show`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res3.data
    } catch (error) {
        console.error("error fetching",error)
    }

    
}

const result = computed(()=>{

    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{

        return(
            item.first_name?.toLowerCase().includes(s) ||
            item.last_name?.toLowerCase().includes(s)
        )

    })

})

const edit = (items:any) => {

    form.value = {...items}

}

const del = async(id_eva:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้"))return
    try {
        await axios.delete(`${staff}/eva/del/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error del",error)
    }
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>