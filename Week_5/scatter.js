/*
Rutger Storm
12444049
Dataprocessing, Week 5
Scatterplot
*/

var scatter;

// Storing datasets in variables
window.onload = function() {
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = 'http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015'

  var request = [d3.json(womenInScience), d3.json(consConf)];

  // Transform datasets through transform functions
  Promise.all(request).then(function(response){
    var data1 = transformResponse(response[0]);
    var data2 = transformResponse(response[1]);

    // Dictionary for country color
    dataDict = {}
    countryColor = {"France":"0, 0, 255", "Germany":"255, 204, 0",
    "Netherlands":"255, 102, 0", "Portugal":"204, 0, 0",
    "United Kingdom":"0, 102, 0", "Korea":"204, 0, 204"}

// Creating a dictionary with year as key, datapoints and countries as value
function creatingData(){
    for (var i = 0; i < data1.length; i++){
      for (var j = 0; j < data2.length; j++){
        if(data1[i].Country == data2[j].Country && data1[i].time == data2[j].time){
          if(dataDict[data1[i].time] == undefined){
            dataDict[data1[i].time] = []
          }
        dataDict[data1[i].time].push([data1[i].Country, data1[i].datapoint, data2[j].datapoint])
        }
      }
    }
  }
creatingData ()

// Variables for the svg
var w = 750;
var h = 400;
var barPadding = 2;
var margin = 50

var svg = d3.select("body")
            .append("svg")
            .attr("width", w + 5)
            .attr("height", h + 5);

// Adjusting the xScale
var xScale = d3.scaleLinear()
           .domain([0, data1.length])
           .range([margin, (w - (4* margin))]);

// Adjusting the yScale
var yScale = d3.scaleLinear()
       .domain([0, (margin * 3)])
       .range([h - margin, 0]);

// Creating the legend by loopig through the countrycolor dictionary
function createLegend() {
  legend = svg.selectAll(".legend")
         .data(Object.keys(countryColor))
         .enter()
         .append("g")
         .attr("class" , "legend")
         .attr("transform", function(d, i) {
           return "translate(0," + i * 20 + ")";
         })

    legend.append('rect')
      .attr("x", 430)
      .attr("y", 220)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function(d){
        return "rgb(" + countryColor[d] + ")"
      });

    legend.append("text")
      .attr("x", 450)
      .attr("y", 230)
      .text(function(d){
        return d;
      })
}
createLegend()

// Creating the axis
function createAxis(){
  // Create the y axis
  var yAxis = svg.append('g')
      .attr("class", "y axis")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(yScale));

  // Create the x axis
  var xAxis = svg.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - margin) + ")")
      .call(d3.axisBottom(xScale));
}
createAxis()

// Scatter plot the data in circles
scatter = function(year){
  svg.selectAll('circle').remove().exit()
  svg.selectAll("circle")
   .data(dataDict[year])
   .enter()
   .append("circle")
   .attr("cx", function(d) {
    return (xScale(d[1]));
  })
.attr("cy", function(d) {
  // console.log(typeof(d[2]));
     return (yScale(d[2]));
  })
.attr("r", 10)
.attr("fill", function(d){
  return "rgb(" + countryColor[(d[0])] + ")"
})
}
scatter(2015)

// Units on both axis plus a title
function axisUnits(){

svg.append("text")
    .attr("transform", "translate(600, 15)")
    .style("text-anchor", "end")
    .style("font-size", "17px")
    .text("Percentage Women in Science against Consumer Confidence Index by Country");

svg.append("text")
    .attr("transform", "translate(500, 390)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .text("Percentage Women in Science ");

svg.append("text")
          .attr("x",-260)
          .attr("y", 15)
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "end")
          .style("font-size", "12px")
          .text("Consumer Confidence Index");
}
axisUnits()


  }).catch(function(e){
    throw(e);
  });
};

// Making the dropdown button work
function test(x){
  scatter(x)
}

// Function for transforming the data
function transformResponse(data){

// access data property of the response
let dataHere = data.dataSets[0].series;

// access variables in the response and save length for later
let series = data.structure.dimensions.series;
let seriesLength = series.length;

// set up array of variables and array of lengths
let varArray = [];
let lenArray = [];

series.forEach(function(serie){
  varArray.push(serie);
  lenArray.push(serie.values.length);
});

// get the time periods in the dataset
let observation = data.structure.dimensions.observation[0];

// add time periods to the variables, but since it's not included in the
// 0:0:0 format it's not included in the array of lengths
varArray.push(observation);

// create array with all possible combinations of the 0:0:0 format
let strings = Object.keys(dataHere);

// set up output array, an array of objects, each containing a single datapoint
// and the descriptors for that datapoint
let dataArray = [];

// for each string that we created
strings.forEach(function(string){
  // for each observation and its index
  observation.values.forEach(function(obs, index){
      let data = dataHere[string].observations[index];
      if (data != undefined){

          // set up temporary object
          let tempObj = {};

          let tempString = string.split(":");
          tempString.forEach(function(s, indexi){
              tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
          });

          // every datapoint has a time and ofcourse a datapoint
          tempObj["time"] = obs.name;
          tempObj["datapoint"] = data[0];

          dataArray.push(tempObj);
      }
  });
});
// return the finished product!
return dataArray;
}
