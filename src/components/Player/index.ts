import player from './main.vue';
import slider from './Slider.vue';

// @ts-ignore
player.install = function (Vue) {
  Vue.component(player.name, player);
};

// @ts-ignore
slider.install = function (Vue) {
  Vue.component(slider.name, slider);
};

export {
  player,
  slider,
};
