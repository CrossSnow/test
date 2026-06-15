import { Button, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { isAuthenticated, wechatLogin } from '@/services/authService';
import UsernamePasswordModal from '@/components/UsernamePasswordModal';
import { listFlowers, markFlowerWatered, syncDueReminderLogs } from '@/services/flowerService';
import type { Flower, LoginResult } from '@/types/flower';
import FlowerCard from '@/components/FlowerCard';
import './index.scss';

export default function MyFlowersPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUsernamePasswordModal, setShowUsernamePasswordModal] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
  };

  const handleLogin = async () => {
    Taro.showLoading({
      title: '登录中...'
    });

    try {
      // 模拟登录成功
      const result = await wechatLogin();

      if (result.success) {
        setIsLoggedIn(true);

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
      setShowUsernamePasswordModal(false);
      reload(); // Reload flowers after login
    }
  };

  const reload = () => {
    syncDueReminderLogs();
    setFlowers(listFlowers());
  };

  useDidShow(() => {
    if (isLoggedIn) {
      reload();
    }
  });

  const goDetail = (id: string) => Taro.navigateTo({ url: `/pages/flower-detail/view?id=${id}&source=my-flowers` });

  const goEdit = (id: string) => Taro.navigateTo({ url: `/pages/flower-detail/index?id=${id}` });

  const handleWatered = (id: string) => {
    markFlowerWatered(id);
    Taro.showToast({ title: '已更新浇水记录', icon: 'success' });
    reload(); // Refresh the list to update the watering status
  };

  // 如果未登录，显示登录提示
  if (!isLoggedIn) {
    return (
      <View className='container'>
        <View className='login-prompt card'>
          <Text className='login-prompt__title'>请先登录</Text>
          <Text className='login-prompt__desc'>登录后可以查看和管理您的花卉信息</Text>
          <Button
            className='login-button'
            onClick={handleLogin}
          >
            <Text className='login-button__text'>微信一键登录</Text>
          </Button>
          <Button
            className='login-button secondary'
            onClick={() => setShowUsernamePasswordModal(true)}
          >
            <Text className='login-button__text'>用户名密码登录</Text>
          </Button>
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
      <View className='row-between page-head'>
        <View className='section-title'>我的小花</View>
        <Button className='add-mini-btn' onClick={() => Taro.navigateTo({ url: '/pages/add-flower/index' })}>
          + 添加小花
        </Button>
      </View>

      {flowers.length === 0 ? (
        <View className='empty-state'>
          <Text className='empty-text'>您还没有添加任何小花</Text>
          <Button
            className='primary-btn'
            onClick={() => Taro.navigateTo({ url: '/pages/add-flower/index' })}
          >
            立即添加
          </Button>
        </View>
      ) : (
        <View className='flower-list'>
          {flowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              onDetailClick={goDetail}
              onEditClick={goEdit}
              onWatered={handleWatered}
            />
          ))}
        </View>
      )}
    </View>
  );
}