<!--
 author: Tsong
 time: 2023/4/22 22:54
-->
<template>
    <div class="cart-box">
        <s-header :name="'购物车'" :noback="true"></s-header>
        <div class="cart-body">
            <van-checkbox-group @change="groupChange" v-model="state.result" ref="checkboxGroup">
                <van-swipe-cell :right-width="70" v-for="(item, index) in state.list" :key="index">
                    <div class="goods-item">
                        <van-checkbox :name="item.cartItemId" />
                        <div class="goods-img"><img :src="item.goodsCoverImg" alt=""></div>
                        <div class="goods-desc">
                            <div class="goods-title">
                                <span>{{ item.goodsName }}</span>
                                <span>x{{ item.goodsCount }}</span>
                            </div>
                            <div class="goods-btn">
                                <div class="price">¥{{ item.sellingPrice }}</div>
                                <van-stepper
                                        integer
                                        :min="1"
                                        :max="5"
                                        :model-value="item.goodsCount"
                                        :name="item.cartItemId"
                                        async-change
                                        @change="onChange"
                                />
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button
                            square
                            icon="delete"
                            type="danger"
                            class="delete-button"
                            @click="deleteGoods(item.cartItemId)"
                        />
                    </template>
                </van-swipe-cell>
            </van-checkbox-group>
        </div>
        <van-submit-bar
                v-if="state.list.length > 0"
                class="submit-all van-hairline--top"
                :price="total * 100"
                button-text="结算"
                button-type="primary"
                @submit="onSubmit"
        >
            <van-checkbox @click="checkAll" v-model:checked="state.checkAll">全选</van-checkbox>
        </van-submit-bar>
        <div class="empty" v-if="!state.list.length">
            <img class="empty-cart" :src="emptyCartIcon" alt="空购物车">
            <div class="title">购物车空空如也</div>
            <van-button round color="#00b4ff" type="primary" @click="goTo" block>前往选购</van-button>
        </div>
        <nav-bar></nav-bar>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { showToast, showLoadingToast, closeToast, showFailToast } from 'vant'
import navBar from '@/components/NavBar.vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getCart, deleteCartItem, modifyCart } from '@/service/cart'
import emptyCartIcon from '@/assets/empty-cart.png'

const router = useRouter()
const cart = useCartStore()
const state = reactive({
    checked: false,
    list: [],
    all: false,
    result: [],
    checkAll: false
})

onMounted(() => {
    init()
})

const init = async () => {
    showLoadingToast({ message: '加载中...', forbidClick: true });
    const { data } = await getCart({ pageNumber: 1 })
    state.list = data
    state.result = data.map(item => item.cartItemId)
    closeToast()
}

const total = computed(() => {
    let sum = 0
    let _list = state.list.filter(item => state.result.includes(item.cartItemId))
    _list.forEach(item => {
        sum += item.goodsCount * item.sellingPrice
    })
    return sum
})

const goBack = () => {
    router.go(-1)
}

const goTo = () => {
    router.push({ path: '/home' })
}

const onChange = async (value, detail) => {
    if (value > 5) {
        showFailToast('超出单个商品的最大购买数量')
        return
    }
    if (value < 1) {
        showFailToast('商品不得小于0')
        return
    }
    /**
     * 数据没发生变化，直接返回，避免不必要的请求
     */
    // a?.b    a == null ? undefined : a.b
    if (state.list.find(item => item.cartItemId === detail.name)?.goodsCount === value) return
    showLoadingToast({ message: '修改中...', forbidClick: true });
    const params = {
        cartItemId: detail.name,
        goodsCount: value
    }
    await modifyCart(params)
    /**
     * 修改完成后，没有请求购物车列表，是因为会发生闪烁的问题，
     * 所以最好是手动给操作的购物车商品修改对应数据
     */
    state.list.forEach(item => {
        if (item.cartItemId === detail.name) {
            item.goodsCount = value
        }
    })
    closeToast()
}

const onSubmit = async () => {
    if (state.result.length === 0) {
        showFailToast('请选择商品进行结算')
        return
    }
    const params = JSON.stringify(state.result)
    router.push({ path: '/create-order', query: { cartItemIds: params } })
}

const deleteGoods = async (id) => {
    await deleteCartItem(id)
    setTimeout(async () => {
        await cart.updateCart()
        await init()
    }, 500)
}

const groupChange = (result) => {
    state.checkAll = result.length === state.list.length;
    state.result = result
}

const checkAll = () => {
    if (!state.checkAll) {
        state.result = state.list.map(item => item.cartItemId)
    } else {
        state.result = []
    }
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.cart-box {
  .cart-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .cart-name {
      font-size: 14px;
    }
  }
  .cart-body {
    margin: 16px 0 100px 0;
    padding-left: 10px;
    .goods-item {
      display: flex;
      .goods-img {
        img {
          .wh(100px, 100px);
          object-fit: cover;
        }
      }
      .goods-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;
        .goods-title {
          display: flex;
          justify-content: space-between;
        }
        .goods-btn {
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 64px;
    .van-checkbox {
      margin-left: 10px
    }
    .van-submit-bar__text {
      margin-right: 10px
    }
    .van-submit-bar__button {
      background: @primary;
    }
  }
  .van-checkbox__icon--checked .van-icon {
    background-color: @primary;
    border-color: @primary;
  }
}
</style>
