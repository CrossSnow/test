import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { isAuthenticated, wechatLogin, getUserInfo } from '@/services/authService';
import UsernamePasswordModal from '@/components/UsernamePasswordModal';
import type { UserInfo, LoginResult } from '@/types/flower';
import './index.scss';

const menus = [
  { title: '个人信息', path: '/pages/personal-info/index' },
  { title: '消息通知记录', path: '/pages/reminder-history/index' },
  { title: '意见反馈', path: '/pages/feedback/index' },
  { title: '关于我们', path: '' },
];

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUsernamePasswordModal, setShowUsernamePasswordModal] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (authenticated) {
      const userData = getUserInfo();
      if (userData) {
        setUserInfo(userData);
      }
    }
  };

  const handleLogin = async () => {
    Taro.showLoading({
      title: '登录中...'
    });

    try {
      const result = await wechatLogin();

      if (result.success) {
        setIsLoggedIn(true);
        setUserInfo(result.userInfo || null);

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        });
      } else {
        Taro.showToast({
          title: result.error || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Taro.showToast({
        title: '登录失败，请稍后重试',
        icon: 'none'
      });
    } finally {
      Taro.hideLoading();
    }
  };

  const handleUsernamePasswordLoginSuccess = (result: LoginResult) => {
    if (result.success) {
      setIsLoggedIn(true);
      setUserInfo(result.userInfo || null);
      setShowUsernamePasswordModal(false);
    }
  };

  // 如果未登录，显示登录提示
  if (!isLoggedIn) {
    return (
      <View className='container'>
        <View className='login-prompt card'>
          <Text className='login-prompt__title'>请先登录</Text>
          <Text className='login-prompt__desc'>登录后可以更好地管理您的花卉信息</Text>
          <View
            className='login-button'
            onClick={handleLogin}
          >
            <Text className='login-button__text'>微信一键登录</Text>
          </View>
          <View
            className='login-button secondary'
            onClick={() => setShowUsernamePasswordModal(true)}
          >
            <Text className='login-button__text'>用户名密码登录</Text>
          </View>
        </View>
        <UsernamePasswordModal
          visible={showUsernamePasswordModal}
          onClose={() => setShowUsernamePasswordModal(false)}
          onLoginSuccess={handleUsernamePasswordLoginSuccess}
        />
      </View>
    );
  }

  return (
    <View className='container'>
      <View className='profile-header card'>
        <Text className='profile-header__name'>{userInfo?.nickname || '微信用户'}</Text>
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
          <Text className='arrow'>›</Text>
        </View>
      ))}
    </View>
  );
}