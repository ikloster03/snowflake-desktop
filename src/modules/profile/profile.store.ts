import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IUserProfile } from './profile.types';
import { PRIVATE_STORE_PREFIX } from '@/store.const';
import { createID } from '@/core/id';
import { load } from '@tauri-apps/plugin-store';

export const PROFILE_STORE = 'profile';

const useProfilePrivateStore = defineStore(
  `${PRIVATE_STORE_PREFIX}_${PROFILE_STORE}`,
  () => {
    const userProfile = ref<IUserProfile | null>(null);
    const isLoaded = ref(false);

    return { userProfile, isLoaded };
  }
);

export const useProfileStore = defineStore(PROFILE_STORE, () => {
  const state = useProfilePrivateStore();

  const userProfile = computed(() => state.userProfile);
  const isLoaded = computed(() => state.isLoaded);
  const hasProfile = computed(() => state.userProfile !== null);

  // Загрузка профиля из файла
  const loadProfile = async (): Promise<IUserProfile | null> => {
    try {
      const store = await load('.profile.dat');
      const profile = await store.get<IUserProfile>('userProfile');

      if (profile) {
        state.userProfile = profile;
      }

      state.isLoaded = true;
      return profile || null;
    } catch (error) {
      console.error('Failed to load profile:', error);
      state.isLoaded = true;
      return null;
    }
  };

  // Сохранение профиля в файл
  const saveProfile = async (profile: Partial<IUserProfile>): Promise<IUserProfile> => {
    try {
      const store = await load('.profile.dat');

      const now = new Date().toISOString();

      let updatedProfile: IUserProfile;

      if (state.userProfile) {
        // Обновляем существующий профиль
        updatedProfile = {
          ...state.userProfile,
          ...profile,
          updatedAt: now,
        };
      } else {
        // Создаем новый профиль
        updatedProfile = {
          id: createID<'Profile'>(),
          email: '',
          displayName: '',
          avatar: undefined,
          createdAt: now,
          updatedAt: now,
          ...profile,
        };
      }

      await store.set('userProfile', updatedProfile);
      await store.save();

      state.userProfile = updatedProfile;

      return updatedProfile;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  };

  // Создание нового профиля
  const createProfile = async (profileData: Omit<IUserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUserProfile> => {
    const now = new Date().toISOString();

    const newProfile: IUserProfile = {
      id: createID<'Profile'>(),
      createdAt: now,
      updatedAt: now,
      ...profileData,
    };

    return await saveProfile(newProfile);
  };

  // Обновление профиля
  const updateProfile = async (profileData: Partial<Omit<IUserProfile, 'id' | 'createdAt'>>): Promise<IUserProfile> => {
    if (!state.userProfile) {
      throw new Error('No profile exists to update');
    }

    return await saveProfile(profileData);
  };

  // Удаление профиля
  const deleteProfile = async (): Promise<void> => {
    try {
      const store = await load('.profile.dat');
      await store.delete('userProfile');
      await store.save();

      state.userProfile = null;
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    }
  };

  // Получение профиля или создание дефолтного
  const getOrCreateProfile = async (): Promise<IUserProfile> => {
    if (!state.isLoaded) {
      await loadProfile();
    }

    if (!state.userProfile) {
      return await createProfile({
        email: '',
        displayName: 'User',
        avatar: undefined,
      });
    }

    return state.userProfile;
  };

  return {
    // computed
    userProfile,
    isLoaded,
    hasProfile,

    // actions
    loadProfile,
    saveProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    getOrCreateProfile,
  };
});
