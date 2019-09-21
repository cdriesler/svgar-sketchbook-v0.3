<template>
  <div class="hello">
    <button @click='onClick'>TEST</button>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  sockets: {
    connect(): void {
      console.log('connected!');
    },
    testFromApi(message: string) {
      console.log('received message: ' + message);
    }
  },
  methods: {
    onClick(event: any): void {
      this.$socket.client.emit('message', 'HOWDY');
    }
  }
});
</script>


