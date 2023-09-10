/**
 * author: Tsong
 * time: 2023/4/18 17:14
 */
import axios from "@/common/js/axios"

const PREFIX = '/user/address'
export function addAddress(params) {
    return axios.post(PREFIX + '/', params)
}

export function EditAddress(params) {
    return axios.put(PREFIX + '/', params)
}

export function DeleteAddress(id) {
    return axios.delete(PREFIX + `/${id}`)
}

export function getDefaultAddress() {
    return axios.get(PREFIX + '/default')
}

export function getAddressList() {
    return axios.get(PREFIX + '/')
}

export function getAddressDetail(id) {
    return axios.get(PREFIX + `/${id}`)
}
