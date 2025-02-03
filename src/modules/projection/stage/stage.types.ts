import { ValueOf } from '@/core/index';
import { STAGE_STATUS } from './stage.const';

type StageStatus = ValueOf<typeof STAGE_STATUS>;

export interface Stage {
  id: string;
  title: string;
  description?: string;
  chapterId: string;
  characterIds: string[];
  status?: StageStatus;
  order?: number;
}
