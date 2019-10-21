<template>
    <div id="useful">
        <div class="dot" v-if="showDot" :style="{left: dotX + 'px', top: dotY + 'px'}">
        </div>
        <div class="box" ref="svgar" v-html="svg" @mousemove="onMoveLine" @click="onAttemptMakeDesks">
        </div>
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
import Svgar, { Create, Locate, Update } from 'svgar';

export default Vue.extend({
    name: 'useful',
    data() {
        return {
            s: 0,
            cache: "",
            svgar: {} as any,
            svgarGuide: {} as any,
            dotX: 0,
            dotY: 0,
            lineStartX: 0,
            lineStartY: 0,
            lineEndX: 0,
            lineEndY: 0,
            showDot: false,
            lockDot: false,
            lastMove: 0,
            deskLines: [] as number[][]
        }
    },
    created() {
        
    },
    mounted() {
        this.s = (<Element>this.$refs.svgar).clientWidth;
    },
    watch: {
        cache: function (val) {
            console.log("update");
            this.svgar.listen();
        }
    },
    methods: {
        startListen(): void {
            this.svgar.listen();
        },
        onEdgeHover(event: MouseEvent): void {
            if(this.lockDot) {
                return;
            }
            this.showDot = true;

            this.dotX = event.pageX - 5;
            this.dotY = event.pageY - 5;
            console.log("Enter!");
        },
        onEdgeMove(event: MouseEvent): void {
            if(this.lockDot) {
                return;
            }
            this.dotX = event.pageX - 5;
            this.dotY = event.pageY - 5;
        },
        onEdgeLeave(): void {
            this.showDot = this.lockDot;
            console.log("Leave!");
        },
        onCommitDot(event: MouseEvent): void {
            let x = (this.dotX - (document.querySelector("svg"))!.getBoundingClientRect().left) / 400;
            let y = (this.dotY - (document.querySelector("svg"))!.getBoundingClientRect().top) / 400;

            this.lineStartX = (x * 2) - 1 + 0.02;
            this.lineEndX = this.lineStartX;
            this.lineStartY = -0.9;

            this.lockDot = true;
        },
        onMoveLine(event: MouseEvent): void {
            if (Date.now() - this.lastMove < 50) {
                return;
            }

            console.log("move");

            let x = (event.pageX - (document.querySelector("svg"))!.getBoundingClientRect().left) / 400;
            let y = (event.pageY - (document.querySelector("svg"))!.getBoundingClientRect().top) / 400;

            //this.lineEndX = (x * 2) - 1;
            this.lineEndY = ((y * 2) - 1) * -1;

            this.lastMove = Date.now();
        },
        onAttemptMakeDesks(): void {
            if (this.lockDot) {
                this.lockDot = false;
                this.showDot = false;

                this.deskLines.push([this.lineStartX, this.lineStartY, this.lineEndX, this.lineEndY]);
            }
        }
    },
    computed: {
        svg(): string {
            let box = new Svgar.Cube("covert");
            box.frame([0, 0], 2.01, 2.01);

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

            let background = new Svgar.Builder.Polyline(1, 1).lineTo(1, -1).lineTo(-1, -1).lineTo(-1, 1).close().build();
            background.setTag("bg");
            background.setElevation(-2);
            walls.addPath(background);
            
            let guide = new Svgar.Builder.Polyline(-1 + o, -1 + o).lineTo(1 - o, -1 + o).build();
            guide.setTag("guide");
            guide.setElevation(2);
            guide.attach("mouseenter", this.onEdgeHover);
            guide.attach("mouseleave", this.onEdgeLeave);
            guide.attach("mousemove", this.onEdgeMove);
            guide.attach("mousedown", this.onCommitDot);
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
                },
                {
                    name: "whitefill",
                    attributes: {
                        "stroke": "none",
                        "fill": "white",
                    }
                }
            ]);

            walls.setAllStates([
                {
                    name: "default",
                    styles: {
                        "guide": "guide",
                        "bg": "whitefill"
                    }
                }
            ]);

            box.slabs.push(walls);

            let guideline = new Svgar.Slab("line");

            if (this.lockDot) {

                let path = new Svgar.Builder.Polyline(this.lineStartX, this.lineStartY).lineTo(this.lineEndX, this.lineEndY).build();

                guideline.addPath(path);

                guideline.setAllStyles([
                    {
                        name: "default",
                        attributes: {
                            "stroke": "black",
                            "stroke-width": "1px",
                            "pointer-events": "none",
                            "stroke-dasharray": "2 2",
                        }
                    }
                ]);

                this.svgarGuide = guideline;
                box.slabs.push(this.svgarGuide);
            }

            let cslab = new Svgar.Slab("c");

            this.deskLines.forEach((x:number[]) => {
                let c = new Svgar.Builder.Circle(x[2] + 0.09, x[3], 0.06).build();
                cslab.addPath(c);

                const w = 0.07;
                const h = 0.12;

                let d = new Svgar.Builder.Polyline(x[2] - w, x[3] + h)
                .lineTo(x[2] + w, x[3] + h)
                .lineTo(x[2] + w, x[3] - h)
                .lineTo(x[2] - w, x[3] - h)
                .close()
                .build();
                d.setElevation(2);
                d.setTag('desk')
                cslab.addPath(d);
            });

            cslab.setAllStyles([
                {
                name: "desk",
                attributes: {
                    "stroke": "black",
                    "stroke-width": "1px",
                    "fill": "white",
                    }
                }
            ]);

            cslab.setAllStates([
                {
                    name: "default",
                    styles: {
                        "desk": "desk"
                    }
                }
            ]);

            box.slabs.push(cslab);

            this.svgar = box;
            this.cache = this.svgar.compile(400, 400);

            return this.cache;
        }
    }
})
</script>