<!--
 author: Tsong
 time: 2023/4/22 16:13
-->
<template>
    <header class="simple-header van-hairline--bottom">
        <i v-if="!isBack" @click="goBack">
            <van-icon name="revoke" />
        </i>
        <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
        <div class="simple-header-name">{{ name }}</div>
    </header>
    <div class="block" />
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
    props: {
        name: {
            type: String,
            default: ''
        },
        back: {
            type: String,
            default: ''
        },
        noback: {
            type: Boolean,
            default: false
        }
    },
    emits: ['callback'],
    setup(props, ctx) {
        const isBack = ref(props.noback)
        const router = useRouter()
        const goBack = () => {
            if (!props.back) {
                router.go(-1)
            } else {
                router.push({ path: props.back })
            }
            ctx.emit('callback')
        }
        return {
            goBack,
            isBack
        }
    }
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.simple-header {
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
  .simple-header-name {
    font-size: 14px;
  }
  i{
      cursor: pointer;
  }
}
.block {
  height: 44px;
}
</style>
