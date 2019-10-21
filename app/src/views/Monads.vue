<template>
    <div id="monad-container">
        <component :is="currentMonad"> </component>
    </div>
</template>

<style scoped>
#monad-container {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    
    border: 2px solid black;
}

@keyframes appear {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
        box-shadow: 0px 3px 0px 5px #000000;
        
    }
}
</style>

<script lang="ts">
import Vue from 'vue'
import bubble from './monads/bubble.vue';
import parade from './monads/parade.vue';
import useful from './monads/useful.vue';
import sultry from './monads/sultry.vue';

export default Vue.extend({
    name: 'monad-container',
    components: {
        bubble,
        parade,
        useful,
        sultry
    },
    computed: {
        currentMonad(): string {
            return this.$route.params.name
        }
    }
})
</script>