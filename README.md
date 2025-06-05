<img width="551" alt="Test Screenshot" src="https://github.com/user-attachments/assets/d73275b3-54a4-4e1f-9612-b335d2d12346" />





## Run Locally
```bash
git clone https://github.com/TTanishq27/data-ingestion-api
cd data-ingestion-api
npm install
node index.js
```

## Test
```bash
npm install --save-dev jest supertest
npx jest
```

## Example
```bash
curl -X POST http://localhost:5000/ingest \
 -H "Content-Type: application/json" \
 -d '{"ids": [1,2,3,4,5], "priority": "HIGH"}'
