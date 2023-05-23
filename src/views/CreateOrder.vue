<!--
 author: Tsong
 time: 2023/4/22 23:42
-->
<template>
    <div class="create-order">
        <s-header :name="'生成订单'" @callback="deleteLocal"></s-header>
        <div class="address-wrap">
            <div class="name" @click="goToAddress">
                <span>{{ state.address.userName }} </span>
                <span>{{ state.address.userPhone }}</span>
            </div>
            <div class="address">
                {{ state.address.provinceName }} {{ state.address.cityName }} {{ state.address.regionName }} {{ state.address.detailAddress }}
            </div>
            <van-icon class="arrow" name="arrow" />
        </div>
        <div class="goods" v-if="!state.isSeckillOrder">
            <div class="goods-item" v-for="(item, index) in state.cartList" :key="index">
                <div class="good-img"><img :src="item.goodsCoverImg" alt=""></div>
                <div class="goods-desc">
                    <div class="goods-title">
                        <span>{{ item.goodsName }}</span>
                        <span>x{{ item.goodsCount }}</span>
                    </div>
                    <div class="goods-btn">
                        <div class="price">¥{{ item.sellingPrice }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="goods" v-else>
            <div class="goods-item">
                <div class="good-img"><img :src="state.seckillItem.goodsCoverImg" alt=""></div>
                <div class="goods-desc">
                    <div class="goods-title">
                        <span>{{ state.seckillItem.goodsName }}</span>
                        <span>x1</span>
                    </div>
                    <div class="goods-btn">
                        <div class="price">¥{{ state.seckillItem.seckillPrice }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pay-wrap">
            <van-coupon-cell
                :coupons="state.couponList"
                :chosen-coupon="state.chosenCoupon"
                @click="state.showCouponList = true"
                v-if="!state.isSeckillOrder"
            />
            <div class="price">
                <span>商品金额</span>
                <span class="price-num">¥{{ total }}</span>
            </div>
            <van-button @click="handleCreateOrder" class="pay-btn" color="#1baeae" type="primary" block>生成订单</van-button>
        </div>
        <van-popup
                closeable
                :close-on-click-overlay="false"
                v-model:show="state.showPay"
                position="bottom"
                :style="{ height: '30%' }"
                @close="close"
        >
            <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
                <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="handlePayOrder(1)">支付宝支付</van-button>
                <van-button color="#4fc08d" block @click="handlePayOrder(2)">微信支付</van-button>
            </div>
        </van-popup>
        <van-popup
            v-model:show="state.showCouponList"
            position="bottom"
            style="height: 80%; padding-top: 10px;"
            v-if="!state.isSeckillOrder"
        >
            <van-coupon-list
                :coupons="state.couponList"
                :chosen-coupon="state.chosenCoupon"
                @change="handleCouponChange"
                @exchange="handleCouponExchange"
            />
        </van-popup>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive} from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import {getByCartItemIds} from '@/service/cart'
import {getAddressDetail, getDefaultAddress} from '@/service/address'
import {createOrder, createSeckillOrder, payOrder} from '@/service/order'
import {getLocal, prefix, removeLocal, setLocal} from '@/common/js/utils'
import {closeToast, showLoadingToast, showSuccessToast} from 'vant'
import {useRoute, useRouter} from 'vue-router'
import {executeSeckill, getSeckillDetails} from "@/service/seckill.js";

const router = useRouter()
const route = useRoute()
const state = reactive({
    cartList: [],
    address: {},
    showPay: false,
    showCouponList: false,
    orderNo: '',
    cartItemIds: [],
    couponList: [],
    chosenCoupon: -1,
    isSeckillOrder: false,
    seckillId: '',
    seckillSuccessId: '',
    md5: '', // exposer的密钥，不是秒杀成功的密钥
    seckillItem: {}
})

onMounted(() => {
    init()
})

const init = async () => {
    showLoadingToast({ message: '加载中...', forbidClick: true });
    const { addressId, cartItemIds, seckillId, md5 } = route.query
    if (seckillId && md5){
        state.isSeckillOrder = true
        const {data} = await getSeckillDetails(seckillId)
        state.seckillId = seckillId
        state.seckillItem = data
        state.md5 = md5
    } else {
        const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(getLocal('cartItemIds'))
        setLocal('cartItemIds', cartItemIds)
        const { data: {itemsForConfirmPage, myCouponVOList}} = await getByCartItemIds({ cartItemIds: _cartItemIds })
        state.cartList = itemsForConfirmPage
        state.couponList = myCouponVOList.map(e => {
            return {
                id: e.couponId,
                couponUserId: e.couponUserId,
                name: e.couponName,
                condition: e.couponDesc,
                description: parseGoodsType(e.goodsType) + e.goodsValue,
                value: e.discount * 100,
                valueDesc: e.discount,
                unitDesc: '元',
                startAt: new Date(e.couponStartTime).getTime() / 1000,
                endAt: new Date(e.couponEndTime).getTime() / 1000
            }
        })
    }

    const { data: address} = addressId ? await getAddressDetail(addressId) : await getDefaultAddress()
    if (!address) {
        goToAddress()
        return
    }
    state.address = address
    closeToast()
}

const parseGoodsType = (type) => {
    return type === 0? '全场通用' : type === 1 ? '类型限制: ' : '商品限制: '
}


const goToAddress = () => {
    router.push({
        path: '/address',
        query: {
            from: 'create-order',
            cartItemIds: JSON.stringify(state.cartItemIds),
            seckillId: state.seckillId,
            md5: state.md5
        }
    })
}

const deleteLocal = () => {
    removeLocal('cartItemIds')
}

const handleCouponChange = (index) => {
    state.showCouponList = false
    state.chosenCoupon = index
}

const handleCouponExchange = (code) => {
    console.log(code)
}

const handleCreateOrder = async () => {
    showLoadingToast({
        message: '创建订单中...',
        forbidClick: true,
        onClose:() => {
            state.showPay = true
        }
    })
    if (!state.isSeckillOrder){
        let params = {
            addressId: state.address.addressId,
            cartItemIds: state.cartList.map(item => item.cartItemId)
        }
        if (state.chosenCoupon !== -1){
            params.couponUserId = state.couponList[state.chosenCoupon].couponUserId
        }
        const { data } = await createOrder(params)
        removeLocal('cartItemIds')
        state.orderNo = data
    } else {
        const exe_params = {
            seckillId: state.seckillId,
            md5: state.md5
        }
        const {data:{seckillSuccessId, md5}} = await executeSeckill(exe_params)
        const params = {
            seckillSuccessId: seckillSuccessId,
            seckillSecretKey: md5,
            addressId: state.address.addressId
        }
        const {data} = await createSeckillOrder(params)
        state.orderNo = data
    }
    setTimeout(() => {
        closeToast()
    }, 1000)
}

const close = () => {
    router.push({ path: '/order' })
}

const handlePayOrder = async (type) => {
    await payOrder({ orderNo: state.orderNo, payType: type })
    showSuccessToast('支付成功')
    setTimeout(() => {
        router.push({ path: '/order' })
    }, 2000)
}

const total = computed(() => {
    if (!state.isSeckillOrder){
        let sum = 0
        state.cartList.forEach(item => {
            sum += item.goodsCount * item.sellingPrice
        })
        let discount = state.chosenCoupon === -1 ? 0 : state.couponList[state.chosenCoupon].value / 100
        return sum - discount
    } else {
        return state.seckillItem.seckillPrice
    }

})
</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.create-order {
  background: #f9f9f9;
  .address-wrap {
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name, .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }
  .goods {
    margin-bottom: 120px;
  }
  .goods-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        .wh(100px, 100px)
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
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    >div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      .price-num {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
