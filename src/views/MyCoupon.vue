<template>
    <div class="my-coupon-box">
        <s-header :name="'我的优惠券'"></s-header>
        <van-tabs @click-tab="onChangeTab" :color="'#00b4ff'" :title-active-color="'#00b4ff'" class="my-coupon-tab" v-model="state.status">
            <van-tab title="可用" name="0"></van-tab>
            <van-tab title="不可用" name="1"></van-tab>
        </van-tabs>
        <div class="content">
            <van-pull-refresh :v-model="state.refreshing" @refresh="onRefresh" class="my-coupon-list-refresh">
                <van-list
                    v-model:loading="state.loading"
                    :finished="state.finished"
                    finished-text="没有更多了"
                    @load="loadCoupon"
                    @offset="10"
                >
                <div :class="state.status === '0' ? 'van-coupon' : 'van-coupon van-coupon--disabled'"
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
                            <p class="van-coupon__valid">{{parseValidTime(item.couponStartTime, item.couponEndTime, item.couponUserCreateTime)}}</p>
                        </div>
                    </div>
                    <p class="van-coupon__description">{{parseGoodsType(item.goodsType) + item.goodsValueNames}}</p>
                    <p class="van-coupon__description" v-if="state.status !== '0'">不可用原因：{{parseUseStatus(item.useStatus)}}</p>
                </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <van-action-bar>
            <van-action-bar-button type="danger" text="兑换优惠券" @click="openRedeemPopup"/>
        </van-action-bar>
        <van-popup
            v-model:show="state.showBottom"
            position="bottom"
            round
            :style="{ height: '10%' }"
            @closed="onPopupClosed"
        >
            <van-cell-group inset>
                <van-field
                    v-model="state.code"
                    center
                    clearable
                    label="优惠券兑换码"
                    placeholder="请输入兑换码"
                >
                    <template #button>
                        <van-button size="small" type="primary" @click="redeemCoupon">兑换</van-button>
                    </template>
                </van-field>
            </van-cell-group>
        </van-popup>
    </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import {reactive} from "vue";
import {addCoupon, getMyCouponList} from "@/service/coupon.js";
import {convertTimeStamp} from "@/common/js/utils.js";
import {showSuccessToast} from "vant";

const state = reactive({
    status: '0',
    loading: false,
    finished: false,
    refreshing: false,
    list: [],
    page: 1,
    totalPage: 0,
    showBottom: false,
    code: ''
})

const loadCoupon = async () => {
    const { data, data: { list } } = await getMyCouponList({pageNumber: state.page, useStatus: state.status})
    state.list = state.list.concat(list)
    state.totalPage = data.totalPage
    state.loading = false;
    if (state.page >= data.totalPage) state.finished = true
}

const onChangeTab = ({ name }) => {
    // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
    state.status = name
    onRefresh()
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

const parseValidTime = (startTime, endTime, createTime) => {
    if (startTime == null){
        const start = new Date(createTime)
        return convertTimeStamp(createTime,'YYYY-MM-DD hh:mm:ss') + ' - ' + convertTimeStamp(start.setDate(start.getDate() + 7),'YYYY-MM-DD hh:mm:ss')
    }
    return convertTimeStamp(startTime, 'YYYY-MM-DD hh:mm:ss') + ' - ' + convertTimeStamp(endTime, 'YYYY-MM-DD hh:mm:ss')
}

const parseGoodsType = (type) => {
    return type === 0? '全场通用' : type === 1 ? '类型限制: ' : '商品限制: '
}

const parseUseStatus = (useStatus) => {
    return useStatus === 1 ? '已使用' : '已失效'
}

const openRedeemPopup = () => {
    state.showBottom = true
}

const onPopupClosed = () => {
    state.code = ''
}

const redeemCoupon = async () => {
    const params = {
        couponCode: state.code
    }
    await addCoupon(params)
    showSuccessToast('兑换成功')
    setTimeout(() => {
        state.showBottom = false
        onRefresh()
    }, 2000)
}

</script>

<style scoped lang="less">
.content{
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    margin-top: 34px;
}
.van-action-bar-button--danger {
    background: linear-gradient(to right, #00b4ff, #00b4ff)
}
</style>
