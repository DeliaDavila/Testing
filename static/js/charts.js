function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// B1. Create the buildCharts function.
function buildCharts(sample) {
  // B2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // B3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // B4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // G1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata; //need to var it again or can you just call it since it's var not let?
    var metaDataResultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //  B5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // G2. Create a variable that holds the first sample in the metadata array.
    var metaDataResult = metaDataResultArray[0];
    // console.log("meta data")
    // console.log(metaDataResult)
    // console.log(metaDataResult.wfreq)

    // G3. Create a variable for washing frequency as a floating point number
    var wfreq = metaDataResult.wfreq

    //B6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    //changing to JS case
    otuIds = result.otu_ids;
    otuLabels = result.otu_labels;
    sampleValues = result.sample_values;


    //ADJUSTED VALUES
    //Use slice(), map(), reverse() to retrieve the top 10 otu_ids and sort them in descending order.

    //1.IDs / y axis:
    var topTenIds = otuIds.slice(0, 10).map(x => `OTU ${x}`).reverse();
    // console.log(topTen_otu_ids);

    //hover text:
    var topTenLabels = otuLabels.slice(0,10).reverse();
    // console.log(topTen_otu_labels);

    var topTenSampleValues = sampleValues.slice(0,10).reverse();
    // console.log(Chart_sample_values);


    // 7. Create the yticks for the bar chart.
    var yticks = topTenIds;

    // 8. Create the trace for the bar chart. 

    var barTrace = {
      x: topTenSampleValues,
      y: topTenIds,
      yticks: yticks,
      type: "bar",
      orientation: 'h',
      hovertext: topTenLabels,
    };

    var barData = [barTrace];

    // console.log("bar data")
    // console.log(barData)

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top Ten Bacteria Cultures Found</b>',
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "palegreen"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});


    //bubble chart

    // 1. Create the trace for the bubble chart. Trying [{}] to skip step of trace then data=trace
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        // colorscale: otuIds, //can change this for fun
        colorscale: "YlGnBu",  

      },
    };

    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample</b>",
      xaxis: otuIds,
      hoverlabel: otuLabels,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "palegreen"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});



    //gauge chart plotting steps
    
  ///  4. Create the trace for the gauge chart.
    var gaugeTrace = {
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: {range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: {color: "darkblue" },
        steps: [
          {range: [0, 2], color: "darkolivegreen" },
          {range: [2, 4], color: "olivedrab" },
          {range: [4, 6], color: "yellowgreen" },
          {range: [6, 8], color: "greenyellow"},
          {range: [8, 10], color: "mediumspringgreen" },
        ],
      }
    };

    var gaugeData = [gaugeTrace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: "rgba(0,0,0,0)",
      // width: 100%,
      // height: 0,
      // padding-bottom: 50%, 
      // width: 600, 
      // height: 500, 
      //margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});


})};








