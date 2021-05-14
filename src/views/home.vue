<template>
    <div>
        <div class="top-distance">首页</div>
        <div class="des-title" @click="goPdp">pdp页面数据处理</div>
        <div class="des-title" @click="goLdd">ldd页面数据处理</div>
    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            
        };
    },
  components: {},
  mounted () {},
  methods: {
      goPdp () {
          this.$router.push('/pdpData');
      },
      goLdd () {
          this.$router.push('/lddData');
      }
  }
}
</script>
<style scoped>
    .des-title {padding: 20px 0;}
    .top-distance {margin-top: 20px;}
    .des-title {padding: 10px 0; cursor: pointer;text-decoration: underline;color: dodgerblue;}
</style>