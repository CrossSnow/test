import { Button, Input, Picker, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { getUserInfo, isAuthenticated, saveUserInfo } from '@/services/authService';
import type { UserInfo } from '@/types/flower';
import './index.scss';

const genderOptions = ['未知', '男', '女'];

const createDefaultUser = (): UserInfo => ({
  openid: `local_${Date.now()}`,
  nickname: '微信用户',
  avatar: '',
  gender: 0,
  city: '',
  province: '',
  country: '中国',
});

export default function PersonalInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [editing, setEditing] = useState(false);

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(0);
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('中国');

  const loadUser = () => {
    if (!isAuthenticated()) {
      Taro.showToast({ title: '请先登录', icon: 'none' });
      Taro.navigateBack();
      return;
    }

    const current = getUserInfo() || createDefaultUser();
    setUserInfo(current);
    setNickname(current.nickname || '');
    setGender(current.gender || 0);
    setCity(current.city || '');
    setProvince(current.province || '');
    setCountry(current.country || '中国');
  };

  useDidShow(() => {
    loadUser();
  });

  const onEdit = () => {
    setEditing(true);
  };

  const onCancel = () => {
    if (!userInfo) return;
    setNickname(userInfo.nickname || '');
    setGender(userInfo.gender || 0);
    setCity(userInfo.city || '');
    setProvince(userInfo.province || '');
    setCountry(userInfo.country || '中国');
    setEditing(false);
  };

  const onSave = () => {
    if (!userInfo) return;
    if (!nickname.trim()) {
      Taro.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }

    const nextUser: UserInfo = {
      ...userInfo,
      nickname: nickname.trim(),
      gender,
      city: city.trim(),
      province: province.trim(),
      country: country.trim() || '中国',
    };

    saveUserInfo(nextUser);
    setUserInfo(nextUser);
    setEditing(false);
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  if (!userInfo) {
    return (
      <View className='container'>
        <View className='card muted'>正在加载个人信息...</View>
      </View>
    );
  }

  return (
    <View className='container personal-page'>
      <View className='card personal-hero'>
        <Text className='personal-hero-title'>个人信息</Text>
        <Text className='personal-hero-subtitle'>完善资料后，养花记录会更贴合你的使用习惯。</Text>
      </View>

      <View className='card personal-card'>
        <View className='row-between personal-row'>
          <Text className='field-label'>昵称</Text>
          {editing ? (
            <Input
              className='input personal-input'
              value={nickname}
              maxlength={20}
              onInput={(e) => setNickname(e.detail.value)}
            />
          ) : (
            <Text className='personal-value'>{userInfo.nickname || '未设置'}</Text>
          )}
        </View>

        <View className='row-between personal-row'>
          <Text className='field-label'>性别</Text>
          {editing ? (
            <Picker
              mode='selector'
              range={genderOptions}
              value={Math.max(0, Math.min(2, gender))}
              onChange={(e) => setGender(Number(e.detail.value))}
            >
              <View className='picker personal-picker'>{genderOptions[Math.max(0, Math.min(2, gender))]}</View>
            </Picker>
          ) : (
            <Text className='personal-value'>{genderOptions[Math.max(0, Math.min(2, userInfo.gender || 0))]}</Text>
          )}
        </View>

        <View className='row-between personal-row'>
          <Text className='field-label'>城市</Text>
          {editing ? (
            <Input className='input personal-input' value={city} maxlength={20} onInput={(e) => setCity(e.detail.value)} />
          ) : (
            <Text className='personal-value'>{userInfo.city || '未设置'}</Text>
          )}
        </View>

        <View className='row-between personal-row'>
          <Text className='field-label'>省份</Text>
          {editing ? (
            <Input
              className='input personal-input'
              value={province}
              maxlength={20}
              onInput={(e) => setProvince(e.detail.value)}
            />
          ) : (
            <Text className='personal-value'>{userInfo.province || '未设置'}</Text>
          )}
        </View>

        <View className='row-between personal-row no-border'>
          <Text className='field-label'>国家</Text>
          {editing ? (
            <Input
              className='input personal-input'
              value={country}
              maxlength={20}
              onInput={(e) => setCountry(e.detail.value)}
            />
          ) : (
            <Text className='personal-value'>{userInfo.country || '未设置'}</Text>
          )}
        </View>
      </View>

      {!editing ? (
        <Button className='primary-btn personal-btn' onClick={onEdit}>
          编辑信息
        </Button>
      ) : (
        <View className='personal-actions'>
          <Button className='personal-cancel-btn' onClick={onCancel}>
            取消
          </Button>
          <Button className='primary-btn personal-btn' onClick={onSave}>
            保存
          </Button>
        </View>
      )}
    </View>
  );
}
