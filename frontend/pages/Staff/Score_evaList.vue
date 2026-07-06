<template>
    <v-container fluid class="py-10">
        <v-card class="pa-2">
            <v-sheet>
                <h1 class="text-h5 font-weight-bold">ผลสรุปคะแนนผู้รับการประเมินผล</h1>
            </v-sheet>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-center border">ลำดับ</th>
                            <th class="text-center border">ชื่อ-นามสกุล</th>
                            <th class="text-center border">วันที่ออกแบบประเมิน</th>
                            <th class="text-center border">รอบการประเมิน</th>
                            <th class="text-center border">คะแนนประเมินตนเอง</th>
                            <th class="text-center border">สถานะการประเมิน</th>
                            <th class="text-center border">รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_eva">
                            <td class="text-center border">{{ index+1 }}</td>
                            <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                            <td class="text-center border">{{ items.day_eva }}</td>
                            <td class="text-center border">รอบการประเมินที่{{ items.round_sys }} ปี {{ year_sys }}</td>
                            <td class="text-center border">{{ items.total_eva === null ? 'ยังไม่ได้ประเมิน' : items.total_eva  }}</td>
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

const bg = (status_eva:number) =>{

    if(status_eva === 1)return 'error'
    else if(status_eva === 2)return 'warning'
    else if(status_eva === 3)return 'success'

}

const go = (id_eva:number) => {
    navigateTo({path:`/Staff/Save_Score${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>