import createApp from "./app.js";

async function main() {
  try {
    const app = createApp();

    app.listen(8080, () => {
      console.log("API Gateway is running on port 8080");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

main();
