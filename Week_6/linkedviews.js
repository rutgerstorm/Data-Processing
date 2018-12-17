/*
Rutger Storm
12444049
Dataprocessing, Week 6
Linkedviews
*/

var totalPercentage = []
var countries = []
var menPercentage = []
var womenPercentage = []
var pieDict = {}
var genderColor =  {"Men":"0, 0, 255", "Women":"255, 204, 0"}

// Loading in the data trough a json file, making lists for the data
function creatingData(){

d3.json("data_unemployment.json").then(function(data)
{

  // Selecting the values of the countries, push it into lists
  keys = Object.keys(data);
  values = Object.values(data)
  keys.forEach(function(d){
  countries.push(d)
    })
  values.forEach(function(d){
  totalPercentage.push(d.Total)
  menPercentage.push(d.Men)
  womenPercentage.push(d.Women)
  })
  makeBar()
  makePiechart(totalPercentage, menPercentage[0], womenPercentage[0])
  })
}
creatingData()

function makeBar(){
  //Width and height from the SVG
  var w = 800;
  var h = 450;
  var barPadding = 2;
  var margin = 50

  var svg = d3.select("body")
    .append("svg")
    .attr("width", w + 5)
    .attr("height", h + 5);

  // Adjusting the xScale
  var xScale = d3.scaleBand()
    .domain(countries)
    .range([0, 750]);

  // Adjusting the yScale
  var yScale = d3.scaleLinear()
         .domain([0, 30])
         .range([h - margin, 0]);

// Added a tooltip which shows the exact value for every country
var tooltip = d3.select('body').append("div")
   .style("display", "true")
   .style("fill", "orange")
   .style("font-size", "11px")
   .style("font-family", "sans-serif")
   .text("Unemployment Rate");



  // Create the barchart
  svg.selectAll("rect")
      .data(totalPercentage)
      .enter()
      .append("rect")
      .attr("y", function(d) {
        return yScale(d) + (0.5 * margin);
      })
      .attr("width", (w - margin) / (totalPercentage.length + 1))
      .attr("height", function(d) {
        return h - (margin) - yScale(d);
       })
      .attr("x", function(d, i) {
        return xScale(countries[i]) + margin;
         })
      .attr("fill", function(d) {
       return "rgb(0, 0, " + (d * 15) + ")"
     })
     .on("mouseover", function(d){
       tooltip.html(d)
         .style('left', (d3.eventPageX) + 'px')
         .style('top', (d3.eventPageY) + 'px')
         .text(d);
       d3.select(this).style('fill', 'rgb(204, 51, 0)')
     })
     .on("mouseout", function(d)
     {
       tooltip.transition()
       d3.select(this).style('fill', "rgb(0, 0, " + (d * 15) + ")")

     })
     .on("click", function(d, i){
       update(d, menPercentage[i], womenPercentage[i]);
     })



   // Creating the axis
   function createAxis(){
     // Create the y axis
     var yAxis = svg.append('g')
         .attr("class", "y axis")
         .style("font-family", "sans-serif")
         .style("font-size", "8px")
         .attr("transform", "translate(50,25)")
         .call(d3.axisLeft(yScale));

     // Create the x axis
     var xAxis = svg.append('g')
         .attr("class", "x axis")
         .style("font-family", "sans-serif")
         .style("font-size", "6px")
         .attr("transform", "translate(50,425)")
         .call(d3.axisBottom(xScale));

    // Adding the title
    svg.append("text")
        .attr("transform", "translate(400, 25)")
        .style("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "17px")
        .text("Percentage Unemployment per Country");

    // Adding units for x-axis
    svg.append("text")
        .attr("transform", "translate(750, 455)")
        .style("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .text("Countries");

    // Adding units for y-axis
    svg.append("text")
              .attr("x",-360)
              .attr("y", 15)
              .attr("transform", "rotate(-90)")
              .style("text-anchor", "end")
              .style("font-family", "sans-serif")
              .style("font-size", "10px")
              .text("Percentage %");
   }
   createAxis()
}

// Creating the piechart
function makePiechart(data, male, female) {
  var w = 800;
  var h = 450;
  var barPadding = 2;
  var margin = 50

  // Svg element for the piechart
  var svg = d3.select("body")
    .append("svg")
    .attr("class", "pie")
    .attr("width", w)
    .attr("height", h);

// Data for the piechart
var pieData = [{gender: "Men", number:male}, {gender: "Women", number:female}]

var data = d3.pie().value(function(d){return d.number;})(pieData);


var segments = d3.arc()
                  .innerRadius(50)
                  .outerRadius(200)
                  .padAngle(0.01)
                  .padRadius(150);

var sections = svg.append("g")
                .attr("transform", "translate(300, 250)")
                .selectAll("path").data(data)

// Return pink for women, return blue for men
sections.enter().append("path").attr("d", segments).attr("fill", function(d){
  if (d.data.gender == "Women"){
    return "rgb(255, 153, 255)";
  }
    return "rgb(0, 153, 255)";
});

// Title added for the piechart
svg.append("text")
    .attr("transform", "translate(510, 15)")
    .style("text-anchor", "end")
    .style("font-size", "17px")
    .style("font-family", "sans-serif")
    .text("Percentage Men and Women with unemployment");

}

// Updating the piechart data when clicked on country
function update(pieData, male, female) {
  var pieData = [{gender: "Men", number:male}, {gender: "Women", number:female}]
  var data = d3.pie().sort(null).value(function(d){return d.number;})(pieData);

// Adjusting the circle in the piechart
var segments = d3.arc()
                    .innerRadius(50)
                    .outerRadius(200)
                    .padAngle(0.01)
                    .padRadius(150);

// Animation for the updated piechart
const path = d3.select(".pie").selectAll("path")
                  .data(data)
                  .transition()
                  .duration(200)
                  .attr("d", segments)

}
