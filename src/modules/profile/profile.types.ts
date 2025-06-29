import { ProfileID } from '@/core/id';

export interface IUserProfile {
  id: ProfileID;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileForm extends Omit<IUserProfile, 'id' | 'createdAt' | 'updatedAt'> {
}
