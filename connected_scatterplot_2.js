// Set the dimensions and margins of the graph
const margin2 = { top: 10, right: 30, bottom: 50, left: 60 };
const width2 = 460 - margin2.left - margin2.right;
const height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const neg_scatter_svg = d3
  .select("#neg-connected-scatter-chart")
  .append("svg")
  .attr("width", 700)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

function updateNegConnectedScatterPlot(selectCountry) {
  // Remove existing chart elements
  neg_scatter_svg.selectAll("*").remove();

  //Read the data
  d3.csv("agriculture_poverty.csv").then(function (data) {
    // Filter data for India only
    data = data.filter((d) => d.country === selectCountry);

    // If no data is available for the selected country, show a message and exit the function
    if (data.length === 0) {
      neg_scatter_svg
        .append("text")
        .attr("x", width1 / 2)
        .attr("y", height1 / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("No data available for the selected country");
      return;
    }

    // Filter out any rows with missing values
    data = data.filter(
      (d) =>
        !isNaN(d.inputs) &&
        !isNaN(d.output) &&
        !isNaN(d.poverty_gap_index_international_povline)
    );

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width2]);
    neg_scatter_svg
      .append("g")
      .attr("transform", `translate(0, ${height2})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(
            d.inputs,
            d.output,
            d.poverty_gap_index_international_povline
          )
        ) * 1.1,
      ])
      .range([height2, 0]);
    neg_scatter_svg.append("g").call(d3.axisLeft(y));

    // Initialize line with input data
    const line = neg_scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.inputs))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");

    // Initialize line with output data
    const line2 = neg_scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.output))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");

    // Initialize line with poverty gap index data
    const line3 = neg_scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.poverty_gap_index_international_povline))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");

    // Define the mouseover, mousemove, and mouseleave functions
    const mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };

    // Initialize dots with input data
    const dot = neg_scatter_svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.inputs))
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // Initialize dots with output data
    const dot2 = neg_scatter_svg
      .selectAll("circle.output")
      .data(data)
      .join("circle")
      .attr("class", "output")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.output))
      .attr("r", 7)
      .style("fill", "#404080")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
     
      //initialize dots with poverty gap index international povline data

    const dot3 = neg_scatter_svg
      .selectAll("circle.poverty_gap_index_international_povline")
      .data(data)
      .join("circle")
      .attr("class", "poverty_gap_index_international_povline")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.poverty_gap_index_international_povline))
      .attr("r", 7)
      .style("fill", "#800040")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      //mouse move event for display tooltip

    function mousemove(event, d) {
      const formatDecimal = d3.format(".2f");
      if (d3.select(this).classed("poverty_gap_index_international_povline")) {
        Tooltip.html(
          "Poverty gap index(International Povline): " +
            formatDecimal(d.poverty_gap_index_international_povline)
        )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      } else if (d3.select(this).classed("output")) {
        Tooltip.html("output ratio: " + formatDecimal(d.output))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      } else {
        Tooltip.html("Inputs ratio: " + formatDecimal(d.inputs))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      }
    }

    function mouseleave(d) {
      Tooltip.style("opacity", 0);
    }

    // create a tooltip
    var Tooltip = d3
      .select("#neg-connected-scatter-chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

      // Add axis labels
      neg_scatter_svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0)
  .attr("y", 20)
  .attr("dy", "-3.5em")
  .attr("text-anchor", "end")
  .text("Input ratio, Output ratio, Poverty gap index");
  // add yaxis labels
  neg_scatter_svg.append("text")
  .attr("x", 190)
  .attr("y", 385)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "middle")
  .text("Year");

// Define legend data
const legendData = [
  { label: "Input Ratio in Agriculture", color: "#69b3a2" },
  { label: "Output Ratio in Agriculture", color: "#404080" },
  { label: "Poverty Gap Index(International Povline)", color: "#800040" }
];

// Add legend
const legend = neg_scatter_svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(400, 0)`);

  legend.selectAll("circle")
  .data(legendData)
  .enter()
  .append("circle")
  .attr("cx", 5) // center of the circle on x-axis
  .attr("cy", (d, i) => i * 20 + 5) // center of the circle on y-axis
  .attr("r", 5) // radius of the circle
  .style("fill", d => d.color);

legend.selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .attr("x", 15)
  .attr("y", (d, i) => i * 20 + 9)
  .style("font-size", "12px")
  .text(d => d.label);

  });
}

// Display chart for India initially
updateNegConnectedScatterPlot("United Kingdom");
