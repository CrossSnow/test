export type ReminderMode = 'once' | 'loop';

export interface FlowerPhoto {
  id: string;
  url: string;
  uploadedAt: string;
}

export interface ReminderLog {
  id: string;
  flowerId: string;
  flowerName: string;
  message: string;
  createdAt: string;
  kind: 'due' | 'watered';
}

export interface Flower {
  id: string;
  name: string;
  location: string;
  photos: FlowerPhoto[];
  intervalDays: number;
  reminderHour: number;
  reminderMode: ReminderMode;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastWateredAt: string;
  nextWateringAt: string;
  dueReminderTag?: string;
}

export interface PendingFlowerDraft {
  name: string;
  location: string;
  photos: FlowerPhoto[];
}

export interface UserInfo {
  openid: string;
  nickname: string;
  avatar: string;
  gender: number; // 0: 未知, 1: 男, 2: 女
  city: string;
  province: string;
  country: string;
  unionid?: string;
}

export interface LoginResult {
  success: boolean;
  userInfo?: UserInfo;
  error?: string;
}