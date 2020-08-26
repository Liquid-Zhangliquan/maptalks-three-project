<template>
  <div class="main-content">
    <div class="wrap"></div>
  </div>
</template>

<script>
import bus from '@/utils/bus';
export default {
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
  destroyed() {}
};
</script>

<style lang="less" scope>
.main-content {
  position: relative;
  z-index: 2;
  display: flex;
  .wrap {
    width: 100%;
    margin: 0px;
    position: relative;
    z-index: 1;
  }
}
</style>
