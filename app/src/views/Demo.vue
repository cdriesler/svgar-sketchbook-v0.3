<template>
    <div id="demo">
        <div class="box">
            <div class="white" v-html="svg">
            </div>
        </div>
        <div class="box active">
            <div 
            class="black"
            ref="svgar"
            @mousedown="onDown"
            @mousemove="onMove"
            @mouseup="onUp"
            @touchstart="onDown"
            @touchmove="onMove"
            @touchend="onUp">
            </div>   
        </div>
    </div>
</template>

<style scoped>
#demo {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    align-content: center;
}

.box {
    width: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.active {
    border-top: 1px solid black;
}

.box > * {
    width: 33vw;
    height: 33vw;
}

.box > .white {
    box-sizing: border-box;
    border: 2px solid black;
}

.box > .black {
    background: black;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Svgar from 'svgar';

export default Vue.extend({
    data() {
        return {
            coordinate: [] as number[],
            size: 0,
        }
    },
    created() {
        this.$store.commit("toggleOnHome");
    },
    mounted() {
        let el = (<Element>this.$refs.svgar);
        this.size = el == undefined ? 0 : el.clientWidth - 4;
    },
    destroyed() {
        this.$store.commit("toggleOnHome");
    },
    sockets: {
        update_coordinate(coordinate: number[]): void {
            //console.log(this.$store.state.coordinate);
        }
    },
    computed: {
        svg(): string {
            let dots = new Svgar.Cube()

            let dot = new Svgar.Slab('dot');

            let dotGeo = new Svgar.Builder.Circle(this.$store.state.coordinate[0], this.$store.state.coordinate[1], this.$store.state.coordinate[0]).build()
            dotGeo.setTag('circle');
            dot.addPath(dotGeo);

            dot.setAllStyles([
                {
                    name: 'filled',
                    attributes: {
                        "stroke": "black",
                        "fill": "black",
                        "stroke-width": "0px"
                    }
                }
            ]);

            dot.setAllStates([
                {
                    name: 'default',
                    styles: {
                        "circle": "filled",
                    }
                }
            ]);

            dots.slabs.push(dot);

            return dots.compile(this.size, this.size + 1);
        }
    },
    methods: {
        onDown(event: TouchEvent): void {
            let coord = this.normalizeEventLocation(event);
            //console.log(coord);
            this.$socket.client.emit('coordinate', {coordinates: coord});
        },
        onMove(event: TouchEvent): void {
            let coord = this.normalizeEventLocation(event);
            //console.log(coord);
            this.$socket.client.emit('coordinate', {coordinates: coord});
        },
        onUp(): void {

        },
        normalizeEventLocation(event: TouchEvent): number[] {
            if (event.targetTouches.length <= 0 || event == undefined) {
                return [];
            }

            let t = event.targetTouches[0];
            let div: DOMRect = (<any>event).target.getBoundingClientRect();

            let x = (t.pageX - div.left) / div.width;
            let y = 1 - ((t.pageY - div.top) / div.height);

            return [+x, +y];
        },
        truncateCoordinate(c: number[]): string {
            if (c.length != 2) {
                return '';
            }
            return (c[0] * 100).toString().substr(0, 5) + ', ' + (c[1] * 100).toString().substr(0, 5);
        }
    }
})
</script>