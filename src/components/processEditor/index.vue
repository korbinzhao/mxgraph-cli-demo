<template>
    <div class="m_container">
        <div id="toolbar" class="m_toolbar">
            <v-toolbar height="36px">
                <v-toolbar-items class="hidden-sm-and-down">
                    <template v-for="(icon, index) in icons">
                        <v-btn flat icon :key="index">
                            <img v-if="icon.click" :src='`./images/${icon.name}.gif`' :alt="icon.name" ref="img"
                                 @click="icon.click"/>
                            <img v-else :src='`./images/${icon.name}.gif`' :alt="icon.name" ref="img"/>
                        </v-btn>
                    </template>
                </v-toolbar-items>
            </v-toolbar>
        </div>
        <div id="graph" class="m_graph">
            <div class="m_graph_container" ref="graphContainer" @drop="dropHandler"></div>
        </div>
        <div id="status" class="m_status" align="right">
            <!-- Status Here -->
        </div>
    </div>
</template>

<script>
import {
    mxGraph as MxGraph,
    mxUtils as MxUtils,
    mxCell as MxCell,
    mxGeometry as MxGeometry,
    mxUndoManager as MxUndoManager,
    mxEvent as MxEvent
} from 'mxgraph/javascript/mxClient';

export default {
    name: 'test',
    data() {
        return {
            icons: [
                {name: 'save', click: this.save},
                {name: 'undo', click: this.undo},
                {name: 'redo', click: this.redo},
                {name: 'cut'},
                {name: 'copy'},
                {name: 'paste'},
                {name: 'delete'},
                {name: 'group'},
                {name: 'ungroup'},
                {name: 'select'},
                {name: 'pan'},
                {name: 'connect'},
                {
                    name: 'swimlane',
                    draggable: true,
                    width: 220,
                    height: 480,
                    style: 'shape=swimlane;perimeter=rectanglePerimeter;fontSize=12;startSize=36;rounded=1;align=center;verticalAlign=top;spacingTop=8;fontColor=white;separatorColor=#c0c0c0'
                },
                {
                    name: 'rectangle',
                    draggable: true,
                    width: 80,
                    height: 30,
                    style: 'shape=rectangle;'
                },
                {name: 'rounded', draggable: true, width: 80, height: 30, style: 'shape=rounded;'},
                {
                    name: 'ellipse',
                    draggable: true,
                    width: 60,
                    height: 50,
                    style: 'shape=ellipse;'
                },
                {name: 'rhombus', draggable: true, width: 60, height: 40, style: 'shape=rhombus;'},
                {name: 'actor', draggable: true, width: 50, height: 50, style: 'shape=actor;'},
                {name: 'cylinder', draggable: true, width: 50, height: 50, style: 'shape=cylinder;'},
                {name: 'hline', draggable: true, width: 50, height: 50, style: 'shape=line;'},
                {name: 'zoom'},
                {name: 'zoomin'},
                {name: 'zoomout'},
                {name: 'zoomactual'},
                {name: 'zoom'},
                {name: 'outline'},
                {name: 'tasks'},
                {name: 'help'},
                {name: 'console'}
            ],
            graph: null,
            undoManager: {}
        };
    },
    methods: {
        undo() {
            if (this.undoManager) {
                this.undoManager.undo();
            }
        },
        redo(){
            if (this.undoManager) {
                this.undoManager.redo();
            }
        },
        save() {
            console.info('save operate');
        },
        dropHandler(evt) {
            console.info(evt);
        },
        init() {
            this.graph = new MxGraph(this.$refs.graphContainer);
        },
        instantiateIcon() {
            for (let tmpIndex = 0; tmpIndex < this.$refs.img.length; tmpIndex++) {
                let tmpImg = this.$refs.img[tmpIndex];

                let tmpImgData = this.icons[tmpIndex];

                if (tmpImg && tmpImgData && tmpImgData.draggable) {

                    let prototype = new MxCell(null, new MxGeometry(0, 0, tmpImgData.width, tmpImgData.height), tmpImgData.style);

                    prototype.setVertex(true);
                    let addCell = function (graph, evt, cell, x, y) {
                        graph.stopEditing(false);
                        let vertex = graph.getModel().cloneCell(prototype);

                        vertex.geometry.x = x;
                        vertex.geometry.y = y;

                        graph.addCell(vertex);
                        graph.setSelectionCell(vertex);
                    };

                    MxUtils.makeDraggable(tmpImg, this.graph, addCell);
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
            this.instantiateIcon();

            this.undoManager = new MxUndoManager();
            let listener = (sender, evt) => {
                this.undoManager.undoableEditHappened(evt.getProperty('edit'));
            };

            this.graph.getModel().addListener(MxEvent.UNDO, listener);
            this.graph.getView().addListener(MxEvent.UNDO, listener);
        });
    }
};
</script>

<style scoped>
.m_container {
    height: 100%;
    width: 100%;
    margin: 0;
    position: relative;
    overflow: hidden;
}

#toolbar {
    position: absolute;
    top: 0;
    height: 36px;
    left: 0;
    right: 0;
    padding-left: 0;
}

.m_toolbar .v-toolbar__content {
    height: 36px !important;
}

#graph {
    position: absolute;
    left: 0;
    right: 0;
    top: 36px;
    bottom: 20px;
}

#status {
    position: absolute;
    height: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    white-space: nowrap;
    color: gray;
    border-style: none;
    border-top-style: solid;
    border-color: silver;
    border-width: 1px;
    padding-top: 6px;
    _padding-top: 4px;
    padding-right: 8px;
}

.m_container {
    width: 100%;
    height: 100%;
}

.m_graph_container {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
