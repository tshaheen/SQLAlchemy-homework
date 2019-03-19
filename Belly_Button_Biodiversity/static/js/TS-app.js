function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    d3.json(`/metadata/${sample}`).then((data) => {
      var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel

    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
   
    // @TODO: Build a Bubble Chart using the sample data
    var otuID = data.otu_ids;
    var labels = data.otu_labels;
    var sampleValues = data.sample_values;
    var bubbleData = [{
      x:otuID,
      y:sampleValues,
      text: labels,
      mode: "markers",
      marker:{
        size:sampleValues,
        color:otuID,
        colorscale:"Rainbowh"
      }
    }];
    var bubbleLayout = {
      margin:{t:0},
      hovermode:"closest",
      xaxis: {title: "OTU ID"}
    };

    Plotly.plot("bubble",bubbleData, bubbleLayout)

    // @TODO: Build a Pie Chart
  var pieData = [{
    values: sampleValues.slice(0,10),
    labels: otuID.slice(0,10),
    hovertext: labels.slice(0,10),
    hoverinfo: "hovertext", 
    type: "pie"
  }];
  var pieLayout = {
    margin:{t:0,l:0}
  }; 
  
  Plotly.plot("pie", pieData, pieLayout)
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
});
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
