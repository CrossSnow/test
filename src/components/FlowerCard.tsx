import { Button, Image, Text, View } from '@tarojs/components';
import { formatDate } from '@/services/date';
import type { Flower } from '@/types/flower';
import './FlowerCard.scss';

interface FlowerCardProps {
  flower: Flower;
  onOpenDetail: (flowerId: string) => void;
  onWatered?: (flowerId: string) => void;
}

export default function FlowerCard({ flower, onOpenDetail, onWatered }: FlowerCardProps) {
  const due = new Date(flower.nextWateringAt).getTime() <= Date.now();

  return (
    <View className='flower-card'>
      <View className='flower-card__thumb'>
        {flower.photos[0]?.url ? (
          <Image className='flower-card__img' src={flower.photos[0].url} mode='aspectFill' />
        ) : (
          <Text className='flower-card__placeholder'>图片预留位</Text>
        )}
      </View>

      <View className='flower-card__body' onClick={() => onOpenDetail(flower.id)}>
        <View className='flower-card__top'>
          <Text className='flower-card__name'>{flower.name}</Text>
          <Text className={`flower-card__state ${due ? 'is-due' : ''}`}>{due ? '待浇水' : '状态正常'}</Text>
        </View>
        <Text className='flower-card__meta'>位置：{flower.location || '未设置'}</Text>
        <Text className='flower-card__meta'>下次浇水：{formatDate(flower.nextWateringAt)}</Text>
      </View>

      {onWatered && (
        <Button className='flower-card__btn' onClick={() => onWatered(flower.id)} size='mini'>
          已浇水
        </Button>
      )}
    </View>
  );
}
