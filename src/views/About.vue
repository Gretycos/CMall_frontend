<!--
 author: Tsong
 time: 2023/4/22 21:57
-->
<template>
    <div class="about">
        <s-header :name="'关于我们'"></s-header>
        <div class="about-body">
            <img class="intro-img" src="https://s.yezgea02.com/1604046067055/WechatIMG30231.jpeg" alt="">
            <van-divider :style="{ color: '#00b4ff', borderColor: '#00b4ff', fontSize: '20px', fontWeight: 500 }">简介</van-divider>
            <div>CMall 项目是一套电商系统，包括 CMall 商城系统及 CMall-admin 商城后台管理系统，基于 Spring Cloud 及相关微服务技术栈开发。 前台商城系统包含首页门户、商品分类、新品上线、首页轮播、商品推荐、商品搜索、商品展示、购物车、订单结算、订单流程、个人订单管理、会员中心、帮助中心等模块。 后台管理系统包含数据面板、轮播图管理、商品管理、订单管理、会员管理、分类管理、设置等模块。</div>
            <van-divider :style="{ color: '#00b4ff', borderColor: '#00b4ff', fontSize: '20px', fontWeight: 500 }">开源地址</van-divider>
        </div>
    </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
</script>

<style lang="less" scoped>
.about {
  box-sizing: border-box;
  padding: 20px;
  .intro-img {
    width: 100%;
  }
  .about-body {
    font-size: 16px;
    a {
      color: #007fff;
    }
  }
}
</style>
