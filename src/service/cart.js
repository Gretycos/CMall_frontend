/**
 * author: Tsong
 * time: 2023/4/18 17:20
 */
import axios from "@/common/js/axios"

const PREFIX = '/shopping-cart'

export function addCart(params) {
    return axios.post(PREFIX + '/', params);
}

export function modifyCart(params) {
    return axios.put(PREFIX + '/', params);
}

export function getCart(params) {
    return axios.get(PREFIX + '/', { params });
}

export function deleteCartItem(id) {
    return axios.delete(PREFIX + `/${id}`);
}

export function getByCartItemIds(params) {
    return axios.post(PREFIX + '/confirm', params);
}
