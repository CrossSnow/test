import Taro from '@tarojs/taro';
import { addDays, dateTag, isDue } from './date';
import type { Flower, PendingFlowerDraft, ReminderLog, ReminderMode } from '@/types/flower';

const FLOWER_KEY = 'flower_timer_flowers_v1';
const LOG_KEY = 'flower_timer_reminder_logs_v1';
const PENDING_KEY = 'flower_timer_pending_flower_v1';

const seedFlowers = (): Flower[] => {
  const now = new Date().toISOString();
  return [];
};

const readFlowers = (): Flower[] => {
  const cached = Taro.getStorageSync(FLOWER_KEY);
  if (cached?.length) {
    return cached as Flower[];
  }
  const seed = seedFlowers();
  Taro.setStorageSync(FLOWER_KEY, seed);
  return seed;
};

const writeFlowers = (flowers: Flower[]) => {
  Taro.setStorageSync(FLOWER_KEY, flowers);
};

const readLogs = (): ReminderLog[] => {
  const cached = Taro.getStorageSync(LOG_KEY);
  return cached?.length ? (cached as ReminderLog[]) : [];
};

const writeLogs = (logs: ReminderLog[]) => {
  Taro.setStorageSync(LOG_KEY, logs);
};

export const listFlowers = (): Flower[] => {
  const flowers = readFlowers();
  return flowers.sort((a, b) => new Date(a.nextWateringAt).getTime() - new Date(b.nextWateringAt).getTime());
};

export const getFlower = (id: string): Flower | undefined => {
  return readFlowers().find((f) => f.id === id);
};

export const savePendingFlowerDraft = (draft: PendingFlowerDraft) => {
  Taro.setStorageSync(PENDING_KEY, draft);
};

export const getPendingFlowerDraft = (): PendingFlowerDraft | null => {
  return Taro.getStorageSync(PENDING_KEY) || null;
};

export const clearPendingFlowerDraft = () => {
  Taro.removeStorageSync(PENDING_KEY);
};

export const createFlowerWithSchedule = (
  draft: PendingFlowerDraft,
  intervalDays: number,
  reminderHour: number,
  reminderMode: ReminderMode,
  reminderEnabled = true
) => {
  const now = new Date().toISOString();
  const newFlower: Flower = {
    id: `f_${Date.now()}`,
    name: draft.name,
    location: draft.location,
    photos: draft.photos,
    intervalDays,
    reminderHour,
    reminderMode,
    reminderEnabled,
    createdAt: now,
    updatedAt: now,
    lastWateredAt: now,
    nextWateringAt: addDays(now, intervalDays, reminderHour),
  };

  const flowers = readFlowers();
  flowers.push(newFlower);
  writeFlowers(flowers);
  clearPendingFlowerDraft();
  return newFlower;
};

export const updateFlower = (flowerId: string, patch: Partial<Flower>) => {
  const flowers = readFlowers();
  const idx = flowers.findIndex((f) => f.id === flowerId);
  if (idx < 0) return;
  flowers[idx] = {
    ...flowers[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeFlowers(flowers);
};

export const removeFlower = (flowerId: string) => {
  const flowers = readFlowers().filter((f) => f.id !== flowerId);
  writeFlowers(flowers);
};

export const markFlowerWatered = (flowerId: string) => {
  const flowers = readFlowers();
  const idx = flowers.findIndex((f) => f.id === flowerId);
  if (idx < 0) return;

  const now = new Date().toISOString();
  flowers[idx].lastWateredAt = now;
  flowers[idx].nextWateringAt = addDays(now, flowers[idx].intervalDays, flowers[idx].reminderHour);
  flowers[idx].updatedAt = now;
  flowers[idx].dueReminderTag = undefined;
  writeFlowers(flowers);

  const logs = readLogs();
  logs.unshift({
    id: `l_${Date.now()}`,
    flowerId,
    flowerName: flowers[idx].name,
    message: `${flowers[idx].name} 已完成浇水，已更新下次浇水时间。`,
    createdAt: now,
    kind: 'watered',
  });
  writeLogs(logs);
};

export const syncDueReminderLogs = () => {
  const flowers = readFlowers();
  const logs = readLogs();
  const nowIso = new Date().toISOString();
  const todayTag = dateTag(nowIso);

  flowers.forEach((flower) => {
    if (!flower.reminderEnabled) return;
    if (!isDue(flower.nextWateringAt)) return;
    if (flower.dueReminderTag === todayTag) return;

    logs.unshift({
      id: `l_${Date.now()}_${flower.id}`,
      flowerId: flower.id,
      flowerName: flower.name,
      message: `【花点时间】你的${flower.name}该浇水啦！摆放位置：${flower.location || '未设置'}`,
      createdAt: nowIso,
      kind: 'due',
    });
    flower.dueReminderTag = todayTag;
  });

  writeFlowers(flowers);
  writeLogs(logs);
};

export const listReminderLogs = () => readLogs();
