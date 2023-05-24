/**
 * author: Tsong
 * time: 2023/4/29 18:55
 */
import axios from "@/common/js/axios"

export function addCoupon(params) {
    return axios.post('/coupon/save', params)
}

export function getCouponList(params) {
    return axios.get('/coupon', {params})
}

export function getMyCouponList(params) {
    return axios.get('/coupon/my', {params})
}

export function getAllMyAvailableCouponList() {
    return axios.get('/coupon/available')
}
