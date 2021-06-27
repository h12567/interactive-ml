import React, { Component } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';

function ClusterVis({data, centroids}) {

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
                .domain(["red", "orange", "yellow", "green", "blue", "indigo", "violet"])
                .range(["#FF0000", "#ffa500", "#FFFF00", "#00FF00", "#0000FF", "#4b0082", "#d16aff"])

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
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); } )
                .attr("cy", function (d) { return y(d.y); } )
                .attr("r", 5)
                .style("fill", function (d) { return color(d.color) } )



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
