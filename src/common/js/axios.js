/**
 * author: Tsong
 * time: 2023/4/18 16:14
 */
import { showFailToast } from 'vant'
import axios from 'axios'
import { getLocal } from '@/common/js/utils'
import router from '@/router'


// console.log('import.meta.env', import.meta.env)

axios.defaults.baseURL = import.meta.env.MODE === 'development' ? '/api' : '/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = getLocal('token') || ''
axios.defaults.headers['user-id'] = getLocal('user-id') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        showFailToast('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.resultCode !== 200) {
        if (res.data.message) showFailToast(res.data.message)
        if (res.data.resultCode === 416) {
            router.push({ path: '/login' })
        }
        // if (res.data.data && window.location.hash === '#/login') {
        //     setLocal('token', res.data.data)
        //     axios.defaults.headers['token'] = res.data.data
        // }
        return Promise.reject(res.data)
    }

    return res.data
}, rej => {
    if (rej.response.status === 401){
        showFailToast("未登录")
        setTimeout(() => {
            router.push({ path: '/login' })
        }, 2000)
    }
    console.log(rej.response)
    return Promise.reject(rej.response.statusText)
})

export default axios
