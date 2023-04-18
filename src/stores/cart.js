/**
 * author: Tsong
 * time: 2023/4/18 18:22
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCart } from '@/service/cart'
export const useCartStore = defineStore('cart', () => {
    const count = ref(0)
    async function updateCart() {
        const { data = [] } = await getCart()
        count.value = data.length
    }

    return { count, updateCart }
})
