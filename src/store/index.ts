import Vue from 'vue';
import Vuex from 'vuex';

// eslint-disable-next-line import/no-cycle
import { IRootState } from './modules/index';

Vue.use(Vuex);

export default new Vuex.Store<IRootState>({});
