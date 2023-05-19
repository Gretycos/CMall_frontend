<!--
 author: Tsong
 time: 2023/4/22 23:59
-->
<template>
    <div class="order-detail-box">
        <s-header :name="'订单详情'" @callback="close"></s-header>
        <div class="order-status">
            <div class="status-item">
                <label>订单状态：</label>
                <span>{{ state.detail.orderStatusString }}</span>
            </div>
            <div class="status-item">
                <label>订单编号：</label>
                <span>{{ state.detail.orderNo }}</span>
            </div>
            <div class="status-item">
                <label>下单时间：</label>
                <span>{{ state.detail.createTime }}</span>
            </div>
            <van-button v-if="state.detail.orderStatus === 3"
                        style="margin-bottom: 10px" color="#1baeae"
                        block
                        @click="handleConfirmOrder(state.detail.orderNo)">确认收货</van-button>
            <van-button v-if="state.detail.orderStatus === 0"
                        style="margin-bottom: 10px" color="#1baeae"
                        block
                        @click="showPayFn">去支付</van-button>
            <van-button v-if="!(state.detail.orderStatus < 0 || state.detail.orderStatus === 4)"
                        block
                        @click="handleCancelOrder(state.detail.orderNo)">取消订单</van-button>
            <van-button v-if="state.detail.orderStatus < 0 || state.detail.orderStatus === 4"
                        block
                        @click="handleDeleteOrder(state.detail.orderNo)">删除订单</van-button>
        </div>
        <div class="order-price">
            <div class="price-item">
                <label>商品金额：</label>
                <span>¥ {{ state.detail.totalPrice }}</span>
            </div>
            <div class="price-item">
                <label>配送方式：</label>
                <span>普通快递</span>
            </div>
        </div>
        <van-card
                v-for="item in state.detail.orderItemVOList"
                :key="item.goodsId"
                style="background: #fff"
                :num="item.goodsCount"
                :origin-price="item.sellingPrice * item.goodsCount === item.paidPrice ? null : item.sellingPrice * item.goodsCount"
                :price="item.paidPrice"
                desc="全场包邮"
                :title="item.goodsName"
                :thumb="item.goodsCoverImg"
        />
        <van-popup
                v-model:show="state.showPay"
                position="bottom"
                :style="{ height: '24%' }"
        >
            <div :style="{ width: '90%', margin: '0 auto', padding: '20px 0' }">
                <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="handlePayOrder(state.detail.orderNo, 1)">支付宝支付</van-button>
                <van-button color="#4fc08d" block @click="handlePayOrder(state.detail.orderNo, 2)">微信支付</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import {getOrderDetail, cancelOrder, confirmOrder, payOrder, deleteOrder} from '@/service/order'
import { showConfirmDialog, showLoadingToast, closeToast, showSuccessToast, closeDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const state = reactive({
    detail: {},
    showPay: false
})

onMounted(() => {
    init()
})

const init = async () => {
    showLoadingToast({
        message: '加载中...',
        forbidClick: true
    });
    const { id } = route.query
    const { data } = await getOrderDetail(id)
    state.detail = data
    closeToast()
}

const handleCancelOrder = (orderNo) => {
    showConfirmDialog({
        title: '确认取消订单？',
    }).then(async () => {
        await cancelOrder(orderNo)
        showSuccessToast('取消成功')
        setTimeout(()=>{
            init()
        }, 1000)
    }).catch(() => {
        // on cancel
    });
}

const handleDeleteOrder = (orderNo) => {
    showConfirmDialog({
        title: '确认删除订单？可联系管理员恢复',
    }).then( async() => {
        await deleteOrder(orderNo)
        showSuccessToast('删除成功')
        setTimeout(() => {
            router.go(-1)
        }, 1000)
    }).catch(() => {
        // on cancel
    });
}

const handleConfirmOrder = (orderNo) => {
    showConfirmDialog({
        title: '是否确认订单？',
    }).then(async () => {
        await confirmOrder(orderNo)
        showSuccessToast('确认成功')
        setTimeout(() => {
            init()
        }, 1000)
    }).catch(() => {
        // on cancel
    });
}

const showPayFn = () => {
    state.showPay = true
}

const handlePayOrder = async (id, type) => {
    await payOrder({ orderNo: id, payType: type })
    state.showPay = false
    init()
}

const close = () => {
    closeDialog()
}
</script>

<style lang="less" scoped>
.order-detail-box {
  background: #f7f7f7;
  .order-status {
    background: #fff;
    padding: 20px;
    font-size: 15px;
    .status-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
      span {

      }
    }
  }
  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;
    .price-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
      span {

      }
    }
  }
  .van-card {
    margin-top: 0;
  }
  .van-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
