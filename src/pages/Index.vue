<template>
  <div class="main">
    <m-header></m-header>
    <m-nav></m-nav>
    <m-map></m-map>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Header from '@/components/Header/index.vue';
  import AviationMap from '@/components/Map/index.vue';
  import AviationNav from '@/components/LeftNav/index.vue';

  @Component({
    name: 'Main',
    components: {
      MHeader: Header,
      MMap: AviationMap,
      MNav: AviationNav,
    },
  })
  export default class Home extends Vue {
  }
</script>

<style lang="less">
  .main {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
