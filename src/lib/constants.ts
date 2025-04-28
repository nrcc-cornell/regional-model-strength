export const regions = [
  {
    name: "Southeast and Caribbean",
    dataKey: "southeast",
    bounds: [[25.06,-94.68],[39.46,-75.62]],
    center: [685, 425],
    color: '#d9c6a5'
  },
  {
    name: "Southwest",
    dataKey: "southwest",
    bounds: [[31.31,-124.43],[42.02,-102.0]],
    center: [200, 325],
    color: '#a25b68'
  },
  {
    name: "Midwest",
    dataKey: "midwest",
    bounds: [[35.96,-97.25],[49.40,-80.49]],
    center: [625, 265],
    color: '#bcce8f'
  },
  {
    name: "North Plains",
    dataKey: "north_plains",
    bounds: [[39.91,-116.09],[49.02,-95.28]],
    center: [375, 175],
    color: '#ba9682'
  },
  {
    name: "South Plains",
    dataKey: "south_plains",
    bounds: [[25.81,-106.51],[40.02,-93.45]],
    center: [445, 425],
    color: '#c68a5b'
  },
  {
    name: "Northeast",
    dataKey: "northeast",
    bounds: [[37.17,-82.69],[47.52,-66.82]],
    center: [845, 187],
    color: '#6ab2ad'
  },
  {
    name: "Northwest",
    dataKey: "northwest",
    bounds: [[41.97,-124.177],[49.03,-111.0]],
    center: [125, 125],
    color: '#4e8182'
  },
] as const;

export const seasons = [
  { name: "Annual", dataKey: "annual" },
  { name: "Winter", dataKey: "winter" },
  { name: "Spring", dataKey: "spring" },
  { name: "Summer", dataKey: "summer" },
  { name: "Fall", dataKey: "fall" },
] as const;

export const products = [
  { name: "LOCA", dataKey: "loca" },
  { name: "STAR", dataKey: "star" }
] as const;

export const models = {
  "loca": [
    { name: "Ensemble", dataKey: "ens" },
    { name: "ACCESS1-0", dataKey: "ACCESS1-0" },
    { name: "ACCESS1-3", dataKey: "ACCESS1-3" },
    { name: "bcc-csm1-1", dataKey: "bcc-csm1-1" },
    { name: "bcc-csm1-1-m", dataKey: "bcc-csm1-1-m" },
    { name: "CanESM2", dataKey: "CanESM2" },
    { name: "CCSM4", dataKey: "CCSM4" },
    { name: "CESM1-BGC", dataKey: "CESM1-BGC" },
    { name: "CESM1-CAM5", dataKey: "CESM1-CAM5" },
    { name: "CMCC-CM", dataKey: "CMCC-CM" },
    { name: "CMCC-CMS", dataKey: "CMCC-CMS" },
    { name: "CNRM-CM5", dataKey: "CNRM-CM5" },
    { name: "CSIRO-Mk3-6-0", dataKey: "CSIRO-Mk3-6-0" },
    { name: "EC EARTH", dataKey: "EC EARTH" },
    { name: "FGOALS-g2", dataKey: "FGOALS-g2" },
    { name: "GFDL-CM3", dataKey: "GFDL-CM3" },
    { name: "GFDL-ESM2G", dataKey: "GFDL-ESM2G" },
    { name: "GFDL-ESM2M", dataKey: "GFDL-ESM2M" },
    { name: "GISS-E2-H-p1", dataKey: "GISS-E2-H-p1" },
    { name: "GISS-E2-R-p1", dataKey: "GISS-E2-R-p1" },
    { name: "HadGEM2-AO", dataKey: "HadGEM2-AO" },
    { name: "HadGEM2-CC", dataKey: "HadGEM2-CC" },
    { name: "HadGEM2-ES", dataKey: "HadGEM2-ES" },
    { name: "inmcm4", dataKey: "inmcm4" },
    { name: "IPSL-CM5A-LR", dataKey: "IPSL-CM5A-LR" },
    { name: "IPSL-CM5A-MR", dataKey: "IPSL-CM5A-MR" },
    { name: "MIROC5", dataKey: "MIROC5" },
    { name: "MIROC-ESM-CHEM", dataKey: "MIROC-ESM-CHEM" },
    { name: "MIROC-ESM", dataKey: "MIROC-ESM" },
    { name: "MPI-ESM-LR", dataKey: "MPI-ESM-LR" },
    { name: "MPI-ESM-MR", dataKey: "MPI-ESM-MR" },
    { name: "MRI-CGCM3", dataKey: "MRI-CGCM3" },
    { name: "NorESM1-M", dataKey: "NorESM1-M" },
  ],
  "star": [
    { name: "Ensemble", dataKey: "ens" },
    { name: "Fake Model 1", dataKey: "Fake Model 1" },
    { name: "Fake Model 2", dataKey: "Fake Model 2" },
    { name: "Fake Model 3", dataKey: "Fake Model 3" },
  ]
} as const;

export const dataTypes = [
  { name: "Temperature", dataKey: "temperature" },
  { name: "Precipitation", dataKey: "precipitation" },
] as const;

export const rows = {
  "temperature": [
    { name: "Mean Temperature", dataKey: "mean_temp" },
    { name: "Daily Temp Runs", dataKey: "daily_temp_runs" },
  ],
  "precipitation": [
    { name: "Total Precipitation", dataKey: "prcptot" },
    { name: "Maximum Annual Max Precipitation", dataKey: "max_ann_max_prcp" },
  ]
} as const;
export const cols = [
  { name: "GCM Signal Correspondence", dataKey: "gcm" },
  { name: "Historical Bias", dataKey: "historical_mean" },
  { name: "Spatial Discontinuity", dataKey: "spat_disc" },
] as const;

export const tableThresholds = {
  low: 3.333,
  high: 6.667
};