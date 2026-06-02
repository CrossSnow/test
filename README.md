# 花点时间（Taro 3 微信小程序）

基于 Taro 3 + React + TypeScript 实现的 1.0 原型版本，聚焦花卉浇水定时提醒。

## 已实现功能

- 首页：添加小花入口、花卉列表、待浇水状态、提醒记录入口
- 添加小花：名称、位置、最多 10 张图片（预留位）
- 浇水设置：预设/自定义间隔、提醒时间、提醒模式、开关
- 我的小花：卡片管理、快速标记已浇水
- 花卉详情：编辑信息、调整提醒、删除花卉、照片时间轴
- 提醒记录：本地模拟提醒与浇水记录
- 个人中心：我的小花、消息通知记录、意见反馈

## 启动方式

```bash
npm install
npm run dev:weapp
```

然后用微信开发者工具打开项目目录，`miniprogramRoot` 指向 `dist/`。

## 本地模拟数据说明

- 花卉与提醒数据：`src/services/flowerService.ts`
- 日期与时间工具：`src/services/date.ts`
- 数据类型定义：`src/types/flower.ts`

后续接入接口时，建议保留 `flowerService` 对外方法签名，替换内部的 `Taro.getStorageSync / setStorageSync` 为 HTTP 请求。
