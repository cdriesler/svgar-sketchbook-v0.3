<template>
    <div id="chuckfit">
        <div class="main" ref="svgar" v-html="svg">

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
            info: {} as ChuckFitDrawing,
            svgar: {} as SvgarCube,
        }
    },
    watch: {
        svg(): void {
            this.$nextTick(() => this.svgar.listen());
            //this.$nextTick(() => this.svgar.listen);
            console.log("Changed!");
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
                c.attach("mousedown", this.beginMoveExtents);

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
            console.log("active");
            Update().svgar.slab(this.getExtents()).state.to("active");
        },
        deactivateExtents(): void {
            console.log("default");
            Update().svgar.slab(this.getExtents()).state.to("default");
        },
        beginMoveExtents(event: MouseEvent): void {
            const id = (<Element>event.srcElement).id;
            console.log(this.info.borderMappings[id]);
            //console.log(Locate().svgar.path.withId(id).in.svgar.cube(this.svgar));
        }
    }

})
</script>