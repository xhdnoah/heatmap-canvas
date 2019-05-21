<template>
  <div class="loading" :style="{width: width + 'px', height: height + 'px'}">
    <img :src="imgSrc" />
  </div>
</template>

<script>
  import loadingImg from 'assets/images/loading.gif'
  export default {
    name: "loading",
    props: ['width', 'height'],
    data() {
      return {
        imgSrc: loadingImg
      }
    }
  }
</script>

<style scoped>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
