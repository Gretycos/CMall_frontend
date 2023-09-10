/**
 * author: Tsong
 * time: 2023/4/18 18:17
 */
import axios from "@/common/js/axios"

const PREFIX = '/homepage'
export function getHomePage() {
    return axios.get(PREFIX + '/');
}

export function getCategory() {
    return axios.get(PREFIX + '/categories');
}
