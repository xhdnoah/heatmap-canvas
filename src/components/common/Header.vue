<template>
  <header class="sx-header">
    <h2 class="header__title heading-primary" v-if="level === 2">
      {{title}}
    </h2>
    <h3 class="header__title heading-secondary" v-if="level === 3">
      {{title}}
    </h3>
    <h4 class="header__title heading-tartiary" v-if="level === 4">
      {{title}}
    </h4>
  </header>
</template>

<script>
    export default {
        name: "Header",
        props: {
            level: {
                type: Number,
                default: 2
            },
            title: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="scss">
  .sx-header {
    display: flex;
    justify-content: space-between;
    background-color: #FFF;
  }
</style>
