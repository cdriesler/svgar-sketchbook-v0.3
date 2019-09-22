<template>
<div class="content">
  <div class="home">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>

</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;

  overflow-y: auto;
}

.home {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 15px;
}

.home::before {
  content: '';
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.home > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

/* Just to make the grid visible */

.home > * {
  box-sizing: border-box;
  border: 2px solid black;
}
</style>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
  },
  created() {
    this.$store.commit("toggleOnHome");
  },
  destroyed() {
    this.$store.commit("toggleOnHome");
  }
});
</script>
