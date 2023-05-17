<!--
 author: Tsong
 time: 2023/4/22 16:28
-->
<template>
    <van-swipe class="my-swiper" :autoplay="3000" indicator-color="#1baeae">
        <van-swipe-item v-for="(item, index) in list" :key="index">
            <img :src="item.carouselUrl" alt="" @click="goTo(item.redirectUrl)">
        </van-swipe-item>
    </van-swipe>
</template>

<script>
export default {
    props: {
        list: Array
    },
    methods: {
        goTo(url) {
            window.open(url)
        }
    }
}
</script>

<style lang='less' scoped>
.my-swiper {
    margin-top: 50px;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>
