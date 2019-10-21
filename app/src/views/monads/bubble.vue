<template>
    <div id="bubble">
        <div class="svgar" ref="svgar" v-html="svg">
        </div>
        <input type="range" min="0.5" max="1" step="0.01" v-model="slider" class="slider" />
    </div>
</template>

<style scoped>
#bubble {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.svgar {
    width: 400px;
    max-width: calc(100vw - 150px);
    height: 400px;
    max-height: calc(100vw - 150px);
}

.slider {
    margin-top: 15px;
    box-sizing: border-box;
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 400px; /* Full-width */
    max-width: calc(100vw - 150px);
    height: 25px; /* Specified height */
    background: white; /* Grey background */
    border: 2px solid black;
    outline: none; /* Remove outline */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 10px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: black; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

</style>

<script lang="ts">
import Vue from 'vue'
import Svgar from 'svgar';

interface Bubble {
    radius: number,
    speed: number,
    parameter: number,
    angle: number,
}

export default Vue.extend({
    name: "bubble",
    data() {
        return {
            bubbles: [] as Bubble[],
            slider: 0.6,
            s: 0,
        }
    },
    mounted() {
        setTimeout(this.makeBubble, 100);
        setInterval(this.moveBubbles, 10);

        this.s = (<Element>this.$refs.svgar).clientWidth;
    },
    computed: {
        svg(): string {

            let dwg = new Svgar.Cube("bubble");

            let fills = new Svgar.Slab("fills");
            let outlines = new Svgar.Slab("outlines");

            this.bubbles.forEach((bubble:Bubble) => {
                let path = new Svgar.Builder.Circle(Math.cos(bubble.angle) * bubble.parameter, Math.sin(bubble.angle) * bubble.parameter, bubble.radius).build();

                fills.addPath(path);
                outlines.addPath(path);
            });

            fills.setElevation(1);
            fills.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "white",
                        "stroke": "none",
                        "stroke-width": "0px"
                    }
                }
            ]);

            outlines.setElevation(0);
            outlines.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "none",
                        "stroke": "black",
                        "stroke-width": "4px",
                    }
                }
            ]);

            let border = new Svgar.Slab("border");
            border.addPath(new Svgar.Builder.Polyline(-1, -1).lineTo(1, -1).lineTo(1, 1).lineTo(-1, 1).close().build());

            border.setElevation(-1);
            border.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "fill": "none",
                        "stroke": "black",
                        "stroke-width": "4px"
                    }
                }
            ])

            dwg.slabs = [fills, outlines, border];
            dwg.frame([0,0], 2, 2);

            return dwg.compile(this.s, this.s);
        }
    },
    methods: {
        makeBubble(): void {
            let r = Math.random() * 0.25 + 0.05;
            let speed = Math.random() * 0.01 + 0.005;
            let angle = (Math.random() * 360) * (Math.PI / 180);

            this.bubbles.push(
                {
                    radius: r,
                    speed: speed,
                    parameter: 0,
                    angle: angle,
                });

            setTimeout(this.makeBubble, (1 - this.slider) * 1000);
        },
        moveBubbles(): void {
            let removals: number[] = [];

            for (let i = 0; i < this.bubbles.length; i++) {
                let b: Bubble = this.bubbles[i];

                b.parameter = b.parameter + b.speed;

                if (b.parameter > 2) {
                    removals.push(i);
                }
            }

            this.bubbles = this.bubbles.filter((bubble, index) => removals.indexOf(index) == -1);
        }
    }

})
</script>