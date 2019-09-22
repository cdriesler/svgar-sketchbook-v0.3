<template>
    <div id="demo">
        <div class="box">
            <div class="white">
            </div>
        </div>
        <div class="box active">
            <div 
            class="black"
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
export default Vue.extend({
    data() {
        return {
            coordinate: [] as number[],
        }
    },
    created() {
        this.$store.commit("toggleOnHome");
    },
    destroyed() {
        this.$store.commit("toggleOnHome");
    },
    sockets: {
        update_coordinate(coordinate: number[]): void {
            console.log(coordinate);
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
    }
})
</script>