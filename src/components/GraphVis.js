import React, { Component } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';
import '../App.css';
import { keys } from '@material-ui/core/styles/createBreakpoints';

function flattenTree(tree, num_points) {
    let default_color = "silver";
    let width_gap = 450 / num_points;
    let lines = [];
    function flattenTreeHelper(subtree, color) {
        let subResult = [];
        let cur_x = subtree["loc"][0] * width_gap + width_gap/2;
        let cur_y = subtree["loc"][1] * 100 + 110;
        subResult = subResult.concat([
            {
                "x": cur_x,
                "y": cur_y,
                "color": color,
                "name": subtree["name"] != undefined ? subtree["name"] : ""
            }
        ]);
        if (subtree["left"]) {
            let left_x = subtree["left"]["loc"][0] * width_gap + width_gap/2;
            let left_y = subtree["left"]["loc"][1] * 100 + 110;
            lines = lines.concat([
                [cur_x, cur_y, left_x, left_y, color]
            ]);
            subResult = subResult.concat(flattenTreeHelper(subtree["left"], color));
        } 
        if (subtree["right"]) {
            let right_x = subtree["right"]["loc"][0] * width_gap + width_gap/2;
            let right_y = subtree["right"]["loc"][1] * 100 + 110;
            lines = lines.concat([
                [cur_x, cur_y, right_x, right_y, color]
            ]);
            subResult = subResult.concat(flattenTreeHelper(subtree["right"], color));
        }

        return subResult;
    }

    let result = [];
    for (var key in tree) {
        let subtree = tree[key];
        result = result.concat(flattenTreeHelper(subtree, subtree["color"] ? subtree["color"] : default_color));
    }
    return {"result": result, "lines": lines};
}

function GraphVis({tree, num_points}) {

    d3.select("#graph").html("");
    const ref = useD3(
        (svg) => {
            let flattenResult = flattenTree(tree, num_points);
            let data = flattenResult["result"];
            let lines = flattenResult["lines"];
            var margin = {top: 240, right: 30, bottom: 30, left: 30},
            width = 920 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

            while (d3.select("#graph").firstChild) {
                d3.select('#graph').removeChild(svg.lastChild);
            }

            // let svg_width = width ;
            // let svg_height = height ;
            var svg = d3.select("#graph")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")

            svg
            .append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("height", height)
                .attr("width", width)
                .attr("fill", "#EBEBEB")

            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, width])
                .range([ 0, width ])
            // svg.append("g")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(d3.axisBottom(x).tickSize(-width).ticks(10))
            //     .select(".domain").remove()

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, height])
                .range([height, 0])
                .nice()
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(-height).ticks(10))
                .select(".domain").remove()

            // Customization
            svg.selectAll(".tick line").attr("stroke", "white")

            var color = d3.scaleOrdinal()
            // .domain(["blue", "red", "virginica" ])
            // .range([ "#F8766D", "#00BA38", "#619CFF"])
            .domain(["silver", "darkslategray", "seagreen", "darkred", "olive", "darkblue", "maroon3", "red", "darkorange", "gold",
            "lawngreen", "mediumspringgreen", "royalblue", "aqua", "deepskyblue", "blue", "orchid", "fuchsia", "khaki", "lightsalmon"])
            .range(["#c0c0c0", "#2f4f4f", "#2e8b57", "#8b0000", "#808000", "#00008b", "#b03060", "#ff0000", "#ff8c00", "#ffd700", 
            "#7cfc00", "#00fa9a", "#4169e1", "#00ffff", "#00bfff", "#0000ff", "#da70d6", "#ff00ff", "#f0e68c", "#ffa07a"])

            // Add points
            var nodes = svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()

            nodes.append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 11)
            .style("fill", function (d) { return color(d.color) } )

            nodes.append("text")
            .text(function(d) { console.log("NAME HERE"); console.log(d);return d.name != null ? d.name : "" })
            .attr("x", function (d) { return x(d.x);})
            .attr("y", function (d) { return y(d.y);})
            .style("text-anchor", "middle")
            // .style("fill", "black")
            .style("font-family", "Arial")
            .style("font-size", 13);

            for (let i = 0; i < lines.length; i++) {
                // svg.append('line')
                // .style("stroke", color(lines[i][4]))
                // .style("stroke-width", 2)
                // .attr("x1", lines[i][2] - margin['left'])
                // .attr("y1", 900 - (2*lines[i][3] - 100))
                // .attr("x2", lines[i][0] - margin['left'])
                // .attr("y2", 900 - (2*lines[i][1] - 100)); 

                svg.append('line')
                .style("stroke", color(lines[i][4]))
                .style("stroke-width", 2)
                .attr("x1", lines[i][2])
                .attr("y1", height - lines[i][3])
                .attr("x2", lines[i][0])
                .attr("y2", height - lines[i][1]); 
            }
        },
        [tree]
    );

    return (
        <svg
            ref={ref}
            id="graph"
            width="520"
            height="720"
        >
        </svg>
    )
}

export default GraphVis;
