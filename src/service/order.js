/**
 * author: Tsong
 * time: 2023/4/18 18:19
 */
import axios from "@/common/js/axios"

const PREFIX = '/order'
export function createOrder(params) {
    return axios.post(PREFIX + '/save', params);
}

export function getSeckillOrderNo(params) {
    return axios.get(PREFIX + '/seckillOrderNo', { params });
}

export function getOrderList(params) {
    return axios.get(PREFIX + '/', { params });
}

export function getOrderDetail(id) {
    return axios.get(PREFIX + `/${id}`);
}

export function cancelOrder(id) {
    return axios.put(PREFIX + `/cancel/${id}`);
}

export function deleteOrder(id) {
    return axios.put(PREFIX + `/delete/${id}`);
}

export function confirmOrder(id) {
    return axios.put(PREFIX + `/finish/${id}`)
}

export function payOrder(params) {
    return axios.get(PREFIX + '/paySuccess', { params })
}
