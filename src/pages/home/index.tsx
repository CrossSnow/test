import { Button, Image, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { listFlowers, markFlowerWatered, syncDueReminderLogs } from '@/services/flowerService';
import type { Flower } from '@/types/flower';
import './index.scss';

export default function HomePage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  const reload = () => {
    syncDueReminderLogs();
    setFlowers(listFlowers());
  };

  useDidShow(() => {
    reload();
  });

  const goAdd = () => Taro.navigateTo({ url: '/pages/add-flower/index' });
  const goDetail = (id: string) => Taro.navigateTo({ url: `/pages/flower-detail/view?id=${id}&source=home` });

  const onWatered = (id: string) => {
    markFlowerWatered(id);
    Taro.showToast({ title: '已更新浇水记录', icon: 'success' });
    reload();
  };

  const dueCount = flowers.filter((f) => new Date(f.nextWateringAt).getTime() <= Date.now()).length;

  return (
    <View className='container home-page'>
      <View className='home-hero card'>
        <Text className='home-hero__title'>花点时间</Text>
        <Text className='home-hero__subtitle'>浇水不忘记，养花更省心</Text>
        <View className='row-between'>
          <Text className='chip'>待浇水 {dueCount} 盆</Text>
          <Text className='home-hero__link' onClick={() => Taro.navigateTo({ url: '/pages/reminder-history/index' })}>
            提醒记录
          </Text>
        </View>
      </View>

      <Button className='primary-btn home-add-btn' onClick={goAdd}>
        + 添加小花
      </Button>

      <View className='section-title'>我的花卉</View>
      {flowers.length === 0 ? (
        <View className='card home-empty'>
          <Text className='home-empty__icon'>🌱</Text>
          <Text className='home-empty__text'>还没有小花，先添加一盆吧</Text>
        </View>
      ) : (
        <View className="flower-grid">
          {flowers.map((flower) => (
            <View
              key={flower.id}
              className="flower-item"
              onClick={() => goDetail(flower.id)}
            >
              <Image
                className="flower-image"
                src={flower.photos[0]?.url || 'https://via.placeholder.com/150x150?text=花朵'}
                mode="aspectFill"
              />
              <Text className="flower-name">{flower.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
