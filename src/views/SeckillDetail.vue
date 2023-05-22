<!--
 author: Tsong
 time: 2023/4/23 00:00
-->
<template>
    <div class="seckill-detail">
        <s-header :name="'限时秒杀'"></s-header>
        <div class="detail-content">
            <div class="detail-swipe-wrap">
                <van-swipe class="my-swipe" indicator-color="#00b4ff" :autoplay="3000">
                    <van-swipe-item v-for="(item, index) in state.detail.goodsCarousel" :key="index">
                        <img :src="item">
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="product-info">
                <div class="product-title">
                    {{ state.detail.goodsName}}
                </div>
                <div class="product-desc">{{ state.detail.goodsIntro }}</div>
                <div class="product-price">
                    <span>¥{{ state.detail.seckillPrice }}</span>
                    <span>¥{{ state.detail.sellingPrice}}</span>
                </div>
            </div>
            <div class="product-intro">
                <ul>
                    <li>概述</li>
                    <li>参数</li>
                    <li>安装服务</li>
                    <li>常见问题</li>
                </ul>
                <div class="product-content" v-html="state.detail.goodsDetailContent"></div>
            </div>
        </div>
        <van-action-bar>
            <van-action-bar-icon icon="chat-o" text="客服" />
            <div class="count-down" v-if="state.time > 0 && state.disabled">
                <div class="count-down-title">秒杀开始还有：</div>
                <van-count-down
                  :time="state.time"
                  :auto-start="true"
                  format="DD 天 HH 时 mm 分 ss 秒"
                  @finish="handleStartCountDownFinish"
                />
            </div>
            <div class="count-down" v-if="state.endTime > 0 && !state.disabled">
                <div class="count-down-title">秒杀结束还有：</div>
                <van-count-down
                    :time="state.endTime"
                    :auto-start="true"
                    format="DD 天 HH 时 mm 分 ss 秒"
                    @finish="handleEndCountDownFinish"
                />
            </div>
            <van-action-bar-button type="warning" @click="handleSeckill" :text="state.buttonText" :disabled="state.disabled" />
        </van-action-bar>
    </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import sHeader from '@/components/SimpleHeader.vue'
import {checkSeckillStock, getSeckillDetails, getSeckillExposer} from "@/service/seckill.js";
const route = useRoute()
const router = useRouter()

const state = reactive({
    detail: {
        seckillId:'',
        goodsName:'',
        goodsIntro: '',
        goodsCoverImg: '',
        sellingPrice: 0,
        seckillPrice: 0,
        goodsCarousel: [],
        goodsDetailContent: '',
        seckillBegin: '',
        seckillEnd: ''
    },
    time: 0,
    endTime: 0,
    disabled: true,
    buttonText: '',
    checkStockInterval: null
})

onMounted(async () => {
    const { id } = route.params
    try{
        const { data } = await getSeckillDetails(id)
        state.detail = data
        const now = new Date().getTime()
        const begin = new Date(state.detail.seckillBegin).getTime()
        const end = new Date(state.detail.seckillEnd).getTime()
        initCountDown(now, begin, end)
    } catch (e) {
        router.go(-1)
    }
})

const initCountDown = (now, begin, end) => {
    if (now < begin){
        state.time = begin - now
        state.disabled = true
        state.buttonText = '尚未开始'
    } else if (now > end){
        state.time = 0
        state.disabled = true
        state.buttonText = '已结束'
    } else {
        state.time = 0
        state.endTime = end - now
        state.disabled = false
        state.buttonText = '立即秒杀'
        initCheckStock()
    }
}

const initCheckStock = () => {
    state.checkStockInterval = setInterval(async () => {
        try {
            await checkSeckillStock(state.detail.seckillId)
            state.disabled = false
            state.buttonText = '立即秒杀'
        } catch (e) {
            state.disabled = true
            state.buttonText = '已抢光'
        }
    }, 1000)
}

nextTick(() => {
    // 一些和DOM有关的东西
    const content = document.querySelector('.detail-content')
    content.scrollTop = 0
})

const goBack = () => {
    router.go(-1)
}

const handleStartCountDownFinish = () => {
    state.disabled = false
    state.buttonText = '立即秒杀'
}

const handleEndCountDownFinish = () => {
    state.disabled = true
    state.buttonText = '已结束'
}

const handleSeckill = async () => {
    const {data:{seckillStatusEnum, md5, now, start, end} } = await getSeckillExposer(state.detail.seckillId)
    if (seckillStatusEnum === 'START'){
        state.disabled = true
        await router.push({
            path: '/create-order',
            query: {
                seckillId: state.detail.seckillId,
                md5: md5
            }
        })
    } else if (seckillStatusEnum === 'STARTED_SHORTAGE_STOCK'){
        state.disabled = true
        state.buttonText = '已抢光'
    } else {
        state.disabled = true
        initCountDown(now, start, end)
    }
    clearInterval(state.checkStockInterval)
}

</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.seckill-detail {
  .detail-header {
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
    .product-name {
      font-size: 14px;
    }
  }
  .detail-content {
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y: auto;
    .detail-swipe-wrap {
        align-items: center;
      .my-swipe .van-swipe-item {
        img {
          width: 100%;
          object-fit: contain;
           height: 300px;
        }
      }
    }
    .product-info {
      padding: 0 10px;
      .product-title {
        font-size: 18px;
        text-align: left;
        color: #333;
      }
      .product-desc {
        font-size: 14px;
        text-align: left;
        color: #999;
        padding: 5px 0;
      }
      .product-price {
        .fj(flex-start);
          align-items: center;
          span:nth-child(1) {
          color: #F63515;
          font-size: 22px;
        }
        span:nth-child(2) {
          margin-left: 10px;
          color: #999;
          font-size: 16px;
          text-decoration: line-through;
        }
      }
    }
    .product-intro {
      width: 100%;
      padding-bottom: 50px;
      ul {
        .fj();
        width: 100%;
        margin: 10px 0;
        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          font-size: 15px;
          border-right: 1px solid #999;
          box-sizing: border-box;
          &:last-child {
            border-right: none;
          }
        }
      }
      .product-content {
        padding: 0 20px;
          img {
          width: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .count-down{
    height: 100%;
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    .count-down-title{
      font-size: 14px;
    }
  }
  .van-action-bar-button--warning {
    background: linear-gradient(to right, #FF6B01, #F63515)
  }
  .van-action-bar-button--danger {
    background: linear-gradient(to right, #0dc3c3, #098888)
  }
}
</style>
