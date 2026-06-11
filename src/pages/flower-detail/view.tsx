import { Button, Image, Text, View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { MAX_FLOWER_PHOTOS } from '@/constants';
import { formatDateTime } from '@/services/date';
import { getFlower, updateFlower } from '@/services/flowerService';
import type { Flower, FlowerPhoto } from '@/types/flower';
import './index.scss';

const createPhoto = (url: string): FlowerPhoto => ({
  id: `p_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
  url,
  uploadedAt: new Date().toISOString(),
});

export default function FlowerDetailViewPage() {
  const router = useRouter();
  const flowerId = router.params?.id || '';
  const source = router.params?.source || '';
  const canAddPhotos = source === 'my-flowers';

  const [flower, setFlower] = useState<Flower | null>(null);

  const reload = () => {
    if (!flowerId) return;
    const f = getFlower(flowerId) || null;
    setFlower(f);
  };

  useDidShow(() => reload());

  const timeline = [...flower?.photos || []].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  if (!flower) {
    return (
      <View className='container'>
        <View className='card muted'>花卉不存在或已删除。</View>
      </View>
    );
  }

  // 预览大图方法：参数为当前点击图片url
  const previewBigImg = (currentUrl: string) => {
    // 提取所有图片url数组，实现左右滑动切换
    const allImgUrls = timeline.map(item => item.url);
    Taro.previewImage({
      current: currentUrl, // 当前预览图片
      urls: allImgUrls    // 全部图片列表
    })
  }

  const choosePhotos = async () => {
    if (flower.photos.length >= MAX_FLOWER_PHOTOS) {
      Taro.showToast({ title: `最多上传${MAX_FLOWER_PHOTOS}张`, icon: 'none' });
      return;
    }
    const remain = Math.max(MAX_FLOWER_PHOTOS - flower.photos.length, 1);
    const res = await Taro.chooseImage({ count: remain, sizeType: ['compressed'] });
    const next = res.tempFilePaths.map(createPhoto);
    updateFlower(flower.id, { photos: [...flower.photos, ...next].slice(0, MAX_FLOWER_PHOTOS) });
    reload();
  };

  return (
    <View className='container'>
      <View className='card detail-hero'>
        <Text className='detail-hero-title'>{flower.name}</Text>
        <Text className='detail-hero-subtitle'>记录每一次生长变化，见证它慢慢盛开。</Text>
        <View className='detail-meta'>
          <Text className='detail-location'>摆放位置：{flower.location}</Text>
          <Text className='detail-photo-count'>{timeline.length} 张照片</Text>
        </View>
      </View>

      <View className='card detail-timeline-card'>
        <View className='row-between timeline-header'>
          <Text className='field-label no-gap'>生长时间轴</Text>
          {canAddPhotos && (
            <Button size='mini' className='green-mini' onClick={choosePhotos}>
              + 新增图片
            </Button>
          )}
        </View>
        <Text className='timeline-count'>已上传 {timeline.length}/{MAX_FLOWER_PHOTOS}</Text>

        {!timeline.length && <View className='detail-empty'>暂无照片，添加后会展示在这里。</View>}
        {timeline.map((photo) => (
          <View key={photo.id} className='timeline-item detail-timeline-item row-between'>
            <View className='row detail-timeline-row' onClick={() => previewBigImg(photo.url)}>
              <Image className='timeline-img' src={photo.url} mode='aspectFill' />
              <Text className='timeline-time'>{formatDateTime(photo.uploadedAt)}</Text>
            </View>
            <Text className='timeline-view-text' onClick={() => previewBigImg(photo.url)}>查看</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
