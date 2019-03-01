<template>
    <div ref="container" class="m_graph_container">
    </div>
</template>

<script>
import {
    mxToolbar as MxToolbar,
    mxGraphModel as MxGraphModel,
    mxGraph as MxGraph,
    mxKeyHandler as MxKeyHandler,
    mxRubberband as MxRubberband,
    mxCell as MxCell,
    mxGeometry as MxGeometry,
    mxEvent as MxEvent,
    mxUtils as MxUtils
} from 'mxgraph/javascript/mxClient';

export default {
    name: 'HelloWorld',
    data() {
        return {
            keyHandler: null,
            rubberband: null,
            model: null,
            graph: null
        };
    },
    methods: {
        addToolbarItem(graph, toolbar, prototype, image) {
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function (graph, evt, cell, x, y) {
                graph.stopEditing(false);

                var vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = x;
                vertex.geometry.y = y;

                graph.addCell(vertex);
                graph.setSelectionCell(vertex);
            };

            // Creates the image which is used as the drag icon (preview)
            var img = toolbar.addMode(null, image, function (evt, cell) {
                var pt = this.graph.getPointForEvent(evt);
                funct(graph, evt, cell, pt.x, pt.y);
            });


            // This listener is always called first before any other listener
            // in all browsers.
            MxEvent.addListener(img, 'mousedown', function (evt) {
                if (img.enabled === false) {
                    MxEvent.consume(evt);
                }
            });

            MxUtils.makeDraggable(img, graph, funct);

            return img;
        }
    },
    mounted() {
        // Creates the div for the toolbar
        let tbContainer = document.createElement('div');

        tbContainer.style.position = 'absolute';
        tbContainer.style.overflow = 'hidden';
        tbContainer.style.padding = '2px';
        tbContainer.style.left = '0px';
        tbContainer.style.top = '0px';
        tbContainer.style.width = '24px';
        tbContainer.style.bottom = '0px';

        this.$refs.container.appendChild(tbContainer);

        // Creates new toolbar without event processing
        let toolbar = new MxToolbar(tbContainer);
        toolbar.enabled = false;

        // Creates the div for the graph
        let container = document.createElement('div');

        container.style.position = 'absolute';
        container.style.overflow = 'hidden';
        container.style.left = '24px';
        container.style.top = '0px';
        container.style.right = '0px';
        container.style.bottom = '0px';
        container.style.background = 'url("./images/grid.gif")';

        this.$refs.container.appendChild(container);

        // Creates the model and the graph inside the container
        // using the fastest rendering available on the browser
        this.model = new MxGraphModel();
        this.graph = new MxGraph(container, this.model);

        // Enables new connections in the graph
        this.graph.setConnectable(true);
        this.graph.setMultigraph(false);

        // Stops editing on enter or escape keypress
        this.keyHandler = new MxKeyHandler(this.graph);
        this.rubberband = new MxRubberband(this.graph);

        var addVertex = (icon, w, h, style) => {
            let vertex = new MxCell(null, new MxGeometry(0, 0, w, h), style);
            vertex.setVertex(true);

            let img = this.addToolbarItem(this.graph, toolbar, vertex, icon);
            img.enabled = true;

            this.graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
                let tmp = this.graph.isSelectionEmpty();

                MxUtils.setOpacity(img, (tmp) ? 100 : 20);
                img.enabled = tmp;
            });
        };

        addVertex('./images/rectangle.gif', 100, 40, '');
        addVertex('./images/rounded.gif', 100, 40, 'shape=rounded');
        addVertex('./images/ellipse.gif', 40, 40, 'shape=ellipse');
        addVertex('./images/rhombus.gif', 40, 40, 'shape=rhombus');
        addVertex('./images/triangle.gif', 40, 40, 'shape=triangle');
        addVertex('./images/cylinder.gif', 40, 40, 'shape=cylinder');
        addVertex('./images/actor.gif', 30, 40, 'shape=actor');
    }
};
</script>

<style scoped>
.m_graph_container {
    height: 100%;
    width: 100%;
}
</style>
