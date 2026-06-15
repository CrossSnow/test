import { Button, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { usernamePasswordLogin } from '@/services/authService';
import type { LoginResult } from '@/types/flower';
import './UsernamePasswordModal.scss';

interface UsernamePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (result: LoginResult) => void;
}

export default function UsernamePasswordModal({
  visible,
  onClose,
  onLoginSuccess
}: UsernamePasswordModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) {
    return null;
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await usernamePasswordLogin({ username, password });
      
      if (result.success) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        onLoginSuccess(result);
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <View className="modal-overlay" onClick={handleCancel}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        <View className="modal-header">
          <Text className="modal-title">用户名密码登录</Text>
        </View>
        
        <View className="modal-body">
          <View className="input-group">
            <Input
              className="input-field"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onInput={(e) => setUsername(e.detail.value)}
            />
          </View>
          
          <View className="input-group">
            <Input
              className="input-field"
              type="password"
              placeholder="请输入密码"
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
            />
          </View>
        </View>
        
        <View className="modal-footer">
          <Button className="cancel-button" onClick={handleCancel}>
            取消
          </Button>
          <Button 
            className="login-button" 
            onClick={handleLogin} 
            disabled={loading}
            loading={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </View>
      </View>
    </View>
  );
}