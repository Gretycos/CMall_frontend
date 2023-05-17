/**
 * author: Tsong
 * time: 2023/5/16 19:15
 */
// postcss.config.cjs
// 用 vite 创建项目，配置 postcss 需要使用 postcss.config.cjs，之前使用的 .postcssrc.js 已经被抛弃
// 具体配置可以去 postcss-pxtorem 仓库看看文档
module.exports = {
    "plugins": {
        "postcss-pxtorem": {
            rootValue: 40, // Vant 官方根字体大小是 37.5
            propList: ['*'],
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        }
    }
}
