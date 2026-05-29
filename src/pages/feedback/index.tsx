import { Button, Textarea, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

const FEEDBACK_KEY = 'flower_timer_feedback_list_v1';

export default function FeedbackPage() {
  const [content, setContent] = useState('');

  const submit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }

    const list = Taro.getStorageSync(FEEDBACK_KEY) || [];
    list.unshift({ id: Date.now(), content: content.trim(), createdAt: new Date().toISOString() });
    Taro.setStorageSync(FEEDBACK_KEY, list);
    setContent('');
    Taro.showToast({ title: '感谢反馈', icon: 'success' });
  };

  return (
    <View className='container'>
      <View className='section-title'>意见反馈</View>
      <View className='card'>
        <Textarea
          className='feedback-area'
          maxlength={300}
          value={content}
          placeholder='欢迎告诉我们你希望增加的功能或优化建议'
          onInput={(e) => setContent(e.detail.value)}
        />
      </View>
      <Button className='primary-btn' onClick={submit}>
        提交
      </Button>
    </View>
  );
}
