<template>
  <div id="app">
    <div class="monads">
      <router-view/>
    </div>
    <div class="controls" v-if="!this.$store.state.isHome">
      <div class="controls__flank">
        <i class="material-icons-sharp">account_box</i> <!-- cloud_off -->
      </div>
      <div class="controls__flank">
        <i class="material-icons-sharp">assessment</i>
      </div>
      <div class="controls__flank" @click="onGoHome">
        <i class="material-icons md-24">apps</i>
      </div>
      <div class="controls__flank">
        <i class="material-icons-sharp">casino</i>
      </div>
      <div class="controls__flank">
        <i class="material-icons-sharp">crop_din</i>
      </div>
    </div>    
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: black;

  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.monads {
  width: 100%;
  flex-grow: 1;

  box-sizing: border-box;
  padding: 15px;

  overflow-y: hidden;
}

.controls {
  width: calc(100% - 30px);
  min-height: 50px;
  height: 50px;

  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}

.controls__flank {
  height: 48px;
  width: 50px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  border-bottom: 2px solid white;
}

.controls__main {
  height: 46px;
  width: 46px;

  border: 2px solid black;
}

.inactive {
  opacity: 0.2;
}

.material-icons.md-24 { font-size: 36px; }
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onGoHome(): void {
      this.$router.push({name: 'home'});
    }
  }
})
</script>