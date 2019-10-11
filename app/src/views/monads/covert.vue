<template>
<div id="covert">
    <div class="white box" v-html="svg">
    </div>
    <div class="black box">
    </div>
</div>
</template>

<style scoped>
#covert {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.box {
    width: 400px;
    height: 400px;

    outline: 2px solid black;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Svgar from 'svgar';

export default Vue.extend({
    name: 'covert',
    computed: {
        svg(): string {
            let dwg = new Svgar.Cube();

            let test = new Svgar.Slab("test");

            let rect = new Svgar.Builder.Polyline(0, 0).lineTo(1, 0).lineTo(1, 1).lineTo(0, 1).close().build();
            let circle = new Svgar.Builder.Circle(0.25, 0.25, 0.26).build();

            test.addPath(rect);
            test.clipWith(circle);

            test.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "gainsboro",
                        "stroke": "none",
                        "stroke-width": "0px"
                    }
                }
            ]);

            dwg.slabs.push(test);

            return dwg.compile(400, 400);
        }
    }
})
</script>