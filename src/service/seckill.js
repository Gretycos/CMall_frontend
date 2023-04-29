/**
 * author: Tsong
 * time: 2023/4/29 18:59
 */
import axios from "@/common/js/axios"

export function executeSeckill(params) {
    return axios.post('/seckill/execute', params)
}

export function getSeckillDetails(id) {
    return axios.get(`/seckill/${id}`)
}

export function getServerTime() {
    return axios.get('/seckill/time/now')
}

export function getSeckillList() {
    return axios.get('/seckill/list')
}

export function getSeckillExposer(id) {
    return axios.get(`/seckill/exposer/${id}`)
}

export function checkSeckillStock(id) {
    return axios.get(`/seckill/checkStock/${id}`)
}
