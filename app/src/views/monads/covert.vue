<template>
<div id="covert">
    <div class="white box" ref="svgar" v-html="svg">
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
    max-width: calc(100vw - 60px);
    height: 400px;
    max-height: calc(100vw - 60px);
}

.white {
    outline: 2px solid white;
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

interface Circle {
    x: number,
    y: number,
    r: number,
}

interface Rectangle {
    x: number,
    y: number,
    w: number,
    h: number,
    rot: number,
}

export default Vue.extend({
    name: 'covert',
    data() {
        return {
            offset: 0,
            w: 0.013,
            circle: {} as Circle,
            rectangle: {} as Rectangle,
            s: 0,
            angle: 0,
            multiplier: 0,
        }
    },
    mounted() {
        setInterval(this.shiftOffset, 25);
        setInterval(this.shiftSize, 25);
        this.circle = {
            x: 0.25,
            y: 0.3,
            r: 0.2
        }
        this.rectangle = {
            x: 0.7,
            y: 0.6,
            w: 0.15,
            h: 0.65,
            rot: 30,
        }
        setInterval(this.shiftShapes, 25);
        this.s = (<Element>this.$refs.svgar).clientWidth;
    },
    computed: {
        svg(): string {
            let dwg = new Svgar.Cube("covert");

            let background = new Svgar.Builder.Polyline(0, 0).lineTo(1, 0).lineTo(1, 1).lineTo(0, 1).close().build();
            background.setElevation(-1);
            background.setTag("background");

            let block = new Svgar.Slab("blocks");

            let rectClip = new Svgar.Slab("rclip");
            let r = this.rectangle as Rectangle;
            let rect = this.makeRectangle(r.x, r.y, r.w, r.h, r.rot);
            rectClip.addPath(rect);

            block.clipWith(rectClip);
            block.setElevation(2);

            block.setAllStyles([
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

            block.setAllStates([
                {
                    name: "default",
                    styles: {
                        "background": "bg",
                        "screen": "bg",
                    }
                }
            ])

            block.setAllGeometry([...this.getHorizontalStripes(this.w, 0), background])

            let front = new Svgar.Slab("front");

            let circleClip = new Svgar.Slab("circleClip");
            const c = this.circle as Circle;
            let circle = new Svgar.Builder.Circle(c.x, c.y, c.r).build();
            circleClip.addPath(circle);

            front.setAllGeometry([...this.getVerticalStripes(this.w, this.offset + 1), background]);
            front.clipWith(circleClip);
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

            let screen: SvgarPath[] = this.getHorizontalStripes(this.w, 0);
            screen.forEach(x => {
                x.setElevation(5);
                x.setTag("screen");
            });

            back.setAllGeometry([...this.getVerticalStripes(this.w, this.offset), ...screen]);

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

            dwg.slabs = [front, back, block];

            return dwg.compile(this.s, this.s);
        }
    },
    methods: {
        shiftOffset(): void {
            this.offset = this.offset + 0.05;

            if (this.offset > 2) {
                this.offset = 0;
            }
        },
        shiftShapes(): void {
            let speed = 0.0015;

            this.circle.x = 0.25 + (0.1 * this.multiplier);
            this.circle.r = 0.15 + (0.075 * this.multiplier);

            this.rectangle.x = 0.7 - (0.1 * this.multiplier);
            this.rectangle.w = 0.15 + (0.05 * this.multiplier);
            this.rectangle.rot = 30 + (15 * this.multiplier);

        },
        shiftSize(): void {
            this.angle = this.angle + 0.1;
            this.multiplier = Math.sin(this.angle * (Math.PI / 18));

            //this.w = Math.abs((Math.sin(this.angle * (Math.PI / 180))) * 0.025) + 0.025
        },
        newCircle(): Circle {
            return {
                x: Math.random() * 0.3 + 0.1,
                y: 1.5,
                r: Math.random() * 0.25 + 0.05
            }
        },
        newRectangle(): Rectangle {
            return {
                x: Math.random() * 0.3 + 0.5,
                y: 1.5,
                w: Math.random() * 0.15 + 0.05,
                h: Math.random() * 0.4 + 0.4,
                rot: (Math.random() * 115) - 45,
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
        },
        makeRectangle(x: number, y: number, w: number, h: number, rot: number): SvgarPath {
            const rad = rot * (Math.PI / 180);

            const pts: number[][] = [
                [x - (w / 2), y - (h / 2)],
                [x + (w / 2), y - (h / 2)],
                [x + (w / 2), y + (h / 2)],
                [x - (w / 2), y + (h / 2)],
            ];

            let r: number[][] = [];

            pts.forEach(c => {
                r.push([
                    ((c[0] - x) * Math.cos(rad)) - ((c[1] - y) * Math.sin(rad)) + x,
                    ((c[1] - y) * Math.cos(rad)) + ((c[0] - x) * Math.sin(rad)) + y
                ]);
            })

            let rect = new Svgar.Builder.Polyline(r[0][0], r[0][1])
                .lineTo(r[1][0], r[1][1])
                .lineTo(r[2][0], r[2][1])
                .lineTo(r[3][0], r[3][1])
                .close()
                .build();

            return rect;
        }
    }
})
</script>