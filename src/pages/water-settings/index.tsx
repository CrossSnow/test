import { Button, Input, Picker, Switch, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemo, useState } from 'react';
import { createFlowerWithSchedule, getPendingFlowerDraft } from '@/services/flowerService';
import type { ReminderMode } from '@/types/flower';
import './index.scss';

const presets = [1, 2, 3, 5, 7, 10];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function WaterSettingsPage() {
  const draft = getPendingFlowerDraft();
  const [intervalDays, setIntervalDays] = useState(3);
  const [customDays, setCustomDays] = useState('');
  const [hourIdx, setHourIdx] = useState(8);
  const [mode, setMode] = useState<ReminderMode>('loop');
  const [enabled, setEnabled] = useState(true);

  const finalInterval = useMemo(() => {
    const custom = Number(customDays);
    if (customDays && custom >= 1 && custom <= 30) return custom;
    return intervalDays;
  }, [customDays, intervalDays]);

  if (!draft) {
    return (
      <View className='container'>
        <View className='card muted'>未找到待设置花卉，请先返回添加小花页面。</View>
      </View>
    );
  }

  return (
    <View className='container'>
      <View className='section-title'>浇水时间设置</View>
      <View className='card'>
        <Text className='field-label'>当前花卉：{draft.name}</Text>
        <Text className='muted'>设置后会在首页显示下次浇水时间</Text>
      </View>

      <View className='card'>
        <Text className='field-label'>预设间隔（天）</Text>
        <View className='preset-wrap'>
          {presets.map((item) => (
            <Text
              key={item}
              className={`preset-chip ${item === intervalDays ? 'active' : ''}`}
              onClick={() => {
                setIntervalDays(item);
                setCustomDays('');
              }}
            >
              {item} 天
            </Text>
          ))}
        </View>

        <Text className='field-label mt'>自定义间隔（1-30 天）</Text>
        <Input
          className='input'
          type='number'
          value={customDays}
          placeholder='输入天数'
          onInput={(e) => setCustomDays(e.detail.value)}
        />
      </View>

      <View className='card'>
        <View className='row-between'>
          <Text className='field-label'>开启提醒</Text>
          <Switch checked={enabled} color='#2f8f4e' onChange={(e) => setEnabled(e.detail.value)} />
        </View>

        <Text className='field-label mt'>提醒时间（整点）</Text>
        <Picker mode='selector' range={hours} value={hourIdx} onChange={(e) => setHourIdx(Number(e.detail.value))}>
          <View className='picker'>{hours[hourIdx]}</View>
        </Picker>

        <Text className='field-label mt'>提醒模式</Text>
        <View className='preset-wrap'>
          <Text className={`preset-chip ${mode === 'once' ? 'active' : ''}`} onClick={() => setMode('once')}>
            仅一次提醒
          </Text>
          <Text className={`preset-chip ${mode === 'loop' ? 'active' : ''}`} onClick={() => setMode('loop')}>
            循环提醒（默认）
          </Text>
        </View>
      </View>

      <Button
        className='primary-btn'
        onClick={() => {
          createFlowerWithSchedule(draft, finalInterval, hourIdx, mode, enabled);
          Taro.showToast({ title: '设置成功', icon: 'success' });
          Taro.switchTab({ url: '/pages/home/index' });
        }}
      >
        确认设置
      </Button>
    </View>
  );
}
