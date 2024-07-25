var batch = require('users/fitoprincipe/geetools:batch')
var region = ee.Geometry.Rectangle([14.137849039046037,45.752733527532655, 14.335602945296037,45.86903612278666]);

var dataset = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                .filterDate('2021-10-01', '2021-11-30')
                // .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 1)
                .filterBounds(bb) // custom rectangle drawn on map
                .select('B.*')

batch.Download.ImageCollection.toAsset(dataset, 'Sentinel', 
                {name: 'S2_HARMONIZED_{system:index}', scale: 10, 
                 region: region.getInfo()})
