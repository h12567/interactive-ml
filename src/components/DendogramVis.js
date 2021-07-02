import React, { Component } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';
import '../App.css';
import { keys } from '@material-ui/core/styles/createBreakpoints';

// var data = {"children":
// [{"name":"boss1","children":[{"name":"mister_a","colname":"level3", "color": "red"},{"name":"mister_b","colname":"level3"},{"name":"mister_c","colname":"level3"},{"name":"mister_d","colname":"level3"}],"colname":"level2"},{"name":"boss2","children":[{"name":"mister_e","colname":"level3"},{"name":"mister_f","colname":"level3"},{"name":"mister_g","colname":"level3"},{"name":"mister_h","colname":"level3"}],"colname":"level2"}],"name":"CEO"};
  

// Purpose: ANnotate with some meta-data useful for visualization
function enrichDendogram(node, color) {

    node['children'] = [];
    if ("left" in node) {
        let transformLeftNode = enrichDendogram(node['left'], node['color'] && node['color'] != 'black' ? node['color'] : color);
        node['children'].push(transformLeftNode);
    }
    if ('right' in node) {
        let transformRightNode = enrichDendogram(node['right'], node['color'] && node['color'] != 'black' ? node['color'] : color);
        node['children'].push(transformRightNode);
    }
    node['color'] = node['color'] && node['color'] != 'black' ? node['color'] : color;
    return node;
}

function DendogramVis({dendogram}) {

    d3.select("#dendogram").html("");
    const ref = useD3(
        (svg) => {
            var root = {"color": "white", 'children': []}
            for (var key in dendogram) {
                let subtreeRoot = dendogram[key];
                var subtree = enrichDendogram(subtreeRoot, "black");
                root['children'].push(subtree);
            }
            var data = root;
            // set the dimensions and margins of the graph
            var width = 460
            var height = 660

            var color = d3.scaleOrdinal()
                // .domain(["blue", "red", "virginica" ])
                // .range([ "#F8766D", "#00BA38", "#619CFF"])
                .domain(["silver", "darkslategray", "seagreen", "darkred", "olive", "darkblue", "maroon3", "red", "darkorange", "gold",
                "lawngreen", "mediumspringgreen", "royalblue", "aqua", "deepskyblue", "blue", "orchid", "fuchsia", "khaki", "lightsalmon"])
                .range(["#c0c0c0", "#2f4f4f", "#2e8b57", "#8b0000", "#808000", "#00008b", "#b03060", "#ff0000", "#ff8c00", "#ffd700", 
                "#7cfc00", "#00fa9a", "#4169e1", "#00ffff", "#00bfff", "#0000ff", "#da70d6", "#ff00ff", "#f0e68c", "#ffa07a"])

            // append the svg object to the body of the page
            var svg = d3.select("#dendogram")
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(40,40)");  // bit of margin on the left = 40
                // .attr('transform', 'rotate(90 0 0)');


            console.log("DENDOGRAM DATA");
            console.log(data);
            // Create the cluster layout:
            var cluster = d3.cluster()
                .size([height, width - 100]);  // 100 is the margin I will have on the right side

            // Give the data to this cluster layout:
            var root = d3.hierarchy(data, function(d) {
                return d.children;
            });
            cluster(root);


            // Add the links between nodes:
            svg.selectAll('path')
                .data( root.descendants().slice(1) )
                .enter()
                .append('path')
                .attr("d", function(d) {
                    return "M" + d.y + "," + d.x
                            + "C" + (d.parent.y + 20) + "," + d.x
                            + " " + (d.parent.y + 210) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                            + " " + d.parent.y + "," + d.parent.x;
                        })
                        // .attr("d", function(d) {
                        //     return "M" + d.y + "," + d.x
                        //             + " " + d.parent.y + "," + d.parent.x;
                        //         })                
                .style("fill", function (d) { return d.data.color ? color(d.data.color) : "none"})
                .attr("stroke", function (d) { return d.data.color ? color(d.data.color) : "black"})


            // Add a circle for each node.
            var nodes = svg.selectAll("g")
                .data(root.descendants())
                .enter()
                .append("g")
                    .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")"
                    })
            nodes.append("circle")
                    .attr("r", 13)
                    .style("fill", "white")
                    .attr("stroke", "black")
                    .style("stroke-width", 2);

            nodes.append("text")
                .text(function(d) { return d.data.name != null ? d.data.name : "" })
                .style("text-anchor", "middle")
                // .style("fill", "black")
                .style("font-family", "Arial")
                .style("font-size", 8);

            // svg.attr('transform',function(){
            //     var me = svg.node()
            //     var x1 = me.getBBox().x + me.getBBox().width/2;//the center x about which you want to rotate
            //     var y1 = me.getBBox().y + me.getBBox().height/2;//the center y about which you want to rotate

            //     return `rotate(90, ${x1}, ${y1})`;//rotate 180 degrees about x and y
            // }); 
            // svg.attr('transform', 'rotate(2 ' + (width / 2) + ' ' + (height/2) + ')');
            
        },
        [dendogram]
    );

    return (
        <svg
            ref={ref}
            id="dendogram"
            width="520"
            height="720"
        >
        </svg>
    );
}

export default DendogramVis;
