<template>
    <div id="monad-box" @click="toMonad">
        <div class="preview"> </div>
        <div class="label"> 
            <div class="label__name">
                {{name}}
            </div>
            <div class="label__description">
                {{description}}
            </div>
        </div>
    </div>
</template>

<style scoped>
#monad-box {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    margin: 15px;


    display: grid;
    grid-template-columns: 50px 1fr;
}

.preview {
    grid-row: 1 / span 1;
    grid-column: 1 / span 1;

    box-sizing: border-box;

    width: 100%;
    height: 50px;

    border: 2px solid black;
    border-bottom: 2px solid black;
}

.label {
    grid-row: 1 / span 1;
    grid-column: 2 / span 1;

    box-sizing: border-box;

    width: calc(100% - 30px);
    height: 50px;

    display: grid;
    grid-template-rows: 30px 20px;

    border-right: 1px solid grey;
    border-top: 1px solid grey;
    border-bottom: 1px solid grey;
}

.label__name {
    width: 100%;
    height: 30px;

    grid-row: 1 / span 1;

    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
    vertical-align: text-bottom;
}

.label__description {
    width: 100%;
    height: 20px;

    grid-row: 2 / span 1;

    border-top: 1px solid grey;

    font-size: 10px;
    line-height: 18px;
    text-align: center;
    vertical-align: middle;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'monad-box',
    props: {
        name: String,
        description: String,
    },
    methods: {
        toMonad(): void {
            this.$router.push(`/m/${this.name}`)
        },
    }
})
</script>