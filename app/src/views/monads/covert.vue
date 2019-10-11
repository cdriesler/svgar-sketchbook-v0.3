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
}

.black {
    outline: 2px solid black;
    outline-offset: -2px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Svgar from 'svgar';
import SvgarPath from 'svgar/dist/models/SvgarPath';

export default Vue.extend({
    name: 'covert',
    data() {
        return {
            offset: 0,
        }
    },
    mounted() {
        setInterval(this.shiftOffset, 25);
    },
    computed: {
        svg(): string {
            let dwg = new Svgar.Cube();

            let front = new Svgar.Slab("front");

            let circle = new Svgar.Builder.Circle(0.25, 0.25, 0.26).build();
            let background = new Svgar.Builder.Polyline(0, 0).lineTo(1, 0).lineTo(1, 1).lineTo(0, 1).close().build();
            background.setElevation(-1);
            background.setTag("background");

            front.setAllGeometry([...this.getVerticalStripes(0.01, this.offset + 1), background]);
            front.clipWith(circle);
            front.setElevation(2);

            front.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "black",
                        "stroke": "none",
                        "stroke-width": "0px",
                    },
                },
                {
                    name: "bg",
                    attributes: {
                        "fill": "white",
                        "stroke": "none",
                        "stroke-width": "0px",
                    }
                },
            ]);

            front.setAllStates([
                {
                    name: "default",
                    styles: {
                        "background": "bg",
                        "screen": "bg",
                    }
                }
            ])

            let back = new Svgar.Slab("back");

            let screen: SvgarPath[] = this.getHorizontalStripes(0.01, 0);
            screen.forEach(x => {
                x.setElevation(5);
                x.setTag("screen");
            });

            back.setAllGeometry([...this.getVerticalStripes(0.01, this.offset), ...screen]);

            back.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "black",
                        "stroke": "none",
                        "stroke-width": "0px",
                    },
                },
                {
                    name: "bg",
                    attributes: {
                        "fill": "white",
                        "stroke": "none",
                        "stroke-width": "0px",
                    }
                }
            ]);

            back.setAllStates([
                {
                    name: "default",
                    styles: {
                        "screen": "bg",
                    }
                }
            ])

            back.setElevation(1);

            dwg.slabs.push(front, back);

            return dwg.compile(400, 400);
        }
    },
    methods: {
        shiftOffset(): void {
            this.offset = this.offset + 0.05;

            if (this.offset > 2) {
                this.offset = 0;
            }
        },
        getVerticalStripes(w: number, pct: number): SvgarPath[] {
            let paths: SvgarPath[] = [];

            const d = w * pct;

            const count = Math.round((1 / w)) + 2;

            for(let i = 0; i < count; i+= 2) {
                const anchor = (w * i) - d;
                let line = new Svgar.Builder.Polyline(anchor, 0).lineTo(anchor + w, 0).lineTo(anchor + w, 1).lineTo(anchor, 1).close().build();
                paths.push(line);
            }

            return paths;
        },
        getHorizontalStripes(w: number, pct: number): SvgarPath[] {
            let paths: SvgarPath[] = [];

            const d = w * pct;

            const count = Math.round((1 / w)) + 2;

            for(let i = 0; i < count; i+= 2) {
                const anchor = (w * i) - d;
                let line = new Svgar.Builder.Polyline(0, anchor).lineTo(0, anchor + w).lineTo(1, anchor + w).lineTo(1, anchor).close().build();
                paths.push(line);
            }

            return paths;
        }
    }
})
</script>