/**
 * author: Tsong
 * time: 2023/4/18 18:19
 */
import axios from "@/common/js/axios"

export function getUserInfo() {
    return axios.get('/user/info');
}

export function editUserInfo(params) {
    return axios.put('/user/info', params);
}

export function editUserPassword(params) {
    return axios.put('/user/password', params);
}

export function login(params) {
    return axios.post('/user/login', params);
}

export function logout() {
    return axios.post('/user/logout')
}

export function register(params) {
    return axios.post('/user/register', params);
}
