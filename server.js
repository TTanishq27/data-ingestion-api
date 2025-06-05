// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const store = require("./utils/store");
const PriorityQueue = require("./utils/priorityQueue");
const simulator = require("./utils/simulator");

const app = express();
app.use(bodyParser.json());

const queue = new PriorityQueue();

// POST /ingest
app.post("/ingest", (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || !priority || !["HIGH", "MEDIUM", "LOW"].includes(priority)) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const ingestion_id = uuidv4();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch_id = uuidv4();
    const batch = {
      batch_id,
      ids: batch_ids,
      status: "yet_to_start",
      created_at: Date.now(),
      ingestion_id,
    };

    batches.push(batch);
    queue.enqueue(batch, priority);
  }

  store.ingestions[ingestion_id] = {
    ingestion_id,
    status: "yet_to_start",
    batches,
  };

  res.json({ ingestion_id });
});

// GET /status/:ingestion_id
app.get("/status/:ingestion_id", (req, res) => {
  const { ingestion_id } = req.params;
  const data = store.ingestions[ingestion_id];

  if (!data) {
    return res.status(404).json({ error: "Ingestion ID not found" });
  }

  const statuses = data.batches.map((b) => b.status);
  let overall_status = "yet_to_start";

  if (statuses.every((s) => s === "completed")) {
    overall_status = "completed";
  } else if (statuses.some((s) => s === "triggered" || s === "completed")) {
    overall_status = "triggered";
  }

  res.json({
    ingestion_id,
    status: overall_status,
    batches: data.batches.map(({ batch_id, ids, status }) => ({
      batch_id,
      ids,
      status,
    })),
  });
});

// Async batch processor
const intervalId = setInterval(async () => {
  const batch = queue.dequeue();
  if (batch) {
    const ingestion = store.ingestions[batch.ingestion_id];
    const batchRef = ingestion.batches.find((b) => b.batch_id === batch.batch_id);

    batchRef.status = "triggered";
    await Promise.all(batch.ids.map(simulator.simulateFetch));
    batchRef.status = "completed";
  }
}, 5000);

module.exports = { app, intervalId };
