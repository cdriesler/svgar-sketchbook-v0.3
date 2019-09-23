<template>
    <div id="demo">
        <div class="box">
            <div class="white" v-html="svg">
            </div>
            <br>
            {{truncateCoordinate(this.$store.state.coordinate)}}
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
import * as Svgar from 'svgar';

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
            let dot = new Svgar.Drawing("dot");

            let dotGeo = new Svgar.Layer("dot_main").AddTag("default");
            dotGeo.AddGeometry(new Svgar.CircleBuilder(this.$store.state.coordinate, 0.02).Build());

            let dotState = new Svgar.State("main").Target("dot_style", "default");
            dotState.AddStyle(new Svgar.StyleBuilder("dot_style").Stroke("#000000").Fill("#000000").StrokeWidth("2px").Build());

            dot.AddLayer(dotGeo).AddState(dotState);

            return dot.Compile("main", this.size, this.size);
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