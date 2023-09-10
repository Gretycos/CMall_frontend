/**
 * author: Tsong
 * time: 2023/4/29 18:59
 */
import axios from "@/common/js/axios"

const PREFIX = '/seckill'
export function executeSeckill(params) {
    return axios.post(PREFIX + '/execute', params)
}

export function getSeckillDetails(id) {
    return axios.get(PREFIX + `/${id}`)
}

// export function getServerTime() {
//     return axios.get(PREFIX + '/time/now')
// }

export function getSeckillList() {
    return axios.get(PREFIX + '/list')
}

export function getSeckillExposer(id) {
    return axios.get(PREFIX + `/exposer/${id}`)
}

export function checkSeckillStock(id) {
    return axios.get(PREFIX + `/checkStock/${id}`)
}
