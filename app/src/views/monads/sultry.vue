<template>
    <div id="heatmap">
        <div 
        class="svgar" 
        ref="svgar" 
        id="svgar" 
        v-html="svg"
        @mousemove="onMove">
            
        </div>
        <div class="db">
            
        </div>
    </div>
</template>

<style scoped>
#heatmap {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.svgar {
    width: 400px;
    max-width: calc(100vw - 60px);
    height: 400px;
    max-height: calc(100vw - 60px);

    border: 2px solid black;
    background: white;

    box-sizing: border-box;
}

</style>

<script lang="ts">
import Vue from 'vue'
import Svgar, { Create, Update, Locate } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import SvgarPath from 'svgar/dist/models/SvgarPath';
import SvgarSlab from 'svgar/dist/models/SvgarSlab';

interface PathReference {
    id: string,
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number
}

export default Vue.extend({
    name: "sultry",
    props: ["options"],
    data() {
        return {
            cube: {} as SvgarCube,
            paths: [] as PathReference[],
            w: 0,
            h: 0,
            prev: 0,
            firebase: {},
            heat: [] as SvgarSlab[],
        }
    },
    created() {    
        this.cube = Create().svgar.cube("heatmap").then.build();
    },
    mounted() {
        let el = (<Element>this.$refs.svgar);
        this.w = el ? el.clientWidth : 0;
        this.h = el ? el.clientHeight : 0;

        this.heat = this.makeGrid(12, 12, 1);

        let slab = Create().svgar.slab("cells").then.build();
        Update().svgar.cube(this.cube).camera.extentsTo(0, 0, 12, 12);
    },
    computed: {
        svg(): string {
            if (this.w == 0) {
                return "";
            }

            Update().svgar.cube(this.cube).slabs.to([...this.heat])

            return this.cube.compile(this.w, this.h);
        }
    },
    watch: {
        options: function() {
            this.heat = this.makeGrid(12, 12, 1);
        }
    },
    methods: {
        makeGrid(width: number, height: number, size: number): SvgarSlab[] {
            let slabs: SvgarSlab[] = [];

            this.paths = [];

            for(let i = 0; i * size < width; i += 1) {

                for(let j = 0; j * size < height; j += 1) {
                    let p: number[] = [
                        i * size,
                        j * size,
                        (i + 1) * size,
                        j * size,
                        (i + 1) * size,
                        (j + 1) * size,
                        i * size,
                        (j + 1) * size
                    ];

                    let slab = new SvgarSlab(`HM${i}${j}`);

                    let sq = new Svgar.Builder.Polyline(p[0], p[1])
                    .lineTo(p[2], p[3])
                    .lineTo(p[4], p[5])
                    .lineTo(p[6], p[7])
                    .close();

                    let path = sq.build();

                    slab.setAllGeometry([path]);
                    slab.setAllStyles([
                        {
                            name: "default",
                            attributes: {
                                "stroke": "white",
                                "stroke-width": "0.5px",
                                "fill": "black",
                                "opacity": "0"
                            }
                        }
                    ]);
                    slabs.push(slab);

                    this.paths.push({
                        id: slab.getId(),
                        xMin: p[0],
                        yMin: p[1],
                        xMax: p[4],
                        yMax: p[5]
                    });

                }

            }

            return slabs;
        },
        onMove(event: MouseEvent): void {
            
            let t = Date.now();
            if (t - this.prev < 50) {
                return;
            }

            const box = (<Element>this.$refs.svgar).getBoundingClientRect();
            let x = ((event.pageX - box.left) / this.w) * 12;
            let y = ((this.h - (event.pageY - box.top)) / this.h) * 12;

            let target = this.paths.find(p => p.yMax > y && p.yMin < y && p.xMax > x && p.xMin < x);

            let cell = Locate().svgar.slab.withId(target ? target.id : "").in.svgar.cube(this.cube);

            if(cell) {
                let o = cell.getAllStyles().find(x => x.name == "default");
                let op = o ? +o.attributes["opacity"] + 0.05 : 0;

                Update().svgar.slab(cell).styles.to([
                    {
                        name: "default",
                        attributes: {
                            "stroke": "white",
                            "sroke-width": "0.5px",
                            "fill": "black",
                            "opacity": op.toString(),
                        }
                    }
                ])
            }

            this.prev = t;
        }
    }
})
</script>