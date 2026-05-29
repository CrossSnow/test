import { Button, Image, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
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
    const remain = Math.max(10 - photos.length, 1);
    const res = await Taro.chooseImage({ count: remain, sizeType: ['compressed'] });
    const next = res.tempFilePaths.map(createPhoto);
    setPhotos((prev) => [...prev, ...next].slice(0, 10));
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
    <View className='container'>
      <View className='section-title'>添加小花</View>

      <View className='card'>
        <Text className='field-label'>花卉名称</Text>
        <Input className='input' placeholder='例如：绿萝、月季、多肉' value={name} onInput={(e) => setName(e.detail.value)} />
      </View>

      <View className='card'>
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

      <View className='card'>
        <View className='row-between'>
          <Text className='field-label'>上传图片（最多 10 张）</Text>
          <Text className='muted'>{photos.length}/10</Text>
        </View>
        <View className='photo-grid'>
          {photos.map((photo) => (
            <View key={photo.id} className='photo-item'>
              <Image src={photo.url} mode='aspectFill' className='photo-img' />
              <Text className='photo-del' onClick={() => setPhotos((prev) => prev.filter((p) => p.id !== photo.id))}>
                删除
              </Text>
            </View>
          ))}
          {photos.length < 10 && (
            <View className='photo-slot' onClick={choosePhotos}>
              <Text>+ 图片预留位</Text>
            </View>
          )}
        </View>
      </View>

      <Button className='primary-btn' onClick={submit}>
        确认添加
      </Button>
    </View>
  );
}
