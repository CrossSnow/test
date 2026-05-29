import { Text, View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { formatDateTime } from '@/services/date';
import { listReminderLogs } from '@/services/flowerService';
import type { ReminderLog } from '@/types/flower';
import './index.scss';

export default function ReminderHistoryPage() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);

  useDidShow(() => {
    setLogs(listReminderLogs());
  });

  return (
    <View className='container'>
      <View className='section-title'>提醒记录</View>
      {!logs.length && <View className='card muted'>暂无提醒记录</View>}

      {logs.map((log) => (
        <View className='card history-item' key={log.id}>
          <Text className={`history-tag ${log.kind === 'due' ? 'is-due' : 'is-watered'}`}>
            {log.kind === 'due' ? '提醒' : '浇水记录'}
          </Text>
          <Text className='history-text'>{log.message}</Text>
          <Text className='history-time'>{formatDateTime(log.createdAt)}</Text>
        </View>
      ))}
    </View>
  );
}
