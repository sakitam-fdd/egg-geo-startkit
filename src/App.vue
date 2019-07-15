<template>
  <div id="app">
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { TagsViewModule } from '@/store/modules/tags-view';

  @Component({
    name: 'Main',
    components: {},
  })
  export default class App extends Vue {
    get cachedViews() {
      return TagsViewModule.cachedViews;
    }

    get key() {
      return this.$route.path;
    }
  }
</script>

<style lang="less">
  #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
