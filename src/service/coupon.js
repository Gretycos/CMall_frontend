/**
 * author: Tsong
 * time: 2023/4/29 18:55
 */
import axios from "@/common/js/axios"

export function addCoupon(params) {
    return axios.post('/coupon/save', params)
}

export function getCouponList() {
    return axios.get('/coupon')
}

export function getMyCouponList(params) {
    return axios.get('/coupon/my', params)
}
