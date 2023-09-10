/**
 * author: Tsong
 * time: 2023/4/29 18:55
 */
import axios from "@/common/js/axios"

const PREFIX = '/coupon'
export function addCoupon(params) {
    return axios.post(PREFIX + '/save', params)
}

export function getCouponList(params) {
    return axios.get(PREFIX + '/available/list', {params})
}

export function getMyCouponList(params) {
    return axios.get(PREFIX + '/my', {params})
}

export function getAllMyAvailableCouponList() {
    return axios.get(PREFIX + '/my/available')
}
