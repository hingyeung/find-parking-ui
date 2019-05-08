import {Coordinate} from '../types';

function getCurrentPosition(): Promise<Coordinate> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            // latitude: position.coords.latitude,
            // longitude: position.coords.longitude
            latitude: -37.813084,
            longitude: 144.963336
          });
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          reject(err);
        },
        { enableHighAccuracy: true }
      )
    } else {
      reject('Current position not available');
    }
  })
}

export {
  getCurrentPosition
};
