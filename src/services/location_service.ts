function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log(position);
          resolve(position);
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
