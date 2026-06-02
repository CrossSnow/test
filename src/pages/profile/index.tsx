import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const menus = [
  { title: '我的小花', path: '/pages/my-flowers/index' },
  { title: '消息通知记录', path: '/pages/reminder-history/index' },
  { title: '意见反馈', path: '/pages/feedback/index' },
  { title: '关于我们', path: '' },
];

export default function ProfilePage() {
  return (
    <View className='container'>
      <View className='profile-header card'>
        <Text className='profile-header__name'>微信用户</Text>
        <Text className='profile-header__desc'>欢迎使用花点时间，浇水提醒已为你准备好。</Text>
      </View>

      <View className='section-title'>个人中心</View>
      {menus.map((menu) => (
        <View
          key={menu.title}
          className='profile-menu card row-between'
          onClick={() => {
            if (!menu.path) {
              Taro.showToast({ title: '1.0 版本持续完善中', icon: 'none' });
              return;
            }
            Taro.navigateTo({ url: menu.path });
          }}
        >
          <Text>{menu.title}</Text>
          <Text className='muted'> &gt; </Text>
        </View>
      ))}
    </View>
  );
}
