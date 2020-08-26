<template>
  <div class="home">
    <Main />
  </div>
</template>

<script>
import Main from '@/components/Main';

export default {
  name: 'home',
  components: {
    Main
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
}
</style>
