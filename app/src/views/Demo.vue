<template>
    <div id="demo">
        <div class="box">
            <div class="white">
            </div>
        </div>
        <div class="box active">
            <div class="black">
            </div>
        </div>
    </div>
</template>

<style scoped>
#demo {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    align-content: center;
}

.box {
    width: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.active {
    border-top: 2px dashed black;
}

.box > * {
    width: 33vw;
    height: 33vw;
}

.box > .white {
    box-sizing: border-box;
    border: 2px solid black;
}

.box > .black {
    background: black;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    created() {
        this.$store.commit("toggleOnHome");
    },
    destroyed() {
        this.$store.commit("toggleOnHome");
    }
})
</script>