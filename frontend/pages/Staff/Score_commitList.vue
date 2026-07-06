<template>
    <v-container fluid class="py-10">
        <v-card class="pa-2">
            <v-sheet>
                <h1 class="text-h5 font-weight-bold">ผลสรุปคะแนนกรรมการประเมิน</h1>
            </v-sheet>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-center border">ลำดับ</th>
                            <th class="text-center border">ชื่อ</th>
                            <th class="text-center border">นามสกุล</th>
                            <th class="text-center border">วันที่ออกแบบประเมิน</th>
                            <th class="text-center border">รอบการประเมิน</th>
                            <th class="text-center border">คะแนนประเมินของกรรมการ</th>
                            <th class="text-center border">ประเมินผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_eva">
                            <td class="text-center border">{{ index+1 }}</td>
                            <td class="text-center border">{{ items.first_name }}</td>
                            <td class="text-center border">{{ items.last_name }}</td>
                            <td class="text-center border">{{ items.day_eva }}</td>
                            <td class="text-center border">รอบการประเมินที่{{ items.round_sys }} ปี {{ year_sys }}</td>
                            <td class="text-center border"><v-btn class="text-center text-white ma-3" size="small" :color="bg(items.status_eva)">{{ items.status_eva === 1 ? 'ผู้รับการประเมินผลยังไม่ได้ประเมินตนเอง' : items.status_eva === 2 ? 'รอกรรมการประเมิน' : 'ประเมินสำเร็จ'}}</v-btn></td>
                            <td class="text-center border">
                                <v-btn color="blue" class="text-white" size="small" @click="go(items.id_eva)">รายละเอียด</v-btn>
                            </td>
                        </tr>
                        <tr v-if="result.length === 0">
                            <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit, staff} from '../../API/base'
import { bg } from 'vuetify/locale'
import { b } from 'vue-router/dist/index-BQLwgiyK.js'

const token = import.meta.client ? localStorage.getItem('token') : null

const result = ref ([])

const fetch = async () => {
    try {
        const res = await axios.get(`${staff}/eva/show`, {headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("Error Fetching",error)
    }
}
const go = (id_eva:number) => {
    navigateTo({path:`/Staff/score-commit${id_eva}`})
}

const bg = (status_eva:number) =>{

    if(status_eva === 1)return 'error'
    else if(status_eva === 2)return 'warning'
    else if(status_eva === 3)return 'success'

}

onMounted(fetch)

</script>

<style scoped>

</style>