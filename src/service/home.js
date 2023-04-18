/**
 * author: Tsong
 * time: 2023/4/18 18:17
 */
import axios from "@/common/js/axios"

export function getHomePage() {
    return axios.get('/index-infos');
}
