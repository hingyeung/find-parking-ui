// Set your mapbox token here
export const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
export const UNKNOWN_RESTRICTION_PARKING_ICON = 'unknown',
  LTE_15_PARKING_ICON = 'lte_15',
  BTW_16_AND_60_PARKING_ICON = 'btw_16_60',
  BTW_61_AND_120_PARKING_ICON = 'btw_61_120',
  GTE_121_PARKING_ICON = 'gte_121',
  CURRENT_LOCATION_ICON = 'current_loc';
export const PARKING_ICON_MAPPING = {
  [BTW_16_AND_60_PARKING_ICON]: {
    x: 0,
    y: 0,
    width: 24,
    height: 24,
    // whether icon is treated as a transparency mask.
    // If true, user defined color is applied.
    // If false, original color from the image is applied.
    mask: false
  },
  [BTW_61_AND_120_PARKING_ICON]: {
    x: 24,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [GTE_121_PARKING_ICON]: {
    x: 48,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [LTE_15_PARKING_ICON]: {
    x: 72,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [CURRENT_LOCATION_ICON]: {
    x: 96,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [UNKNOWN_RESTRICTION_PARKING_ICON]: {
    x: 120,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  }
};