import { Button, Image, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { MAX_FLOWER_PHOTOS } from '@/constants';
import { savePendingFlowerDraft } from '@/services/flowerService';
import type { FlowerPhoto } from '@/types/flower';
import './index.scss';

const locationPresets = ['客厅阳台', '卧室窗台', '厨房窗边', '办公室桌面'];

const createPhoto = (url: string): FlowerPhoto => ({
  id: `p_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
  url,
  uploadedAt: new Date().toISOString(),
});

export default function AddFlowerPage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<FlowerPhoto[]>([]);

  const choosePhotos = async () => {
    const remain = Math.max(MAX_FLOWER_PHOTOS - photos.length, 1);
    const res = await Taro.chooseImage({ count: remain, sizeType: ['compressed'] });
    const next = res.tempFilePaths.map(createPhoto);
    setPhotos((prev) => [...prev, ...next].slice(0, MAX_FLOWER_PHOTOS));
  };

  const submit = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入小花名称哦', icon: 'none' });
      return;
    }

    savePendingFlowerDraft({
      name: name.trim(),
      location: location.trim(),
      photos,
    });

    Taro.navigateTo({ url: '/pages/water-settings/index' });
  };

  return (
    <View className='container add-page'>
      <View className='card add-hero'>
        <Text className='add-hero-title'>添加小花</Text>
        <Text className='add-hero-subtitle'>先记录基础信息，再上传照片，下一步设置提醒即可。</Text>
      </View>

      <View className='card add-card'>
        <Text className='field-label'>花卉名称</Text>
        <Input className='input' placeholder='例如：绿萝、月季、多肉' value={name} onInput={(e) => setName(e.detail.value)} />
      </View>

      <View className='card add-card'>
        <Text className='field-label'>摆放位置</Text>
        <Input className='input' placeholder='例如：客厅阳台' value={location} onInput={(e) => setLocation(e.detail.value)} />
        <View className='preset-wrap'>
          {locationPresets.map((item) => (
            <Text key={item} className='preset-chip' onClick={() => setLocation(item)}>
              {item}
            </Text>
          ))}
        </View>
      </View>

      <View className='card add-card'>
        <View className='row-between'>
          <Text className='field-label'>上传图片（最多 {MAX_FLOWER_PHOTOS} 张）</Text>
          <Text className='add-count'>{photos.length}/{MAX_FLOWER_PHOTOS}</Text>
        </View>
        <Text className='add-tip'>建议至少上传 1 张正面照片，方便后续观察生长变化。</Text>
        <View className='photo-grid'>
          {photos.map((photo) => (
            <View key={photo.id} className='photo-item'>
              <Image src={photo.url} mode='aspectFill' className='photo-img' />
              <Text className='photo-del' onClick={() => setPhotos((prev) => prev.filter((p) => p.id !== photo.id))}>
                删除
              </Text>
            </View>
          ))}
          {photos.length < MAX_FLOWER_PHOTOS && (
            <View className='photo-slot' onClick={choosePhotos}>
              <Text>+ 图片</Text>
            </View>
          )}
        </View>
      </View>

      <Button className='primary-btn add-submit-btn' onClick={submit}>
        确认添加
      </Button>
    </View>
  );
}
