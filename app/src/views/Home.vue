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
	height: 100%;
  overflow-y: auto;

	box-shadow: inset 0 0 5px gainsboro;
	border-radius: 15px;
}

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
