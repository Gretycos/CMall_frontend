/**
 * author: Tsong
 * time: 2023/4/18 18:10
 */
import axios from "@/common/js/axios"

export function getDetail(id) {
    return axios.get(`/goods/detail/${id}`);
}

export function getCategory() {
    return axios.get('/categories');
}

export function search(params) {
    return axios.get('/search', { params });
}
