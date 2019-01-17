import {Coordinate} from '../types';

function getCurrentPosition(): Promise<Coordinate> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log(position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
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
