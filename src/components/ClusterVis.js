import React, { Component } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';

function ClusterVis({data, centroids, is_display}) {

    const ref = useD3(
        (svg) => {
            var margin = {top: 30, right: 30, bottom: 30, left: 30},
                width = 520 - margin.left - margin.right,
                height = 520 - margin.top - margin.bottom;

            while (d3.select("#k-means").firstChild) {
                d3.select('#k-means').removeChild(svg.lastChild);
            }

            var svg = d3.select("#k-means")
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
                .domain([0, 1000])
                .range([ 0, width ])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(-width).ticks(10))
                .select(".domain").remove()

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 1000])
                .range([height, 0])
                .nice()
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(-height).ticks(10))
                .select(".domain").remove()

            // Customization
            svg.selectAll(".tick line").attr("stroke", "white")

            // // Add X axis label:
            // svg.append("text")
            //     .attr("text-anchor", "end")
            //     .attr("x", width/2 + margin.left)
            //     .attr("y", height + margin.top + 20)
            //     .text("");
            //
            // // Y axis label:
            // svg.append("text")
            //     .attr("text-anchor", "end")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", -margin.left + 20)
            //     .attr("x", -margin.top - height/2 + 20)
            //     .text("")
            // Color scale: give me a specie name, I return a color

            var color = d3.scaleOrdinal()
                // .domain(["blue", "red", "virginica" ])
                // .range([ "#F8766D", "#00BA38", "#619CFF"])
                .domain(["silver", "darkslategray", "seagreen", "darkred", "olive", "darkblue", "maroon3", "red", "darkorange", "gold",
                "lawngreen", "mediumspringgreen", "royalblue", "aqua", "deepskyblue", "blue", "orchid", "fuchsia", "khaki", "lightsalmon"])
                .range(["#c0c0c0", "#2f4f4f", "#2e8b57", "#8b0000", "#808000", "#00008b", "#b03060", "#ff0000", "#ff8c00", "#ffd700", 
                "#7cfc00", "#00fa9a", "#4169e1", "#00ffff", "#00bfff", "#0000ff", "#da70d6", "#ff00ff", "#f0e68c", "#ffa07a"])

            // Add clusters
            svg.append('g')
                .selectAll("dot")
                .data(centroids)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.x-20); } )
                .attr("y", function (d) { return y(d.y+20); } )
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", function (d) { return color(d.color) } )

            
            // Add points
            var nodes = svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
            
            // var nodes = svg.selectAll("g")
            //     .data(data)
            //     .enter()
            //     .append('g').attr("transform", function(d) {
            //         return "translate(" + d.y + "," + d.x + ")"
            //     })

            nodes.append("circle")
                .attr("cx", function (d) { return x(d.x); } )
                .attr("cy", function (d) { return y(d.y); } )
                .attr("r", 8)
                .style("fill", function (d) { return color(d.color) } )

            if (is_display == 1) {
                nodes.append("text")
                .text(function(d) { console.log("NAME HERE"); console.log(d);return d.name != null ? d.name : "" })
                .attr("x", function (d) { return x(d.x);})
                .attr("y", function (d) { return y(d.y);})
                .style("text-anchor", "middle")
                // .style("fill", "black")
                .style("font-family", "Arial")
                .style("font-size", 13);
            }

        },
        [data]
    );

    return (
        // <div
        //     id="k-means"
        // >
        <svg
            ref={ref}
            id="k-means"
            width="520"
            height="520"
        >

        </svg>
        // </div>
    );
}

export default ClusterVis;
