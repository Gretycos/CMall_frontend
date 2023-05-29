<template>
    <div class="coupon-box">
        <s-header :name="'领券中心'"></s-header>
        <div class="content">
            <van-pull-refresh :v-model="state.refreshing" @refresh="onRefresh" class="my-coupon-list-refresh">
                <van-list
                    v-model:loading="state.loading"
                    :finished="state.finished"
                    finished-text="没有更多了"
                    @load="loadCoupon"
                    @offset="10"
                >
                    <div class="van-coupon"
                         v-for="(item,idx) in state.list" :key="idx"
                    >
                        <div class="van-coupon__content">
                            <div class="van-coupon__head">
                                <h2 class="van-coupon__amount">
                                    {{item.discount}}
                                    <span>元</span>
                                </h2>
                                <p class="van-coupon__condition">{{item.couponDesc}}</p>
                            </div>
                            <div class =van-coupon__body>
                                <p class="van-coupon__name">{{item.couponName}}</p>
                                <p class="van-coupon__valid">{{parseValidTime(item.couponStartTime, item.couponEndTime)}}</p>
                                <van-button
                                    round
                                    type="primary"
                                    size="mini"
                                    :disabled="item.soldOut || item.hasReceived"
                                    @click="receiveCoupon(item.couponId, idx)"
                                >
                                    {{item.soldOut ? '已领完' : item.hasReceived ?'已领取':'领券'}}
                                </van-button>
                            </div>
                        </div>
                        <p class="van-coupon__description">{{parseGoodsType(item.goodsType) + item.goodsValueNames}}</p>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import {reactive} from "vue";
import {addCoupon, getCouponList} from "@/service/coupon.js";
import {convertTimeStamp} from "@/common/js/utils.js";
import {showSuccessToast} from "vant";

const state = reactive({
    loading: false,
    finished: false,
    refreshing: false,
    list: [],
    page: 1,
    totalPage: 0,
})

const loadCoupon = async () => {
    const { data, data: { list } } = await getCouponList({pageNumber: state.page})
    state.list = state.list.concat(list)
    state.totalPage = data.totalPage
    state.loading = false;
    if (state.page >= data.totalPage) state.finished = true
}

const onRefresh = () => {
    state.refreshing = true
    state.finished = false
    state.loading = true
    state.page = 1
    onLoad()
}

const onLoad = () => {
    if (!state.refreshing && state.page < state.totalPage) {
        // console.log(state.page)
        // console.log(state.totalPage)
        state.page = state.page + 1
    }
    if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
    }
    loadCoupon()
}

const parseValidTime = (startTime, endTime) => {
    if (startTime == null){
        return '领券后7天内有效'
    }
    return convertTimeStamp(startTime, 'YYYY-MM-DD hh:mm:ss') + ' - ' + convertTimeStamp(endTime, 'YYYY-MM-DD hh:mm:ss')
}

const parseGoodsType = (type) => {
    return type === 0? '全场通用' : type === 1 ? '类型限制: ' : '商品限制: '
}

const receiveCoupon = async (couponId, idx) => {
    const params = {
        couponId: couponId
    }
    await addCoupon(params)
    state.list[idx].hasReceived = true
    showSuccessToast('领取成功')
}
</script>

<style scoped lang="less">
.content{
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    margin-top: 34px;
    .van-button{
        margin: 5px;
    }
}
</style>
