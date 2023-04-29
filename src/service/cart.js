/**
 * author: Tsong
 * time: 2023/4/18 17:20
 */
import axios from "@/common/js/axios"

export function addCart(params) {
    return axios.post('/shopping-cart', params);
}

export function modifyCart(params) {
    return axios.put('/shopping-cart', params);
}

export function getCart(params) {
    return axios.get('/shopping-cart', { params });
}

export function deleteCartItem(id) {
    return axios.delete(`/shopping-cart/${id}`);
}

export function getByCartItemIds(params) {
    return axios.get('/shopping-cart/confirm', { params });
}
