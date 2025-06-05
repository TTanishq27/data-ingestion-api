const request = require("supertest");
const { app, intervalId } = require("../server");

beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  clearInterval(intervalId);
  console.log.mockRestore();
});

describe("Data Ingestion API", () => {
  it("should return ingestion_id", async () => {
    const response = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3, 4, 5], priority: "HIGH" });

    expect(response.status).toBe(200);
    expect(response.body.ingestion_id).toBeDefined();
  });

  it("should return status for a valid ingestion_id", async () => {
    const postResponse = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3], priority: "HIGH" });

    const ingestion_id = postResponse.body.ingestion_id;

    const statusResponse = await request(app).get(`/status/${ingestion_id}`);

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.ingestion_id).toBe(ingestion_id);
    expect(Array.isArray(statusResponse.body.batches)).toBe(true);
  });

  it("should return 404 for unknown ingestion_id", async () => {
    const statusResponse = await request(app).get("/status/unknown-id");
    expect(statusResponse.status).toBe(404);
  });
});
