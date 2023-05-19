/**
 * author: Tsong
 * time: 2023/4/18 18:19
 */
import axios from "@/common/js/axios"
export function createOrder(params) {
    return axios.post('/order/save', params);
}

export function createSeckillOrder(params) {
    return axios.post('/order/seckill/save', params);
}

export function getOrderList(params) {
    return axios.get('/order', { params });
}

export function getOrderDetail(id) {
    return axios.get(`/order/${id}`);
}

export function cancelOrder(id) {
    return axios.put(`/order/cancel/${id}`);
}

export function deleteOrder(id) {
    return axios.put(`/order/delete/${id}`);
}

export function confirmOrder(id) {
    return axios.put(`/order/finish/${id}`)
}

export function payOrder(params) {
    return axios.get('/paySuccess', { params })
}
