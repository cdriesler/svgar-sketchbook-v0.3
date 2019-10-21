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

    border-radius: 15px;
    border: 2px solid black;
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
            location: 0,
            boxX: 1,
            boxY: 0,
            size: 0,
            previous: 0,
        }
    },
    created() {
        this.$store.commit("toggleOnHome");
        this.startSpin();
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
            let dots = new Svgar.Cube("main")

            let dot = new Svgar.Slab('dot');

            let dotGeo = new Svgar.Builder.Circle(this.$store.state.coordinate[0] || 0, this.$store.state.coordinate[1] || 0, 0.5).build()
            dotGeo.setTag('circle');
            dotGeo.setElevation(0);
            dot.addPath(dotGeo);

            let dotOutline = new Svgar.Builder.Circle(this.$store.state.coordinate[0] || 0, this.$store.state.coordinate[1] || 0, 0.5).build();
            dotOutline.setTag('outline');
            dotOutline.setElevation(2);
            dot.addPath(dotOutline);

            let size = 0.5;
            let square = new Svgar.Builder.Polyline(this.boxX + size, this.boxY - size)
            .lineTo(this.boxX + size, this.boxY + size)
            .lineTo(this.boxX - size, this.boxY + size)
            .lineTo(this.boxX - size, this.boxY - size)
            .close()
            .build();
            square.setTag('square');
            square.setElevation(1);
            dot.addPath(square);

            dots.frame([0, 0], 3, 3);

            dot.setAllStyles([
                {
                    name: 'filled',
                    attributes: {
                        "stroke": "black",
                        "fill": "black",
                        "stroke-width": "2px"
                    },
                },
                {
                    name: 'frame',
                    attributes: {
                        "stroke": "black",
                        "fill": "white",
                        "stroke-width": "2px",
                    }
                },
                {
                    name: 'outlined',
                    attributes: {
                        "stroke": "black",
                        "fill": "none",
                        "stroke-width": "2px"
                    }
                }
            ]);

            dot.setAllStates([
                {
                    name: 'default',
                    styles: {
                        "circle": "filled",
                        "square": "frame",
                        "outline": "outlined"
                    }
                }
            ]);

            dots.slabs.push(dot);

            return dots.compile(this.size, this.size + 1);
        }
    },
    methods: {
        startSpin(): void {
            setInterval(() => this.updatePosition(), 20);
        },
        updatePosition(): void {
            this.location = (this.location + 1) % 360;
            if (this.location % 45 == 0) {
                if (this.location % 180 == 0) {
                    navigator.vibrate(100);
                }
                else {
                    navigator.vibrate(25);
                }
                
            }
            let rad = this.location * (Math.PI / 180);
            this.boxX = Math.cos(rad);
            this.boxY = Math.sin(rad);
        },
        onDown(event: TouchEvent): void {
            let coord = this.normalizeEventLocation(event);
            this.$socket.client.emit('coordinate', {coordinates: coord});
        },
        onMove(event: TouchEvent): void {
            if(Date.now() - this.previous < 50) {
                return;
            }

            let coord = this.normalizeEventLocation(event);

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

            return [(+x - 0.5) * 3, (+y - 0.5) * 3];
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