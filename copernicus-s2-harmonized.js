var batch = require('users/fitoprincipe/geetools:batch')
var region = ee.Geometry.Rectangle([14.137849039046037,45.752733527532655, 14.335602945296037,45.86903612278666]);


function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// for arcgis raster calculator 
// Float(("20210425_B8"*0.0001)-("20210425_B4"*0.0001)) / Float(("20210425_B8"*0.0001)+("20210425_B4"*0.0001)+ 0.428) * (1.428)
function addsa(input) {
  var sa = ee.Image().expression('((NIR-Red)/(NIR+Red+0.428))*1.428', {
    NIR: input.select('B8').multiply(0.0001),
    Red: input.select('B4').multiply(0.0001)
  }).rename('savi')
  return input.addBands(sa).toFloat()
}

function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

function addNDWI(image) {
  var ndvi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
  return image.addBands(ndvi);
};


var dataset = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                .filterDate('2021-10-01', '2021-11-30')
                // .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 1)
                .filterBounds(bb) // custom rectangle drawn on map
                .select('B.*')
                .map(addNDWI)
                .map(addNDVI)
                .map(addsa)

// Map.addLayer(dataset.median(), {bands: ['B2']});
batch.Download.ImageCollection.toAsset(dataset, 'Sentinel', 
                {name: 'S2_HARMONIZED_{system:index}', scale: 10, 
                 region: region.getInfo()})
