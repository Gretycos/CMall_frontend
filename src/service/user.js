/**
 * author: Tsong
 * time: 2023/4/18 18:19
 */
import axios from "@/common/js/axios"

const PREFIX = '/user'
export function getUserInfo() {
    return axios.get(PREFIX + '/info');
}

export function editUserInfo(params) {
    return axios.put(PREFIX + '/info', params);
}

export function editUserPassword(params) {
    return axios.put(PREFIX + '/password', params);
}

export function login(params) {
    return axios.post(PREFIX + '/login', params);
}

export function logout() {
    return axios.post(PREFIX + '/logout')
}

export function register(params) {
    return axios.post(PREFIX + '/register', params);
}
