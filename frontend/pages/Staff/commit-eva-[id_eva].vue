<template>
   <v-container fluid>
    <center>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="text-center"><h1>ผู้รับการประเมินผล</h1></v-card-title>
                    <v-card-text class="text-center">
                        <p>ชื่อผู้รับการประเมินผล:{{ header.first_name }} {{ header.last_name }}</p>
                        <p>รอบการประเมินที่:{{ header.round_sys }} ปี:{{ header.year_sys }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <br>
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title class="text-center"><h1>เพิ่มกรรมการประเมิน</h1></v-card-title>
                    <br>
                    <v-card-text class="bg-white">
                        <v-form @submit.prevent="saveMember">
                            <v-row v-for="(items,index) in List">
                                <v-col cols="12" md="6">
                                    <v-select :label="`เลือกกรรมการคนที่ ${index+1}`" v-model="items.id_member" :items="MEMBER(index).map((t)=>({title:`${t.fullname_commit}`,value:t.id_member}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select :label="`ตำแหน่งกรรมการคนที่ ${index+1}`" v-model="items.role" :items="ROLE(index)"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn type="submit" color="primary" class="text-center ma-3">บันทึก</v-btn>
                                        <v-btn type="reset" color="#7d0c14" class="text-center ma-3">ยกเลิก</v-btn>
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
                            <th class="border text-center">กรรมการประเมิน</th>
                            <th class="border text-center">ตำแหน่ง</th>
                            <th class="border text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in List" :key="items.id_commit">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ nameOf(items.id_member) }}</td>
                            <td class="border text-center">{{ items.role }}</td>
                            <td class="border text-center">
                                <center>
                                    <v-btn class="text-center text-white ma-3" color="red" @click="del(items.id_commit)">ลบ</v-btn>
                                </center>
                            </td>
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
import { id } from 'vuetify/locale'
import { pick } from 'vuetify/lib/util/helpers.mjs'

const role = ['ประธาน','กรรมการ','เลขา']
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''}
])    

const search = ref('')
const people = ref([])
const header = ref([])

const id_eva = useRoute().params.id_eva

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    try {
        await axios.post(`${staff}/commit/save/${id_eva}`,List.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('เพิ่มข้อมูลสำเร็จ')

    } catch (error) {
        console.error("Error regis",error)
    }

}

const nameMap = computed(()=> Object.fromEntries(people.value.map((p)=>[p.id_member,p.fullname_commit])))
const nameOf = (id:number) => nameMap.value[id]

const MEMBER = (idx:number)=>{

    const picked = List.value.map((c,i)=>(i !== idx ? c.id_member : null))
    return people.value.filter((p)=> !picked.includes(p.id_member))

}

const ROLE = (idx:number)=>{

    const picked = List.value.map((c,i)=>(i !== idx ? c.role : null))
    return role.filter((p)=> !picked.includes(p))

}

const fetch = async()=>{
    try {
        const res1 =  await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res1.data[0]
        const res2 = await axios.get(`${staff}/commit/show/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        people.value = res2.data.before
        const useData = res2.data.after
        if(useData.length === 0){

            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''}
            ]

        }else{
            List.value = useData.map((c)=>(
                {id_commit:c.id_commit,id_member:c.id_member,role:c.role}
            ))

            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})
            }
        }
        
    } catch (error) {
        console.error("error fetching",error)
    }

    
}


const del = async(id_commit:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้"))return
    try {
        await axios.delete(`${staff}/commit/del/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
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