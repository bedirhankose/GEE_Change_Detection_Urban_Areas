# Barbados GIS Project – README

This project investigates the feasibility of deploying **autonomous mobile EV charging infrastructure** in **Barbados**, powered by **Airborne Wind Energy Systems (AWES)**. Barbados was chosen due to its high renewable energy potential, small geographic footprint, and unique mobility challenges. 

The analysis integrates over **30 GeoPackage (`.gpkg`) layers**, grouped into thematic categories for clarity.

Each layer includes:
- What it represents
- The data source
- Licensing information (where applicable)

---

## 🏗️ Infrastructure & Points of Interest

| Layer Name | Description | Source | License |
|------------|-------------|--------|---------|
| `Barbados_Road_Lines_Reprojected.gpkg` | Road network across Barbados, used for buffer exclusions and mobility analysis | OpenStreetMap |   ODbL – Open Database License |
| `Barbados_Amenity_PointsWebMap.gpkg` | Amenities and POIs like shops, supermarkets for public charging demand modeling | OpenStreetMap |   ODbL |
| `NearbyChargingStations.gpkg` | Locations of EV charging stations | [PlugShare](https://www.plugshare.com/) |   Third-party / Attribution only |
| `LandNearbyChargingStations.gpkg` | Charging station proximity overlay for land areas | Derived |   Internal |
| `Barbados_Ports_WebMap.gpkg` | Location and type of sea ports (cargo, tourism) | OpenStreetMap |   ODbL |
| `BusDepotsBarbadosWebMap.gpkg` | Public transport depot locations | OpenStreetMap |   ODbL |

> 📌 **Note:** Charging station data was manually collected from the PlugShare platform (https://www.plugshare.com/) for research/demo purposes only.

---

## 🔌 Demand Modeling (Population & POI Based)

| Layer Name | Description | Source | License |
|------------|-------------|--------|---------|
| `PopulationPerBuildingInTotal.gpkg` | Estimated population per building | OpenStreetMap + statistical downscaling | ODbL |
| `LandPotentialForPrivateChargingBasedOnPopulation.gpkg` | Areas with high private charging demand based on residential data | Derived from above | Internal |
| `LandPotentialForPublicChargingBasedOnPOI.gpkg` | Demand zones near public POIs | Derived from POI layer | Internal |
| `WeightedScoreForPOIs.gpkg` | Weighted POI scoring model for public demand | Custom analysis | Internal |
| `WeightedScoreForPOIsOcean.gpkg` | POI scores in coastal/marine zones | Custom analysis | Internal |
| `hexagons_with_poi_list_wo_airport_turbines_cumulated_1703.gpkg` | Combined hex-based demand map | Aggregated from multiple layers | Internal |

---

## 🏞️ Environmental & Geospatial Constraints

| Layer Name | Description | Source | License |
|------------|-------------|--------|---------|
| `Barbados_Landcovers_latest.gpkg` | Land cover classification (urban, forest, etc.) | Esri Land Cover Explorer | Esri terms (restricted use) |
| `LandSlopes.gpkg` / `Slope.gpkg` | Terrain slope data to exclude steep areas | SRTM v3 via OpenTopography | Public Domain – NASA/USGS |
| `LandRoughness.gpkg` / `Roughness.gpkg` | Surface roughness values for wind modeling | SRTM v3 via OpenTopography | Public Domain – NASA/USGS |
| `LandAirportProximity.gpkg` / `AirportApproximitiy.gpkg` | Buffer zones around airports (1.5 km) | Derived from OSM | ODbL |
| `WindSpeed.gpkg` / `LandWindSpeed200m.gpkg` | Wind speed raster layer at 200m height | Global Wind Atlas | Open (with attribution) |
| `OceanWindSpeeds.gpkg` | Offshore wind speeds | Global Wind Atlas | Open (with attribution) |
| `Ocean_Elevations.gpkg` | Bathymetry data (ocean floor depth) | GEBCO / NOAA | Public Domain |

---

## 🧩 Analysis Grids (Hexagons)

| Layer Name | Description | Source | License |
|------------|-------------|--------|---------|
| `LatestLandHexagons2603.gpkg` | Land hex grid used for analysis zones | Generated in QGIS | Custom |
| `LatestOceanHexagonsTurbinesCumulative1803.gpkg` | Offshore hex grid used for ocean siting | Generated in QGIS | Custom |

---

## 🪁 Kite Site Suitability & Installation Modeling

| Layer Name | Description | Source | License |
|------------|-------------|--------|---------|
| `PossibleKiteSitesForEK100_10.gpkg` | Raw siting options for Enerkite 100-10 | Simulation-based | Project-generated |
| `PossibleKiteSitesForEK100_8.gpkg` | Raw siting options for Enerkite 100-8 | Simulation-based | Project-generated |
| `PossibleKiteSitesForEK500_8.gpkg` | Raw siting options for Enerkite 500-8 | Simulation-based | Project-generated |
| `SuggestedKiteSitesForEK100_10.gpkg` | Final filtered install zones for EK100-10 | Derived | Internal |
| `SuggestedKiteSitesForEK100_8.gpkg` | Final filtered install zones for EK100-8 | Derived | Internal |
| `SuggestedKiteSitesForEK500_8.gpkg` | Final filtered install zones for EK500-8 | Derived | Internal |
| `OceanPossibleKiteSitesForEK100_10.gpkg` | Offshore options for EK100-10 | Simulation | Internal |
| `OceanPossibleKiteSitesForEK100_8.gpkg` | Offshore options for EK100-8 | Simulation | Internal |
| `OceanPossibleKiteSitesForEK500_8.gpkg` | Offshore options for EK500-8 | Simulation | Internal |

---

## ⚙️ Usage

The datasets and analyses in this project were developed and visualized using the following tools:

- **QGIS 3.34**: For all spatial analysis, styling, and `.gpkg` manipulation  
- **Python 3.12.4** with libraries such as:
  - `geopandas`, `shapely`, `rasterio`: for geospatial data handling and raster calculations  
  - `matplotlib`, `contextily`: for plotting  
  - `scikit-learn`: for basic clustering or demand scoring  
- **QGIS2Web** plugin: For exporting interactive web maps

> All layers are organized under the `Geo-Data/` folder and are ready to use directly in GIS tools or Python workflows.

---

## 📂 Directory Structure

```bash
Geo-Data/
├── *.gpkg                # 34 GeoPackage files
├── WebMap/               # Web visualization files (QGIS2Web export)
└── README.md             # This file
