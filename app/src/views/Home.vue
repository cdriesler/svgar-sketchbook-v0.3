<template>
<div class="content">
<div class="home">
	<monad-box 
	v-for='(monad, index) in manifest' 
	:key="`${index}_${monad.name}`"
	:name="monad.name"
	:description="monad.description">
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
	width: 100%;
  	overflow-y: auto;
	overflow-x: hidden;

	box-shadow: inset 0 0 5px gainsboro;
	border: 2px solid black;
	border-radius: 15px;

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: left;
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
