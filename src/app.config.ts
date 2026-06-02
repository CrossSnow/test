export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/my-flowers/index',
    'pages/profile/index',
    'pages/add-flower/index',
    'pages/water-settings/index',
    'pages/flower-detail/index',
    'pages/reminder-history/index',
    'pages/feedback/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2f8f4e',
    navigationBarTitleText: '花点时间',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f3fbf4',
  },
  tabBar: {
    color: '#6f7f73',
    selectedColor: '#2f8f4e',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/my-flowers/index',
        text: '我的小花',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      },
    ],
  },
});
