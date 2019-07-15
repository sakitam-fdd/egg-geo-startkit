<template>
  <div class="aviation-header"></div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  @Component({
    name: 'Header',
    components: {},
  })

  export default class extends Vue {
    @Watch('$route')

    created() {
    }
  }
</script>

<style lang="less" scoped>
  .aviation-header {
    width: 100%;
    height: 60px;

    background: #282a35;
    border-bottom: 1px solid #373c4f;
  }
</style>
