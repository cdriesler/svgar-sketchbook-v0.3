<template>
    <div id="monad-box" @click="toMonad">
        <div class="preview"> </div>
        <div class="label"> {{name}}</div>
    </div>
</template>

<style scoped>
#monad-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.preview {
    width: 50%;
    height: 50%;

    border-radius: 15px;

    background: black;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'monad-box',
    props: {
        name: String,
    },
    methods: {
        toMonad(): void {
            this.$router.push(`/m/${this.name}`)
        },
    }
})
</script>