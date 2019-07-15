import {
  VuexModule, Module, Mutation, Action, getModule,
} from 'vuex-module-decorators';

// eslint-disable-next-line import/no-cycle
import store from '@/store';

console.log(store);

export interface INavLayersState {
  layerConfig: any;
}

@Module({ dynamic: true, store, name: 'layerConfig' })
class LayerConfig extends VuexModule implements INavLayersState {
  public layerConfig: any = {};

  @Mutation
  private UPDATE_LAYER_CONFIG(config: any) {
    this.layerConfig = config;
  }

  @Action
  public actionLayerConfig(config: any) {
    this.UPDATE_LAYER_CONFIG(config);
  }
}

export const LayerConfigModule = getModule(LayerConfig);
