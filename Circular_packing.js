// Set the dimensions and margins of the graph
const width = 700;
const height = 500;

let circularPackingData;

// Append the SVG object to the body of the page
const bubble_svg = d3
  .select("#bubble_chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Add title to the chart
bubble_svg
  .append("text")
  .attr("class", "chart-title")
  .attr("x", width / 2)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .text("Circular Packing:Interrelationships between TFP, Fertility Rate and International Poverty");

// Load the CSV data
d3.csv("Fertility_Poverty_TFP.csv")
  .then((data) => {
    // Convert numeric values
    data.forEach((d) => {
      d.FactValueNumeric = +d.FactValueNumeric;
      d.tfp = +d.tfp;
    });
    circularPackingData= data;
    
    const numBins = 5;
    const minTfp = d3.min(data, (d) => d.tfp);
    const maxTfp = d3.max(data, (d) => d.tfp);
    const quantizeScale = d3
      .scaleQuantize()
      .domain([minTfp, maxTfp])
      .range(d3.range(numBins));
    const color = d3
      .scaleOrdinal()
      .domain(d3.range(numBins))
      .range(d3.schemeTableau10.slice(0, numBins));

    // Create a size scale
    const size = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.FactValueNumeric))
      .range([7, 55]);

    // Create a tooltip
    const Tooltip = d3
      .select("#bubble_chart")
      .append("div")
      .attr("class", "bubbletooltip");

    // Define mouse events
    const mouseover = (event, d) => {
      Tooltip.style("opacity", 1);
    };

    const mousemove = (event, d) => {
      let tooltipContent = `<u>${d.Entity}</u>`;
      const columns = [
        { key: "tfp", label: "Total Fector Productivity" },
        { key: "FactValueNumeric", label: "Fertility Rate" },
        { key: "headcount_ratio_international_povline", label: "Population Ration under International Povline" }
      ];
    
      columns.forEach((column) => {
        if (d[column.key] === 0 || d[column.key] === "0") {
          tooltipContent += `<br>${column.label}: No data`;
        } else {
          let formattedValue = Number.parseFloat(d[column.key]).toFixed(2);
          if (column.key === "headcount_ratio_international_povline") {
            formattedValue = Number.parseFloat(d[column.key]).toFixed(2);
          }
          tooltipContent += `<br>${column.label}: ${formattedValue}`;
        }
      });

      Tooltip.html(tooltipContent)
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 30 + "px");
    };
    

    const mouseleave = (event, d) => {
      Tooltip.style("opacity", 0);
    };

    // Initialize the circles
    const node = bubble_svg
      .append("g")
      .attr("transform", "translate(-100, 0)")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", "node")
      .attr("r", (d) => size(d.FactValueNumeric))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", (d) => color(quantizeScale(d.tfp) || 0))
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Define forces
    const simulation = d3
      .forceSimulation()
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      )
      .force("charge", d3.forceManyBody().strength(0.1))
      .force(
        "collide",
        d3.forceCollide().radius((d) => size(d.FactValueNumeric) + 1)
      )
      .on("tick", ticked);

    // Define ticked function
    function ticked() {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    // Define drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Feed the data to the simulation
    simulation.nodes(data);

    // Add a legend for the color scale
    const legend = bubble_svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${450}, ${310})`);

    legend
      .append("text")
      .attr("class", "legend-title")
      .attr("x", 0)
      .attr("y", -10)
      .attr("text-anchor", "start")
      .style("font-size", "14px")
      .text("Total Fector Productivity Bins");

    const legendItems = legend
      .selectAll(".legend-item")
      .data(color.range())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => d);

    legendItems
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d, i) => {
        const [minVal, maxVal] = quantizeScale.invertExtent(i);
        return `Bin ${i + 1}: ${minVal.toFixed(2)} - ${maxVal.toFixed(2)}`;
      });
  })
  .catch((error) => {
    console.error("Error loading CSV data:", error);
  });
