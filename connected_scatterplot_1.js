// Set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 50, left: 60 };
const width1 = 460 - margin.left - margin.right;
const height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const scatter_svg = d3
  .select("#connected-scatter-chart")
  .append("svg")
  .attr("width", 610)
  .attr("height", height1 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

function updateConnectedScatterPlot(selectCountry) {
  // Remove existing chart elements
  scatter_svg.selectAll("*").remove();

  //Read the data
  d3.csv("agriculture_poverty.csv").then(function (data) {
    // Filter data for Brazil only
    data = data.filter((d) => d.country === selectCountry);

    // If no data is available for the selected country, show a message and exit the function
    if (data.length === 0) {
      scatter_svg
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
        !isNaN(d.tfp) &&
        !isNaN(d.income_gap_ratio_international_povline) &&
        !isNaN(d.headcount_ratio_international_povline)
    );

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width1]);
    scatter_svg
      .append("g")
      .attr("transform", `translate(0, ${height1})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(
            d.tfp,
            d.income_gap_ratio_international_povline,
            d.headcount_ratio_international_povline
          )
        ) * 1.1,
      ])
      .range([height1, 0]);
    scatter_svg.append("g").call(d3.axisLeft(y));

    // Initialize line with group a
    const line = scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.tfp))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");

    // Initialize line with group b
    const line2 = scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.income_gap_ratio_international_povline))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");
      //initialise line 3 with groub c

    const line3 = scatter_svg
      .append("g")
      .append("path")
      .datum(data)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(+d.year))
          .y((d) => y(+d.headcount_ratio_international_povline))
      )
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .attr("fill", "none");

    // Define the mouseover, mousemove, and mouseleave functions
    const mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };

    // Initialize dots with group a
    const dot = scatter_svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.tfp))
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      //initialize dots with group b
    const dot2 = scatter_svg
      .selectAll("circle.income_gap_ratio_international_povline")
      .data(data)
      .join("circle")
      .attr("class", "income_gap_ratio_international_povline")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.income_gap_ratio_international_povline))
      .attr("r", 7)
      .style("fill", "#404080")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      //initialize dots with group c
    const dot3 = scatter_svg
      .selectAll("circle.headcount_ratio_international_povline")
      .data(data)
      .join("circle")
      .attr("class", "headcount_ratio_international_povline")
      .attr("cx", (d) => x(+d.year))
      .attr("cy", (d) => y(+d.headcount_ratio_international_povline))
      .attr("r", 7)
      .style("fill", "#800040")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      //mouse move events for tooltip
  
    function mousemove(event, d) {
      const formatDecimal = d3.format(".2f");
      if (d3.select(this).classed("income_gap_ratio_international_povline")) {
        Tooltip.html(
          "Income gap ratio: " +
            formatDecimal(d.income_gap_ratio_international_povline)
        )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      } else if (
        d3.select(this).classed("headcount_ratio_international_povline")
      ) {
        Tooltip.html(
          "Headcount ratio: " +
            formatDecimal(d.headcount_ratio_international_povline)
        )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      } else {
        Tooltip.html("TFP: " + formatDecimal(d.tfp))
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + "px");
      }
    }

    function mouseleave(d) {
      Tooltip.style("opacity", 0);
    }

    // create a tooltip
    var Tooltip = d3
      .select("#connected-scatter-chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

      // Add axis labels
  scatter_svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0)
  .attr("y", 20)
  .attr("dy", "-3.5em")
  .attr("text-anchor", "end")
  .text("TFP, Income Gap Ration, International Povertyline");
  // add yaxis labels
  scatter_svg.append("text")
  .attr("x", 190)
  .attr("y", 385)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "middle")
  .text("Year");

// Define legend data
const legendData = [
  { label: "Total Factor Productivity", color: "#69b3a2" },
  { label: "Income Gap Ratio", color: "#404080" },
  { label: "Poverty Ratio", color: "#800040" }
];

// Add legend
const legend = scatter_svg.append("g")
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

// Display chart for Afghanistan initially
updateConnectedScatterPlot("United Kingdom");
