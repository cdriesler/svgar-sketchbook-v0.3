<template>
    <div id="useful">
        <div class="dot" v-if="showDot" :style="{left: dotX + 'px', top: dotY + 'px'}">
        </div>
        <div class="box" ref="svgar" v-html="svg">
        </div>
        <br>
        <button @click="startListen"> LISTEN </button>
    </div>
</template>

<style scoped>
#useful {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.box {
    width: 400px;
    max-width: calc(100vw - 150px);
    height: 400px;
    max-height: calc(100vw - 150px);
}

.dot {
    pointer-events: none;
    width: 10px;
    height: 10px;
    outline: 2px solid black;
    background: white;

    position: absolute;
}

</style>

<script lang="ts">
import Vue from 'vue';
import Svgar from 'svgar';

export default Vue.extend({
    name: 'useful',
    data() {
        return {
            s: 0,
            svgar: {} as Svgar.Cube,
            dotX: 0,
            dotY: 0,
            showDot: false,
        }
    },
    created() {
        let box = new Svgar.Cube();
        box.frame([0, 0], 2.1, 2.1);

        let walls = new Svgar.Slab("wall");
        const o = 0.1;

        walls.addPath(new Svgar.Builder.Polyline(1, 1)
            .lineTo(1, -1)
            .lineTo(-1, -1)
            .lineTo(-1, 1)
            .lineTo(-0.2, 1)
            .lineTo(-0.2, 1 - o)
            .lineTo(-1 + o, 1 - o)
            .lineTo(-1 + o, -1 + o)
            .lineTo(1 - o, -1 + o)
            .lineTo(1 - o, 1 - o)
            .lineTo(0.2, 1 - o)
            .lineTo(0.2, 1)
            .lineTo(1, 1)
            .close()
            .build());
        
        let guide = new Svgar.Builder.Polyline(-1 + o, -1 + o).lineTo(1 - o, -1 + o).build();
        guide.setTag("guide");
        guide.setElevation(2);
        guide.attach("mouseenter", this.onEdgeHover);
        guide.attach("mouseleave", this.onEdgeLeave);
        guide.attach("mousemove", this.onEdgeMove);
        walls.addPath(guide);

        walls.setAllStyles([
            {
            name: "default",
            attributes: {
                "stroke": "black",
                "stroke-width": "1.5px",
                "fill": "gainsboro",
                }
            },
            {
                name: "guide",
                attributes: {
                    "stroke": "black",
                    "stroke-width": "1.5px",
                }
            },
            {
                name: "guide:hover",
                attributes: {
                    "stroke": "black",
                    "stroke-width": "4px",
                    "cursor": "pointer"
                }
            }
        ]);

        walls.setAllStates([
            {
                name: "default",
                styles: {
                    "guide": "guide"
                }
            }
        ]);

        box.slabs.push(walls);

        this.svgar = box;
    },
    mounted() {
        this.s = (<Element>this.$refs.svgar).clientWidth;
    },
    methods: {
        startListen(): void {
            this.svgar.listen();
        },
        onEdgeHover(event: MouseEvent): void {
            this.showDot = true;

            this.dotX = event.pageX - 5;
            this.dotY = event.pageY - 5;
            console.log("Enter!");
        },
        onEdgeMove(event: MouseEvent): void {
            this.dotX = event.pageX - 5;
            this.dotY = event.pageY - 5;
        },
        onEdgeLeave(): void {
            this.showDot = false;
            console.log("Leave!");
        }
    },
    computed: {
        svg(): string {
            this.$nextTick(this.svgar.listen());

            return this.svgar.compile(400, 400);
        }
    }
})
</script>