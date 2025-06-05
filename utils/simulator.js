function simulateFetch(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Processed id: ${id}`);
      resolve({ id, data: "processed" });
    }, 1000);
  });
}

module.exports = { simulateFetch };
