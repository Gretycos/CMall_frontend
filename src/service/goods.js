/**
 * author: Tsong
 * time: 2023/4/18 18:10
 */
import axios from "@/common/js/axios"

const PREFIX = '/goods'

export function getDetail(id) {
    return axios.get(PREFIX + `/detail/${id}`);
}

export function search(params) {
    return axios.get(PREFIX + '/search', { params });
}

export function getSuggestion(params) {
    return axios.get(PREFIX + '/suggestion', { params });
}
