import { Button, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import FlowerCard from '@/components/FlowerCard';
import { listFlowers, markFlowerWatered, syncDueReminderLogs } from '@/services/flowerService';
import type { Flower } from '@/types/flower';
import './index.scss';

export default function MyFlowersPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  const reload = () => {
    syncDueReminderLogs();
    setFlowers(listFlowers());
  };

  useDidShow(() => {
    reload();
  });

  const goDetail = (id: string) => Taro.navigateTo({ url: `/pages/flower-detail/index?id=${id}` });

  return (
    <View className='container'>
      <View className='row-between page-head'>
        <View className='section-title'>我的小花</View>
        <Button className='add-mini-btn' onClick={() => Taro.navigateTo({ url: '/pages/add-flower/index' })}>
          + 添加小花
        </Button>
      </View>

      {flowers.map((flower) => (
        <FlowerCard
          key={flower.id}
          flower={flower}
          onOpenDetail={goDetail}
          onWatered={(id) => {
            markFlowerWatered(id);
            reload();
          }}
        />
      ))}

      {!flowers.length && <View className='card muted'>还没有添加花卉，点击右上角开始。</View>}
    </View>
  );
}
