/**
 * author: Tsong
 * time: 2023/4/18 17:14
 */
import axios from "@/common/js/axios"

export function addAddress(params) {
    return axios.post('/address', params)
}

export function EditAddress(params) {
    return axios.put('/address', params)
}

export function DeleteAddress(id) {
    return axios.delete(`/address/${id}`)
}

export function getDefaultAddress() {
    return axios.get('/address/default')
}

export function getAddressList() {
    return axios.get('/address')
}

export function getAddressDetail(id) {
    return axios.get(`/address/${id}`)
}
