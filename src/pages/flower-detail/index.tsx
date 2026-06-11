import { Button, Image, Input, Picker, Switch, Text, View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useMemo, useState } from 'react';
import { MAX_FLOWER_PHOTOS } from '@/constants';
import { formatDateTime } from '@/services/date';
import { getFlower, markFlowerWatered, removeFlower, updateFlower } from '@/services/flowerService';
import type { Flower, FlowerPhoto, ReminderMode } from '@/types/flower';
import './index.scss';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const createPhoto = (url: string): FlowerPhoto => ({
  id: `p_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
  url,
  uploadedAt: new Date().toISOString(),
});

export default function FlowerEditPage() {
  const router = useRouter();
  const flowerId = router.params?.id || '';

  const [flower, setFlower] = useState<Flower | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftInterval, setDraftInterval] = useState('');

  const reload = () => {
    if (!flowerId) return;
    const f = getFlower(flowerId) || null;
    setFlower(f);
    if (f) {
      setDraftName(f.name);
      setDraftLocation(f.location);
      setDraftInterval(`${f.intervalDays}`);
    }
  };

  useDidShow(() => reload());

  const hourIdx = useMemo(() => flower?.reminderHour || 8, [flower?.reminderHour]);

  if (!flower) {
    return (
      <View className='container'>
        <View className='card muted'>花卉不存在或已删除。</View>
      </View>
    );
  }

  const savePatch = (patch: Partial<Flower>) => {
    updateFlower(flower.id, patch);
    reload();
  };

  const choosePhotos = async () => {
    const remain = Math.max(MAX_FLOWER_PHOTOS - flower.photos.length, 1);
    const res = await Taro.chooseImage({ count: remain, sizeType: ['compressed'] });
    const next = res.tempFilePaths.map(createPhoto);
    savePatch({ photos: [...flower.photos, ...next].slice(0, MAX_FLOWER_PHOTOS) });
  };

  const timeline = [...flower.photos].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  // 预览大图方法：参数为当前点击图片url
  const previewBigImg = (currentUrl: string) => {
    // 提取所有图片url数组，实现左右滑动切换
    const allImgUrls = timeline.map(item => item.url);
    Taro.previewImage({
      current: currentUrl, // 当前预览图片
      urls: allImgUrls    // 全部图片列表
    })
  }

  return (
    <View className='container edit-page'>
      <View className='card edit-hero'>
        <Text className='edit-hero-title'>{flower.name}</Text>
        <Text className='edit-hero-subtitle'>可修改信息、提醒设置和生长照片，变更会自动保存。</Text>
      </View>

      <View className='card edit-card'>
        <Text className='field-label'>花卉名称</Text>
        <Input
          className='input'
          value={draftName}
          onInput={(e) => setDraftName(e.detail.value)}
          onBlur={(e) => {
            const next = (e.detail.value || '').trim();
            if (!next) {
              setDraftName(flower.name);
              return;
            }
            if (next !== flower.name) {
              savePatch({ name: next });
            }
          }}
        />

        <Text className='field-label mt'>摆放位置</Text>
        <Input
          className='input'
          value={draftLocation}
          onInput={(e) => setDraftLocation(e.detail.value)}
          onBlur={(e) => {
            const next = (e.detail.value || '').trim();
            if (next !== flower.location) {
              savePatch({ location: next });
            }
          }}
        />
      </View>

      <View className='card edit-card'>
        <View className='row-between'>
          <Text className='field-label'>提醒开关</Text>
          <Switch
            checked={flower.reminderEnabled}
            color='#2f8f4e'
            onChange={(e) => savePatch({ reminderEnabled: e.detail.value })}
          />
        </View>

        <Text className='field-label mt'>浇水间隔（天）</Text>
        <Input
          className='input'
          type='number'
          value={draftInterval}
          onInput={(e) => setDraftInterval(e.detail.value)}
          onBlur={(e) => {
            const n = Math.max(1, Math.min(30, Number(e.detail.value) || flower.intervalDays));
            setDraftInterval(`${n}`);
            if (n !== flower.intervalDays) {
              savePatch({ intervalDays: n });
            }
          }}
        />

        <Text className='field-label mt'>提醒时间</Text>
        <Picker
          mode='selector'
          range={hours}
          value={hourIdx}
          onChange={(e) => savePatch({ reminderHour: Number(e.detail.value) })}
        >
          <View className='picker'>{hours[hourIdx]}</View>
        </Picker>

        <Text className='field-label mt'>提醒模式</Text>
        <View className='preset-wrap'>
          <Text
            className={`preset-chip ${flower.reminderMode === 'once' ? 'active' : ''}`}
            onClick={() => savePatch({ reminderMode: 'once' as ReminderMode })}
          >
            仅一次
          </Text>
          <Text
            className={`preset-chip ${flower.reminderMode === 'loop' ? 'active' : ''}`}
            onClick={() => savePatch({ reminderMode: 'loop' as ReminderMode })}
          >
            循环
          </Text>
        </View>
      </View>

      <View className='card edit-card'>
        <View className='row-between'>
          <Text className='field-label'>生长时间轴</Text>
          <Button size='mini' className='green-mini' onClick={choosePhotos}>
            + 新增照片
          </Button>
        </View>
        <Text className='edit-count'>已上传 {timeline.length}/{MAX_FLOWER_PHOTOS}</Text>

        {!timeline.length && <View className='muted'>暂无照片</View>}
        {timeline.map((photo) => (
          <View key={photo.id} className='timeline-item row-between'>
            <View className='row'>
              <Image className='timeline-img' src={photo.url} mode='aspectFill' onClick={() => previewBigImg(photo.url)} />
              <Text className='timeline-time'>{formatDateTime(photo.uploadedAt)}</Text>
            </View>
            <Text
              className='timeline-del'
              onClick={() => savePatch({ photos: flower.photos.filter((p) => p.id !== photo.id) })}
            >
              删除
            </Text>
          </View>
        ))}
      </View>

      <View className='card edit-action-card'>
        <Text className='edit-next-water'>下次浇水：{formatDateTime(flower.nextWateringAt)}</Text>
        <View className='btn-row'>
          <Button
            className='primary-btn'
            onClick={() => {
              markFlowerWatered(flower.id);
              Taro.showToast({ title: '已记录浇水', icon: 'success' });
              // Navigate back to the view page after watering
              setTimeout(() => {
                Taro.redirectTo({
                  url: `/pages/flower-detail/view?id=${flower.id}`
                });
              }, 1500);
            }}
          >
            已浇水
          </Button>
          <Button
            className='danger-btn'
            onClick={() => {
              Taro.showModal({
                title: '确认删除',
                content: '删除后无法恢复，是否继续？',
                success: (res) => {
                  if (res.confirm) {
                    removeFlower(flower.id);
                    Taro.navigateBack();
                  }
                },
              });
            }}
          >
            删除花卉
          </Button>
        </View>
      </View>
    </View>
  );
}
