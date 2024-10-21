export const regions = [
  { name: "Southeast and Caribbean", bounds: [[25.06,-94.68],[39.46,-75.62]] },
  { name: "Southwest", bounds: [[31.31,-124.43],[42.02,-102.0]] },
  { name: "Midwest", bounds: [[35.96,-97.25],[49.40,-80.49]] },
  { name: "Great Plains", bounds: [[25.80,-116.09],[49.03,-93.48]] },
  { name: "Northeast", bounds: [[37.17,-82.69],[47.52,-66.82]] },
  { name: "Northwest", bounds: [[41.97,-124.177],[49.03,-111.0]] },
] as const;
export const seasons = ["Winter", "Spring", "Summer", "Fall", "Annual"] as const;
export const products = {
  "LOCA": ["Weighted Mean", "ACCESS1-0", "ACCESS1-3", "bcc-csm1-1", "bcc-csm1-1-m", "CanESM2", "CCSM4", "CESM1-BGC", "CESM1-CAM5", "CMCC-CM", "CMCC-CMS", "CNRM-CM5", "CSIRO-Mk3-6-0", "EC EARTH", "FGOALS-g2", "GFDL-CM3", "GFDL-ESM2G", "GFDL-ESM2M", "GISS-E2-H-p1", "GISS-E2-R-p1", "HadGEM2-AO", "HadGEM2-CC", "HadGEM2-ES", "inmcm4", "IPSL-CM5A-LR", "IPSL-CM5A-MR", "MIROC5", "MIROC-ESM-CHEM", "MIROC-ESM", "MPI-ESM-LR", "MPI-ESM-MR", "MRI-CGCM3", "NorESM1-M"],
  "STAR": ["Weighted Mean", "Fake Model 1", "Fake Model 2", "Fake Model 3"]
} as const;
export const rowNames = ["Mean Temperature", "Total Precipitation", "Days > T Threshold", "Daily Temp Runs"] as const;
export const colNames = ["GCM Signal Correspondence", "Historical Bias", "Spatial Discontinuity"] as const;

export const tableThresholds = {
  low: 3.333,
  high: 6.667
};