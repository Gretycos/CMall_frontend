<!--
author: Tsong
time: 2023/4/20 12:29
-->
<template>
    <div class="home">
        <header class="home-header wrap" :class="{'active' : state.headerScroll}">
            <div class="header-search">
                <span class="app-name">CMall</span>
                <i class="icon-search">
                    <van-icon name="search" />
                </i>
                <router-link tag="span" class="search-title" to="./product-list?from=home">
                        搜索商品
                </router-link>
            </div>
            <router-link class="login" tag="span" to="./login" v-if="!state.isLogin">登录</router-link>
            <router-link class="login" tag="span" to="./user" v-else>
                <van-icon name="user-o" />
            </router-link>
        </header>
        <nav-bar />
        <swiper :list="state.carouselList"></swiper>
        <div class="category-list">
            <div v-for="item in state.categoryList" v-bind:key="item.id" @click="handleCategoryClick(item.id)">
                <img :src="item.imgUrl">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="goods">
            <header class="goods-header" v-if="state.isLogin">秒杀专区</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="goods-box">
                    <div class="goods-item" v-for="item in state.seckillList" :key="item.goodsId" @click="goToSeckill(item)">
                        <img :src="item.goodsCoverImg" alt="">
                        <div class="goods-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <span class="seckill-price">¥ {{ item.seckillPrice }}</span>
                            <span class="origin-price">¥ {{ item.sellingPrice }}</span>
                            <div class="begin-time">抢购时间 {{convertBegin(item.seckillBegin)}}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <div class="goods">
            <header class="goods-header">新品上线</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="goods-box">
                    <div class="goods-item" v-for="item in state.newGoodsList" :key="item.goodsId" @click="goToDetail(item)">
                        <img :src="item.goodsCoverImg" alt="">
                        <div class="goods-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">¥ {{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <div class="goods">
            <header class="goods-header">热门商品</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="goods-box">
                    <div class="goods-item" v-for="item in state.hotGoodsList" :key="item.goodsId" @click="goToDetail(item)">
                        <img :src="item.goodsCoverImg" alt="">
                        <div class="goods-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">¥ {{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <div class="goods" :style="{ paddingBottom: '100px'}">
            <header class="goods-header">最新推荐</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="goods-box">
                    <div class="goods-item" v-for="item in state.recommendGoodsList" :key="item.goodsId" @click="goToDetail(item)">
                        <img :src="item.goodsCoverImg" alt="">
                        <div class="goods-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">¥ {{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper.vue'
import navBar from '@/components/NavBar.vue'
import { getHomePage } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import {getSeckillList} from "@/service/seckill.js";
// 全局状态store
const cart = useCartStore()
const router = useRouter()
// reactive定义响应式对象
const state = reactive({
    carouselList: [], // 轮播图列表
    isLogin: false, // 是否已登录
    headerScroll: false, // 滚动透明判断
    hotGoodsList: [],
    newGoodsList: [],
    recommendGoodsList: [],
    seckillList: [],
    categoryList: [
        {
            name: '超市',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
            id: 1
        }, {
            name: '服饰',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
            id: 2
        }, {
            name: '全球购',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
            id: 3
        }, {
            name: '生鲜',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
            id: 4
        }, {
            name: '到家',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
            id: 5
        }, {
            name: '充值缴费',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
            id: 6
        }, {
            name: '9.9元拼',
            imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
            id: 7
        }, {
            name: '领劵',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
            id: 8
        }, {
            name: '省钱',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
            id: 9
        }, {
            name: '全部',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
            id: 10
        }
    ],
    loading: true
})
onMounted(async () => {
    const token = getLocal('token')
    if (token) {
        state.isLogin = true
        // 获取购物车数据.
        await cart.updateCart()
    }
    showLoadingToast({
        message: '加载中...',
        forbidClick: true
    });
    const { data } = await getHomePage()
    state.carouselList = data.carouselList
    state.newGoodsList = data.newGoodsList
    state.hotGoodsList = data.hotGoodsList
    state.recommendGoodsList = data.recommendGoodsList
    if (state.isLogin){
        const {data:seckillList} = await getSeckillList()
        state.seckillList = seckillList
    }
    state.loading = false
    closeToast()
})

// dom树更新的回调函数
nextTick(() => {
    document.body.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
    })
})

const convertBegin = (seckillBegin) => {
    const length = seckillBegin.length
    return seckillBegin.substring(5, length - 3)
}

const goToDetail = (item) => {
    router.push({ path: `/product/${item.goodsId}` })
}

const goToSeckill = (item) => {
  router.push({ path: `/seckill/${item.seckillId}` })
}

const handleCategoryClick = (id) => {
    if (id === 8){
        router.push({path: '/coupon'})
    } else {
        showToast('敬请期待');
    }
}
</script>


<style lang="less" scoped >
@import '../common/style/mixin';
.home{
    overflow-y: auto;
}
.home-header {
    position: fixed;
    left: 0;
    top: 0;
    .wh(100%, 50px);
    .fj();
    line-height: 50px;
    padding: 0 15px;
    .boxSizing();
    font-size: 15px;
    color: #fff;
    z-index: 10000;
    .menu2 {
        color: @primary;
    }
    &.active {
        background: @primary;
        .menu2 {
            color: #fff;
        }
        .login {
            color: #fff;
        }
    }

    .header-search {
        display: flex;
        width: 74%;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: rgba(255, 255, 255, .7);
        border-radius: 20px;
        .app-name {
            padding: 0 10px;
            color: @primary;
            font-size: 20px;
            font-weight: bold;
            border-right: 1px solid #666;
        }
        .icon-search {
            padding: 0 10px;
            font-size: 17px;
        }
        .search-title {
            font-size: 12px;
            color: #666;
            line-height: 21px;
            width: 100%;
        }
    }
    .login {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
            font-size: 20px;
            vertical-align: -3px;
        }
    }
}
.category-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;
    div {
        display: flex;
        flex-direction: column;
        width: 20%;
        text-align: center;
        img {
            .wh(36px, 36px);
            margin: 13px auto 8px auto;
            cursor: pointer;
        }
    }
}
.goods {
    .goods-header {
        background: #f9f9f9;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: @primary;
        font-size: 16px;
        font-weight: 500;
    }
    .goods-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .goods-item {
            box-sizing: border-box;
            width: 50%;
            border-bottom: 1PX solid #e9e9e9;
            padding: 10px 10px;
            img {
                display: block;
                width: 120px;
                margin: 0 auto;
            }
            .goods-desc {
                text-align: center;
                font-size: 14px;
                padding: 10px 0;
                .title {
                    color: #222333;
                }
                .price {
                    color: @primary;
                }
                .origin-price{
                    margin-left: 3px;
                    font-size: 10px;
                    text-decoration-line: line-through;
                }
                .seckill-price{
                    color: #F63515;
                    font-size: 16px;
                }
                .begin-time{
                    color: #00b4ff;
                    font-size: 12px;
                    font-weight: bold;
                }
            }
            &:nth-child(2n + 1) {
                border-right: 1PX solid #e9e9e9;
            }
        }
    }
}
.floor-list {
    width: 100%;
    padding-bottom: 50px;
    .floor-head {
        width: 100%;
        height: 40px;
        background: #F6F6F6;
    }
    .floor-content {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        width: 100%;
        .boxSizing();
        .floor-category {
            width: 50%;
            padding: 10px;
            border-right: 1px solid #dcdcdc;
            border-bottom: 1px solid #dcdcdc;
            .boxSizing();
            &:nth-child(2n) {
                border-right: none;
            }
            p {
                font-size: 17px;
                color: #333;
                &:nth-child(2) {
                    padding: 5px 0;
                    font-size: 13px;
                    color: @primary;
                }
            }
            .floor-products {
                .fj();
                width: 100%;
                img {
                    .wh(65px, 65px);
                }
            }
        }
    }
}
</style>
