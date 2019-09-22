<template>
<div class="content">
<div class="home">
	<monad-box 
	v-for='(monad, index) in manifest' 
	:key="`${index}_${monad.name}`"
	:name="monad.name">
	</monad-box>
</div>
</div>

</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}
.home {
  overflow-y: auto;

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
</style>

<script lang="ts">
import Vue from 'vue';
import MonadBox from '@/components/MonadBox.vue';
import MonadManifest from './../registrar/MonadManifest';

export default Vue.extend({
	name: 'home',
	components: {
		MonadBox,
	},
	data() {
		return {
			manifest: MonadManifest,
		}
	},
	created() {
		this.$store.commit("toggleOnHome");
	},
	destroyed() {
		this.$store.commit("toggleOnHome");
	}
});
</script>
