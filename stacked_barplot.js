const margin3 = { top: 60, right: 30, bottom: 20, left: 50 },
  width3 = 460 - margin3.left - margin3.right,
  height3 = 400 - margin3.top - margin3.bottom;

const bar_svg = d3
  .select("#stacked_bar_chart")
  .append("svg")
  .attr("width", 700)
  .attr("height", 500)
  .append("g")
  .attr("transform", `translate(${margin3.left},${margin3.top})`);

 // Create tooltip div
const tooltip = d3
.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0)
.style("position", "absolute")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
.style("pointer-events", "none");

const dropdown = d3.select("#country-dropdown");
const uniqueEntities = new Set();

const subgroups = [
  "ag_land_index",
  "labor_index",
  "capital_index",
  "materials_index",
];

const x = d3.scaleBand().range([0, width3]).padding([0.2]);

const y = d3.scaleLinear().range([height3, 0]);
//bar_svg.append("g").call(d3.axisLeft(y));

const yAxisGroup = bar_svg.append("g");
const barsGroup = bar_svg.append("g");

yAxisGroup.call(d3.axisLeft(y));


//get data from csv file
d3.csv("stacked_group_agri.csv").then(function (data) {
  data.forEach((d) => uniqueEntities.add(d.Entity));
  populateDropdown(Array.from(uniqueEntities));

  const groups = Array.from(new Set(data.map((d) => d.Year)));
  x.domain(groups);
  bar_svg  
    .append("g")
    .attr("transform", `translate(0, ${height3})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  const selectedCountry = dropdown.property("value");
  updateChart(selectedCountry);
});
//color scheme for bar data
const color = d3.scaleOrdinal().domain(subgroups).range(d3.schemeSet2);

function updateChart(selectedCountry) {
  d3.csv("stacked_group_agri.csv").then(function (data) {
    data = data.filter((d) => d.Entity === selectedCountry);

    y.domain([
      0,
      d3.max(data, (d) =>
        subgroups.reduce((acc, key) => acc + (+d[key] || 0), 0)
      ),
    ]).nice();
    yAxisGroup.call(d3.axisLeft(y));

    const stackedData = d3
      .stack()
      .keys(subgroups)
      .value((d, key) => +d[key] || 0)(data);

      const bars = barsGroup.selectAll("g").data(stackedData);

      //initialize bar 
      bars
      .join("g")
      .attr("fill", (d) => color(d.key))
      .attr("class", (d) => "myRect " + d.key)
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.Year))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("stroke", "grey")
      .on("mouseover", function (event, d) {
        // Show the tooltip with data
        tooltip
          .style("opacity", 1)
          .html(
            `Year: ${d.data.Year}<br>
            ${d.data.Entity}<br>
            ${d3.select(this.parentNode).datum().key}: ${(
              d[1] - d[0]
            ).toFixed(2)}`
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      
        // What subgroup are we hovering?
        const subGroupName = d3.select(this.parentNode).datum().key;
      
        // Reduce opacity of all rect to 0.2
        d3.selectAll(".myRect").style("opacity", 0.2);
      
        // Highlight all rects of this subgroup with opacity 1.
        d3.selectAll("."+subGroupName).style("opacity",1);
      })
      .on("mouseleave", function (event, d) {
        // Hide the tooltip
        tooltip.style("opacity", 0);
      
        // Reset the opacity of all rects
        d3.selectAll(".myRect").style("opacity", 1);
      });      
    bar_svg
      .select("#chart-title")
      .text(`Indices of Agricultural Production Factors in ${selectedCountry}`);
  });
}


dropdown.on("change", function () {
  const selectedCountry = d3.select(this).property("value");
  updateChart(selectedCountry);
});
//select country name from drop down list

function populateDropdown(entities) {
  const dropdown = d3.select("#country-dropdown");

  dropdown
    .selectAll("option")
    .data(entities)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);

  // Set the initial selected option
  dropdown.property("value", entities[0]);
}
// add chart title
function addTitle() {
  bar_svg
    .append("text")
    .attr("x", width3 / 2)
    .attr("y", -margin3.top / 2)
    .attr("text-anchor", "middle")
    .attr("id", "chart-title")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(
      `Indices of Agricultural Production Factors in ${Array.from(uniqueEntities)[0]}`
    );

    // Add axis labels
    bar_svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -50)
  .attr("y", 20)
  .attr("dy", "-3.5em")
  .attr("text-anchor", "end")
  .text("Total Agricultural inputs");
  // add yaxis labels
  bar_svg.append("text")
  .attr("x", 180)
  .attr("y", 370)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "middle")
  .text("Year");

    // Add legend
const legend = bar_svg.append("g")
.attr("class", "legend")
.attr("transform", `translate(${width3 + 20},0)`);

legend.selectAll("rect")
.data(subgroups)
.enter()
.append("rect")
.attr("x", 0)
.attr("y", (d, i) => i * 20)
.attr("width", 15)
.attr("height", 15)
.attr("fill", (d) => color(d));

legend.selectAll(".legend-text")
.data(["Agricultural land Quantity", "Labor input Index", "Capital input Index", "Materials input Index"])
.enter()
.append("text")
.attr("x", 20)
.attr("y", (d, i) => i * 20 + 12)
.text((d) => d);

}

addTitle();