// eslint-disable-next-line import/no-cycle
import { ITagsViewState } from './tags-view';
import { INavLayersState } from './nav-layers';

console.log();

export interface IRootState {
  tagsView: ITagsViewState,
  layerConfig: INavLayersState,
}
