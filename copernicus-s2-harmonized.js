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

var dataset = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                .filterDate('2021-09-01', '2021-09-30')
                .filterBounds(bb).select('B.*')

// Map.addLayer(dataset.median(), {bands: ['B2']});
batch.Download.ImageCollection.toAsset(dataset, 'Sentinel', 
                {name: 'S2_HARMONIZED_{system:index}', scale: 10, 
                 region: region.getInfo()})
