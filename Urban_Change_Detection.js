//  Define the Barbados region (bounding box)
var region = ee.Geometry.Rectangle([-59.9, 13.0, -59.4, 13.5]);

// Center the map on Barbados
Map.centerObject(region, 10);

//  Function to select only relevant bands and ensure consistency
function selectBands(image) {
  return image.select(['B11', 'B8']); // Keep only SWIR (B11) and NIR (B8)
}

//  Load Sentinel-2 TOA for 2015
var sentinel2015 = ee.ImageCollection("COPERNICUS/S2")
  .filterBounds(region)
  .filterDate('2015-06-01', '2015-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .map(selectBands)
  .median()
  .clip(region);

//  Load Sentinel-2 SR for 2024
var sentinel2024 = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(region)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .map(selectBands)
  .median()
  .clip(region);

//  Compute NDBI (Normalized Difference Built-Up Index)
function computeNDBI(image) {
    return image.normalizedDifference(['B11', 'B8']).rename('NDBI'); // SWIR: B11, NIR: B8
}

// Compute NDBI for Sentinel-2 (2015)
var ndbi2015 = computeNDBI(sentinel2015);

// Compute NDBI for Sentinel-2 (2024)
var ndbi2024 = computeNDBI(sentinel2024);

//  Compute NDBI change between 2015 and 2024
var ndbiChange = ndbi2024.subtract(ndbi2015).rename('NDBI_Change');

//  Define thresholds for built-up change detection
var gainThreshold = 0.2;   // Threshold for urban expansion
var lossThreshold = -0.2;  // Threshold for urban reduction

// Define built-up gain and loss layers
var builtUpGain = ndbiChange.gt(gainThreshold).selfMask();  // New built-up areas
var builtUpLoss = ndbiChange.lt(lossThreshold).selfMask();  // Lost built-up areas

//  Reduce raster resolution before vectorization (improves performance)
var builtUpGainReduced = builtUpGain.focal_max(1).reproject({crs: 'EPSG:4326', scale: 50});
var builtUpLossReduced = builtUpLoss.focal_max(1).reproject({crs: 'EPSG:4326', scale: 50});

//  Convert Raster to Vector (Polygons) and filter out small areas
var gainVector = builtUpGainReduced.reduceToVectors({
  geometryType: 'polygon',
  reducer: ee.Reducer.countEvery(),
  scale: 50,  // Use 50m scale to reduce processing time
  geometry: region,
  maxPixels: 1e13
}).filter(ee.Filter.gte('count', 15))  // Remove very small polygons
  .map(function(feature) { return feature.simplify(50); }) // Simplify polygons to reduce complexity
  .union();  // Merge adjacent polygons to reduce total count

var lossVector = builtUpLossReduced.reduceToVectors({
  geometryType: 'polygon',
  reducer: ee.Reducer.countEvery(),
  scale: 50,  // Use 50m scale
  geometry: region,
  maxPixels: 1e13
}).filter(ee.Filter.gte('count', 15))  // Remove very small polygons
  .map(function(feature) { return feature.simplify(50); }) // Simplify polygons to reduce complexity
  .union();  // Merge adjacent polygons to reduce total count

//  EXPORT VECTOR DATA TO GOOGLE DRIVE

//  Export Urban Expansion as a Shapefile (.SHP)
Export.table.toDrive({
  collection: gainVector,
  description: 'Urban_Expansion_Vector',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Urban_Expansion_2015_2024',
  fileFormat: 'SHP'
});

//  Export Urban Reduction as a Shapefile (.SHP)
Export.table.toDrive({
  collection: lossVector,
  description: 'Urban_Reduction_Vector',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Urban_Reduction_2015_2024',
  fileFormat: 'SHP'
});

//  Export Urban Expansion as GeoJSON
Export.table.toDrive({
  collection: gainVector,
  description: 'Urban_Expansion_GeoJSON',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Urban_Expansion_2015_2024',
  fileFormat: 'GeoJSON'
});

//  Export Urban Reduction as GeoJSON
Export.table.toDrive({
  collection: lossVector,
  description: 'Urban_Reduction_GeoJSON',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Urban_Reduction_2015_2024',
  fileFormat: 'GeoJSON'
});

//  DISPLAY RESULTS ON THE MAP
Map.addLayer(gainVector, {color: 'red'}, 'Urban Expansion (Vector)');
Map.addLayer(lossVector, {color: 'blue'}, 'Urban Reduction (Vector)');
Map.addLayer(ndbiChange, {min: -0.5, max: 0.5, palette: ['blue', 'white', 'red']}, 'NDBI Change (2015-2024)');
