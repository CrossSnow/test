import Taro from '@tarojs/taro';
import type { UserInfo, LoginResult } from '@/types/flower';

const USER_INFO_KEY = 'user_info';
const LOGIN_STATUS_KEY = 'login_status';

/**
 * 检查用户是否已登录
 */
export const isAuthenticated = (): boolean => {
  try {
    const loginStatus = Taro.getStorageSync(LOGIN_STATUS_KEY);
    return !!loginStatus;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfo = Taro.getStorageSync(USER_INFO_KEY);
    return userInfo || null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

/**
 * 保存用户信息
 */
export const saveUserInfo = (userInfo: UserInfo): void => {
  try {
    Taro.setStorageSync(USER_INFO_KEY, userInfo);
    Taro.setStorageSync(LOGIN_STATUS_KEY, true);
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

/**
 * 清除用户登录状态
 */
export const clearAuthData = (): void => {
  try {
    Taro.removeStorageSync(USER_INFO_KEY);
    Taro.removeStorageSync(LOGIN_STATUS_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * 微信一键登录
 */
export const wechatLogin = async (): Promise<LoginResult> => {
  try {
    // Simulate login success with mock user data
    const mockUserInfo: UserInfo = {
      openid: 'mock_openid_' + Date.now(),
      nickname: '测试用户',
      avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epDQicWJHpIctFjiaibzYmZKbUf2p8lQwBkCiaA8VvOyibicr6uRnZoJibiaYh2iauEic8rN4y9iaXiaicic4aK5Z2iaA/132',
      gender: 0,
      city: '北京',
      province: '北京',
      country: '中国'
    };

    // Save user information to local storage
    saveUserInfo(mockUserInfo);

    return {
      success: true,
      userInfo: mockUserInfo
    };
  } catch (error: any) {
    console.error('WeChat login error:', error);
    return {
      success: false,
      error: error.message || '登录过程中出现错误'
    };
  }
};