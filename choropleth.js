const width5 = 600;
const height5 = 500;
var SelectedCountry;

const svg = d3
  .select("#choropleth-map")
  .append("svg")
  .attr("width", width5)
  .attr("height", height5);

const title = svg
  .append("text")
  .attr("class", "title")
  .attr("x", width5 / 2.5)
  .attr("y", 50)
  .attr("text-anchor", "middle")
  .text("Global Agricultural Land Quantity with Adolescent fertility rate");

const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width5 / 2, height5 / 2]);

const data = new Map(); 
const relatedData = new Map();
const zeroColor = "#d3d3d3";
const nonZeroColorScale = d3
  .scaleThreshold()
  .domain([100, 1000, 10000, 30000, 100000, 300000]) // Change 50000 to 300000
  .range(d3.schemeGreens[6]);
const colorScale = function (d) {
  return d === 0 ? zeroColor : nonZeroColorScale(d);
};

const circleRadiusScale = d3.scaleSqrt().domain([0, 100]).range([0, 3]);

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("Map_agriculture_FertilityRate.csv", function (d) {
    data.set(d.Code, +d.ag_land_quantity);
  
    let tfp = +d.tfp;
    let yr = +d.Year;
    let output = +d.output_quantity;
    let inputs = +d.inputs;
    let ag_land_quantity = +d.ag_land_quantity;
    let con = d.Entity;
    let fert = +d.FactValueNumeric;

    relatedData.set(d.Code, [
      tfp,
      yr,
      output,
      inputs,
      ag_land_quantity,
      con,
      fert,
    ]);
  }),
])
  .then(function (loadData) {
    let topo = loadData[0];
    //mouseover event for tooltip

    let mouseOver = function (event, d) {
      d3.select(this).transition().duration(200).style("stroke", "black");
      tooltip.transition().duration(20).style("opacity", 0.9);

      const formatDecimal = d3.format(".2f");
      let data_country = relatedData.get(this.__data__.id);
      if (data_country != undefined) {
        tooltip.transition().duration(1000).style("opacity", 0.9);
        tooltip.html(
          "<b>" +
            d.properties.name +
            "</b><br>" +
            "Year: " +
            data_country[1] +
            "<br>" +
            "Total Factor Productivity: " +
            formatDecimal(data_country[0]) +
            "<br>" +
            "Output Quantity: " +
            formatDecimal(data_country[2]) +
            "<br>" +
            "Agriculture Land Quantity: " +
            formatDecimal(data_country[4]) // Change index from 3 to 4
        );
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      }
    };
//mouse leave for remove tooltip
    let mouseLeave = function (event, d) {
      d3.select(this).style("stroke", "transparent");
      tooltip.transition().duration(500).style("opacity", 0);
      SelectedCountry = null;
    };
//mouseclick event for update charts
    let mouseClick = function (event, d) {
      let data_country = relatedData.get(this.__data__.id);
      if (data_country) {
        let location = data_country[5];
        updateConnectedScatterPlot(location);
        updateNegConnectedScatterPlot(location);
        displayCountryDataInTable(location, data_country);
      }
    };

//for dashbord data
    function displayCountryDataInTable(location, data_country) {
      // Clear the table body
      tableBody.innerHTML = '';
    
      // Find the country in the circular packing data
      const circularPackingCountryData = circularPackingData.find((d) => d.Country === location);
    
      // Extract Population and Corruption Perception Index from the data
      const population = circularPackingCountryData
        ? circularPackingCountryData.Population.toLocaleString()
        : 'No Data';
      const corruptionPerceptionIndex = circularPackingCountryData
        ? circularPackingCountryData['Corruption Perception Index']
        : 'No Data';
    
      // Create a table row for the clicked country
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${location}</td>
        <td>${data_country[0]}</td>
        <td>${data_country[2]}</td>
      `;
    
      tableBody.appendChild(tableRow);
    }

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .append("g")
      .attr("transform", "translate(-50,0)")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr("d", d3.geoPath().projection(projection))
      .attr("fill", function (d) {
        d.ag_land_quantity = data.get(d.id) || 0;
        return colorScale(d.ag_land_quantity);
      })
      .style("stroke", "transparent")
      .on("mouseover", mouseOver)
      .on("click", mouseClick)
      .on("mouseleave", mouseLeave);

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + 500 + "," + 355 + ")");

    // Agriculture Land Quantity Distribution legend title
    legend
      .append("text")
      .attr("class", "legend-title")
      .attr("x", -20)
      .attr("y", -20)
      .attr("text-anchor", "start")
      .text("Agricultural Land");

    // Add a new group for the circles in the SVG and apply the same translation as the main 'g' element
    const circleGroup = svg.append("g").attr("transform", "translate(-50,0)");

    // Function to adjust the circle radius based on the country area
    function adjustRadius(radius, countryArea) {
      const maxRadius = Math.sqrt(countryArea / Math.PI) * 0.5;
      return Math.min(radius, maxRadius);
    }

    // Mouseover event for circles
    let circleMouseOver = function (event, d) {
      let data_country = relatedData.get(d.id);
      const formatDecimal = d3.format(".2f");
      console.log(data_country);
      if (data_country != undefined) {
        tooltip.transition().duration(1000).style("opacity", 0.9);
        tooltip.html(
          "<b>" +
            d.properties.name +
            "</b><br>" +
            "Fertility Rate: " +
            formatDecimal(data_country[6]) // Display the fert value
        );
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      }
    };

    function getCircleRadius(countryArea, fertilityRate) {
      const maxRadius = Math.sqrt(countryArea / Math.PI) * 0.5;
      const circleRadius = circleRadiusScale(fertilityRate);
      return Math.min(circleRadius, maxRadius);
    }

    circleGroup
      .selectAll("circle")
      .data(topo.features)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection(d3.geoCentroid(d))[0];
      })
      .attr("cy", function (d) {
        return projection(d3.geoCentroid(d))[1];
      })
      .attr("r", function (d) {
        let data_country = relatedData.get(d.id);
        if (data_country) {
          const countryArea = path.area(d);
          const fertilityRate = data_country[6];
          return getCircleRadius(countryArea, fertilityRate);
        } else {
          return 0;
        }
      })
      .attr("fill", "rgba(255, 0, 0, 0.5)")
      .attr("stroke", "rgba(255, 0, 0, 0.8)")
      .attr("stroke-width", 1)
      .on("mouseover", circleMouseOver)
      .on("mouseleave", mouseLeave);

    const legendLabels = [
      "0",
      "100+",
      "1,000+",
      "10,000+",
      "30,000+",
      "100,000+",
      "300,000+",
    ];

    // Fertility Rate legend
    const fertLegend = svg
      .append("g")
      .attr("class", "fertLegend")
      .attr("transform", "translate(" + 550 + "," + 40 + ")");

    // Add circle for Fertility Rate
    fertLegend
      .append("circle")
      .attr("cx", -55)
      .attr("cy", 15)
      .attr("r", circleRadiusScale(100)) // Choose a representative radius for the Fertility Rate circle
      .attr("fill", "rgba(255, 0, 0, 0.5)") // You can customize the fill color and opacity
      .attr("stroke", "rgba(255, 0, 0, 0.8)") // You can customize the stroke color and opacity
      .attr("stroke-width", 1);

    // Add label for Fertility Rate
    fertLegend
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .text("Fertility Rate");

    const legendColors = [zeroColor].concat(nonZeroColorScale.range());

    legend
      .selectAll("rect")
      .data(legendColors)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 20;
      })
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function (d) {
        return d;
      });

    legend
      .selectAll("text")
      .data(legendLabels)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", function (d, i) {
        return i * 20 + 15;
      })
      .text(function (d) {
        return d;
      });
  })
  .catch(function (error) {
    console.log(error);
  });
