export interface IUserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileForm extends Omit<IUserProfile, 'id' | 'createdAt' | 'updatedAt'> {
}
