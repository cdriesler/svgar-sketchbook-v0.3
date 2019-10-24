<template>
    <div id="chuckfit">
        <div 
        class="main" 
        ref="svgar" 
        v-html="svg"
        @mousemove="trackMouse"
        @mouseleave="stopTrackMouse"
        @mouseUp="stopTrackMouse">

        </div>
    </div>
</template>

<style scoped>
#chuckfit {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.main {
    width: calc(100vw - 30px);
    max-width: 400px;
    height: calc(100vw - 30px);
    max-height: 400px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Svgar, { Create, Update, Locate } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import SvgarPath from 'svgar/dist/models/SvgarPath';
import SvgarSlab from 'svgar/dist/models/SvgarSlab';

interface Point {
    x: number,
    y: number
}

interface Line {
    y: number | undefined,
    m: number | undefined,
    x: number | undefined,
    b: number | undefined,
}

interface ChuckFitDrawing {
    borderControls: {
        a: Point,
        b: Point,
        c: Point,
        d: Point
    },
    borderMappings: {
        [id: string]: string,
    }
}

export default Vue.extend({
    name: "chuckfit",
    data() {
        return {
            s: 0,
            prev: 0,
            info: {} as ChuckFitDrawing,
            svgar: {} as SvgarCube,
            movingExtents: false,
            movingCorner: "",
            moveStartX: 0,
            moveStartY: 0,
            cornerStartX: 0,
            cornerStartY: 0,
            dX: 0,
            dY: 0,
            cursorX: -1,
            cursorY: -1,
        }
    },
    watch: {
        svg(): void {
            this.$nextTick(() => this.svgar.listen());
        }
    },
    created() {
        this.info = {
            borderControls: {
                a: { x: 0, y: 0 },
                b: { x: 0, y: 100 },
                c: { x: 100, y: 100 },
                d: { x: 100, y: 0 }
            },
            borderMappings: {}
        }

        let extents = Create().svgar.slab("extents")
        .withStates([
            {
                name: "default",
                styles: {
                    "border": "nofill",
                    "handles": "hidden",
                }
            },
            {
                name: "active",
                styles: {
                    "border": "nofillblack",
                    "handles": "whitefill"
                }
            }
        ])
        .withStyles([
            {
                name: "nofill",
                attributes: {
                    "stroke": "gainsboro",
                    "stroke-width": "2px",
                    "stroke-dasharray": "4px",
                    "fill": "none"
                }
            },
            {
                name: "nofill:hover",
                attributes: {
                    "cursor": "pointer",
                }
            },
            {
                name: "nofillblack",
                attributes: {
                    "stroke": "black",
                    "stroke-width": "2px",
                    "fill": "none"
                }
            },
            {
                name: "nofillblack:hover",
                attributes: {
                    "cursor": "pointer",
                }
            },
            {
                name: "whitefill",
                attributes: {
                    "stroke": "black",
                    "stroke-width": "2px",
                    "fill": "white"
                }
            },
            {
                name: "whitefill:hover",
                attributes: {
                    "cursor": "pointer",
                    "fill": "gainsboro"
                }
            },
            {
                name: "hidden",
                attributes: {
                    "display": "none",
                }
            }
        ])
        .then
        .build();        

        this.svgar = Create().svgar.cube("main-cube")
        .withCameraExtents(-3, -3, 103, 103)
        .withSlabs([extents])
        .then
        .build();
    },
    mounted() {
        this.s = (<Element>this.$refs.svgar).clientWidth;
    },
    computed: {
        svg(): string {
            if(this.s == 0) {
                return "";
            }

            let ext = Locate().svgar.slab.withName("extents").in.svgar.cube(this.svgar);

            Update().svgar.slab(ext!).geometry.to(this.makeExtents());

            return this.svgar.compile(this.s, this.s);
        }
    },
    methods: {
        pageSpaceToSvgarSpace(event: MouseEvent): number[] {
            const main: Element = this.$refs.svgar;

            const x = (((event.pageX - main.getBoundingClientRect().left) / this.s) * 106) - 3;
            const y = 106 - ((((event.pageY - main.getBoundingClientRect().top) / this.s) * 106) + 3);
            return [x, y];
        },
        createLine(ax: number, ay: number, bx: number, by: number): Line {
            let line:Line = {
                y: undefined,
                m: undefined,
                x: undefined,
                b: undefined,
            }

            // Determine slope
            line.m = ax < bx 
                ? by - ay / bx - ax
                : ay - by / ax - bx;

            // Determine y intercept
            if (line.x && line.y && line.m) {
                line.b = ay - (line.m * ax);
            }

            return line;
        },
        getLineIntersection(a: Line, b: Line): Point {
            let pt: Point = {
                x: 0,
                y: 0,
            }

            

            return pt;
        },
        makeOffset(): SvgarPath[] {
            const bc = this.info.borderControls;
            let left = this.createLine(bc.a.x, bc.a.y, bc.b.x, bc.b.y);
            let bottom = this.createLine(bc.a.x, bc.a.y, bc.d.x, bc.d.y);
            let right = this.createLine(bc.c.x, bc.c.y, bc.d.x, bc.d.y);

            
            return [];
        },
        makeExtents(): SvgarPath[] {
            let r = (<ChuckFitDrawing>this.info).borderControls;

            let rect = Create().svgar.path.from.polyline(
                new Svgar.Builder.Polyline(r.a.x, r.a.y)
                .lineTo(r.b.x, r.b.y)
                .lineTo(r.c.x, r.c.y)
                .lineTo(r.d.x, r.d.y)
                .close()
                );

            rect.setTag("border");

            rect.attach("mouseenter", this.activateExtents);
            rect.attach("mouseleave", this.deactivateExtents);

            const circles: number[] = [
                r.a.x,
                r.a.y,
                r.b.x,
                r.b.y,
                r.c.x,
                r.c.y,
                r.d.x,
                r.d.y
            ]

            let controls: SvgarPath[] = [];
            let labels: string[] = ["a", "b", "c", "d"];
            let ids: string[] = [];

            for(let i = 0; i < circles.length; i+=2) {
                let c = Create().svgar.path.from.circle(
                    new Svgar.Builder.Circle(circles[i], circles[i + 1], 2)
                );
                c.setTag("handles");
                c.setElevation(5);
                c.attach("mouseleave", this.deactivateExtents);
                //c.attach("mouseleave", this.endMoveExtents);
                c.attach("mousedown", this.beginMoveExtents);
                //c.attach("mousemove", this.moveExtents);
                c.attach("mouseup", this.endMoveExtents);

                ids.push(c.getId());
                controls.push(c);
            }
            
            let map = (<ChuckFitDrawing>this.info).borderMappings;
            map[ids[0]] = "a";
            map[ids[1]] = "b";
            map[ids[2]] = "c";
            map[ids[3]] = "d";

            return [rect, ...controls];
        },
        getExtents(): SvgarSlab {
            return Locate().svgar.slab.withName("extents").in.svgar.cube(this.svgar!);
        },
        activateExtents(): void {
            Update().svgar.slab(this.getExtents()).state.to("active");
        },
        deactivateExtents(): void {
            if(this.movingExtents) {
                return;
            }

            Update().svgar.slab(this.getExtents()).state.to("default");
        },
        beginMoveExtents(event: MouseEvent): void {
            this.movingExtents = true;

            const id = (<Element>event.srcElement).id;

            const corner = this.info.borderMappings[id];
            this.movingCorner = corner;
            this.cornerStartX = this.info.borderControls[corner].x;
            this.cornerStartY = this.info.borderControls[corner].y;

            const pos = this.pageSpaceToSvgarSpace(event);
            this.moveStartX = pos[0];
            this.moveStartY = pos[1];

            //console.log(this.pageSpaceToSvgarSpace(event));
            //console.log(Locate().svgar.path.withId(id).in.svgar.cube(this.svgar));
        },
        moveExtents(event: MouseEvent): void {
            if (!this.movingExtents) {
                return;
            }

            const pos = this.pageSpaceToSvgarSpace(event);

            this.dX = pos[0] - this.moveStartX;
            this.dY = pos[1] - this.moveStartY;

            this.info.borderControls[this.movingCorner].x = this.cornerStartX + this.dX;
            this.info.borderControls[this.movingCorner].y = this.cornerStartY + this.dY;
        },
        endMoveExtents(): void {
            this.movingExtents = false;
            this.moveStartX = 0;
            this.moveStartY = 0;
            this.cornerStartX = 0;
            this.cornerStartY = 0;
            this.dX = 0;
            this.dY = 0;
        },
        trackMouse(event: MouseEvent): void {
            if(Date.now() - this.prev < 20) {
                return;
            }

            this.moveExtents(event);

            this.prev = Date.now();
        },
        stopTrackMouse(): void {
            this.cursorX = 0;
            this.cursorY = 0;
            this.endMoveExtents();
        }
    }

})
</script>