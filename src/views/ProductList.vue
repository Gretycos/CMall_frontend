<!--
 author: Tsong
 time: 2023/4/23 00:01
-->
<template>
    <div class="product-list-wrap">
        <div class="product-list-content">
            <header class="search-header wrap">
                <i @click="goBack">
                    <van-icon name="revoke" />
                </i>
                <div class="header-search">
                    <i class="icon-search">
                        <van-icon name="search" />
                    </i>
                    <input class="search-input" v-model="state.keyword" @input="onInputChange"/>
                    <van-button class="search-btn" @click="getSearch">搜索</van-button>
                </div>
            </header>
        </div>
        <div class="content" v-if="state.suggestionList.length >0">
            <van-list
                v-model:loading="state.suggestionLoading"
                :finished="state.suggestionFinished"
                @load="onSuggestionLoad">
                <van-cell :clickable="true" v-for="item in state.suggestionList" :key="item" :title="item" @click="onSuggestionClick(item)" />
            </van-list>
        </div>
        <div class="content" v-else>
            <van-tabs type="card" color="#00b4ff" @click-tab="changeTab">
                <van-tab title="推荐" name=""></van-tab>
                <van-tab title="新品" name="new"></van-tab>
                <van-tab title="价格" name="price"></van-tab>
            </van-tabs>
            <van-pull-refresh :v-model="state.refreshing" @refresh="onRefresh" class="product-list-refresh">
                <van-list
                        v-model:loading="state.loading"
                        :finished="state.finished"
                        :finished-text="state.productList.length ? '没有更多了' : '搜索想要的商品'"
                        @load="onLoad"
                        @offset="10"
                >
                    <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
                    <template v-if="state.productList.length">
                        <div class="product-item" v-for="(item, index) in state.productList" :key="index" @click="productDetail(item)">
                            <img :src="item.goodsCoverImg" />
                            <div class="product-info">
                                <p class="name">{{item.goodsName}}</p>
                                <p class="subtitle">{{item.goodsIntro}}</p>
                                <span class="price">￥ {{item.sellingPrice}}</span>
                            </div>
                        </div>
                    </template>
                    <img class="empty" v-else src="https://s.yezgea02.com/1604041313083/kesrtd.png" alt="搜索">
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {getSuggestion, search} from '@/service/goods'
import {prefix} from "@/common/js/utils.js";
const route = useRoute()
const router = useRouter()
const state = reactive({
    keyword: route.query.keyword || '',
    searchBtn: false,
    selectActive: false,
    refreshing: false,
    list: [],
    loading: false,
    finished: false,
    productList: [],
    totalPage: 0,
    page: 1,
    orderBy: '',
    suggestionList: [],
    suggestionLoading: false,
    suggestionFinished: true
})
const init = async () => {
    const { categoryId } = route.query
    if (!categoryId && !state.keyword) {
        state.finished = true
        state.loading = false;
        return
    }
    const { data, data: { list } } = await search({ pageNumber: state.page, goodsCategoryId: categoryId, keyword: state.keyword, orderBy: state.orderBy })

    state.productList = state.productList.concat(list)
    state.totalPage = data.totalPage
    state.loading = false;
    if (state.page >= data.totalPage) state.finished = true
}

const goBack = () => {
    router.go(-1)
}

const productDetail = (item) => {
    router.push({ path: `/product/${item.goodsId}` })
}

const getSearch = () => {
    onRefresh()
}

const onLoad = () => {
    if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1
    }
    if (state.refreshing) {
        state.productList = [];
        state.refreshing = false;
    }
    init()
}
const onInputChange = () => {
    onSuggestionLoad()
}
const onSuggestionLoad = async () => {
    if (state.keyword !== ""){
        state.suggestionLoading = true
        state.suggestionFinished = false
        const params = {
            key: state.keyword
        }
        const {data} = await getSuggestion(params)
        state.suggestionList = data
        state.suggestionLoading = false
        state.suggestionFinished = true
    }

}

const onSuggestionClick = (item) => {
    state.keyword = item
    state.suggestionList = []
}

const onRefresh = () => {
    state.refreshing = true
    state.finished = false
    state.loading = true
    state.page = 1
    onLoad()
}

const changeTab = ({ name }) => {
    console.log('name', name)
    state.orderBy = name
    onRefresh()
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.product-list-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  .search-header {
    .fj();
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .boxSizing();
    font-size: 15px;
    color: #656771;
    z-index: 10000;
    &.active {
      background: @primary;
    }
    .icon-left {
      font-size: 25px;
      font-weight: bold;
    }
      .header-search {
          .fj();
          width: 95%;
          line-height: 20px;
          margin: 10px 0;
          padding: 5px 0;
          color: #232326;
          background: #F7F7F7;
          align-items: center;
          .borderRadius(20px);
          .icon-search {
              padding: 0 5px 0 20px;
              font-size: 17px;
          }
          .search-input {
              width: 100%;
              height: 30px;
              font-size: 12px;
              color: #666;
              background: #F7F7F7;
          }
          .search-btn {
              width: 10%;
              height: 30px;
              color: #fff;
              font-size: 12px;
              background: @primary;
              .borderRadius(20px);
          }
      }
      .icon-More {
          font-size: 20px;
      }

  }
}
.content {
  height: calc(~"(100vh - 70px)");
  overflow: hidden;
  overflow-y: scroll;
  margin-top: 1.25rem;
}

.product-list-refresh {
  .product-item {
    .fj(flex-start);
    width: 100%;
    height: 120px;
    padding: 10px 0;
    border-bottom: 1px solid #dcdcdc;
    cursor: pointer;
    img {
      width: 120px;
      height: 100%;
      padding: 0 10px;
      object-fit: cover;
      .boxSizing();
    }
    .product-info {
      .fj();
      flex-direction: column;
      width: 50%;
      height: 100%;
      padding: 5px;
      text-align: left;
      .boxSizing();
      .name {
        width: 100%;
        max-height: 40px;
        line-height: 20px;
        font-size: 15px;
        color: #333;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .subtitle {
        width: 100%;
        max-height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: #999;
        overflow: hidden;
      }
      .price {
        color: @primary;
        font-size: 16px;
      }
    }
  }
  .empty {
    display: block;
    width: 150px;
    margin: 50px auto 20px;
  }
}
</style>
