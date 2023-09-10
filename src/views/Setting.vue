<!--
 author: Tsong
 time: 2023/4/23 00:02
-->
<template>
    <div class="setting-box">
        <s-header :name="'账号管理'"></s-header>
        <van-form ref="infoForm">
            <van-cell-group>
                <van-field v-model="state.nickName" label="昵称" :rules="state.rules.nickName" />
                <van-field v-model="state.introduceSign" label="个性签名" />
            </van-cell-group>
            <van-button round class="save-btn" color="#00b4ff" type="primary" @click="handleSubmitInfo" block>保存</van-button>
        </van-form>
        <van-form ref="passwordForm">
            <van-cell-group>
                <van-field v-model="state.originalPassword" type='password' label="原密码" :rules="state.rules.originalPassword" />
                <van-field v-model="state.password" type='password' label="新密码" :rules="state.rules.password" />
                <van-field v-model="state.password2" type='password' label="确认密码" :rules="state.rules.password2" />
            </van-cell-group>
            <van-button round class="save-btn" type="primary" color="#00b4ff" @click="handleSubmitPassword" block>修改密码</van-button>
        </van-form>
        <van-button round class="save-btn" type="primary" color="#00b4ff" @click="handleLogout" block>退出登录</van-button>
    </div>
</template>

<script setup>
import {reactive, onMounted, ref} from 'vue'
import md5 from 'js-md5'
import sHeader from '@/components/SimpleHeader.vue'
import {getUserInfo, editUserInfo, logout, editUserPassword} from '@/service/user'
import {removeLocal} from '@/common/js/utils'
import {closeToast, showLoadingToast, showSuccessToast} from 'vant'
import {useRouter} from "vue-router";

const infoForm = ref()
const passwordForm = ref()

const router = useRouter()

const checkPassword = (val) => {
    return val !== state.originalPassword
}

const checkPassword2 = (val) => {
    return val === state.password
}

const state = reactive({
    originalNickName: '',
    originalIntroduceSign: '',
    nickName: '',
    introduceSign: '',
    originalPassword: '',
    password: '',
    password2: '',
    rules: {
        nickName: [
            {required: true, message:'请填写昵称', trigger:['onBlur']}
        ],
        originalPassword: [
            {required: true, message:'请输入原密码', trigger:['onBlur']}
        ],
        password: [
            {required: true, message:'请输入新密码', trigger:['onBlur']},
            {validator: checkPassword, message:'新密码不能与原密码相同', trigger:['onBlur']},
        ],
        password2: [
            {required: true, message:'请再次输入新密码', trigger:['onBlur']},
            {validator: checkPassword2, message:'新密码不一致', trigger:['onBlur']}
        ],
    }
})

onMounted(async () => {
    const { data } = await getUserInfo()
    state.nickName = state.originalNickName = data.nickName
    state.introduceSign = state.originalIntroduceSign = data.introduceSign

})

const handleSubmitInfo = async () => {
    await infoForm.value.validate()
    const params = {
        nickName: state.nickName,
        introduceSign: state.introduceSign
    }
    await editUserInfo(params)
    showSuccessToast({
        message:'修改信息成功',
        onClose: () => {
            window.location.reload()
        }
    })
}

const handleSubmitPassword = async () => {
    await passwordForm.value.validate()
    const params = {
        originalPassword: md5(state.originalPassword),
        newPassword: md5(state.password)
    }
    await editUserPassword(params)
    showSuccessToast({
        message: '修改密码成功',
        onClose: () => {
            window.location.reload()
        }
    })
}

const handleLogout = async () => {
    showLoadingToast({
        message: '请稍后...',
        forbidClick: true,
        onClose:() => {
            // 需要刷新页面，否则 axios.js 文件里的 token 不会被重置
            window.location.href = '/'
        }
    })
    const { resultCode } = await logout()
    if (resultCode === 200) {
        removeLocal('token')
        closeToast()
    }
}
</script>

<style lang="less" scoped>
.setting-box {
  .save-btn {
    height: 30px;
    width: 80%;
    margin: 20px auto ;
  }
}
</style>
