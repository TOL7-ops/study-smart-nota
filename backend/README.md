# AI Study Note Tool — Backend (Phase 1 + Phase 2)

FastAPI backend implementing:
- Phase 1: User authentication (signup/login) with JWT, SQLAlchemy ORM, and CORS for a React frontend (Vite + shadcn + PWA).
- Phase 2: Document upload flow
  - Generate S3/MinIO pre-signed URL (client uploads directly)
  - Register document metadata after upload
  - Fetch document metadata

Endpoints:
- GET /health
- POST /auth/signup
- POST /auth/login
- POST /documents/signed-url
- POST /documents
- GET /documents/{id}

Tables are auto-created on startup (SQLite by default). CORS defaults allow http://localhost:5173 and http://localhost:8080.

Version: 0.2.0


## Quickstart

1) Python environment
- Required: Python 3.11+
- Create and activate a virtualenv:

Windows (cmd)
- python -m venv .venv
- .venv\Scripts\activate

macOS/Linux (bash)
- python3 -m venv .venv
- source .venv/bin/activate

2) Install dependencies
- pip install -r requirements.txt

3) Setup environment
- copy .env.example .env
- Edit .env (update JWT_SECRET at minimum; set S3/MinIO values if different)

4) Run the API
- uvicorn app.main:app --reload --port 8000

Open docs at: http://localhost:8000/docs


## Environment Variables

Phase 1 essentials:
- APP_ENV: development
- BASE_URL: http://localhost:8000
- PORT: 8000
- DATABASE_URL: sqlite:///./dev.db  (use Postgres in later phases)
- FRONTEND_ORIGINS: http://localhost:5173,http://localhost:8080
- JWT_SECRET: change-me-in-prod
- JWT_ALGORITHM: HS256
- JWT_ACCESS_TOKEN_EXPIRES: 3600

Phase 2 (Object Storage):
- S3_ENDPOINT: http://localhost:9000
- S3_BUCKET: studynote-docs
- S3_ACCESS_KEY: minioadmin
- S3_SECRET_KEY: minioadmin
- S3_REGION: us-east-1
- SIGNED_URL_EXPIRY: 900
- S3_USE_PATH_STYLE: true (true for MinIO; may set to false for AWS)


## Object Storage Prerequisites (MinIO/AWS S3)

- For local MinIO (per spec), ensure a MinIO server is running at S3_ENDPOINT (default http://localhost:9000) and that the S3_BUCKET exists (studynote-docs).
- For AWS S3, set correct credentials and consider setting S3_USE_PATH_STYLE=false for virtual-hosted-style URLs. Be sure the bucket exists in the configured region.


## Project Structure

- app/
  - api/
    - auth.py
    - documents.py
  - core/
    - __init__.py
    - config.py
    - database.py
    - deps.py
    - security.py
  - models/
    - user.py
    - document.py
  - schemas/
    - token.py
    - user.py
    - document.py
  - services/
    - s3_client.py
  - __init__.py
  - main.py
- postman/
  - StudyNote-Auth.postman_collection.json
- requirements.txt
- README.md
- .env.example


## CORS

CORS is configured to allow the React dev servers by default:
- http://localhost:5173
- http://localhost:8080

Override via FRONTEND_ORIGINS="http://localhost:5173,http://localhost:8080,https://your-frontend.app".


## API

Health Check
- GET /health
- 200 OK → {"status":"ok"}

Auth — Signup
- POST /auth/signup
- Body (JSON)
  {
    "email": "user@example.com",
    "password": "StrongPassword123",
    "name": "Ada",
    "university": "Uni"
  }
- 201 Created
  {
    "access_token": "<jwt>",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "Ada",
      "university": "Uni",
      "role": "student"
    }
  }

Auth — Login
- POST /auth/login
- Body (JSON)
  {
    "email": "user@example.com",
    "password": "StrongPassword123"
  }
- 200 OK → same shape as signup

Documents — Generate Signed URL
- POST /documents/signed-url
- Headers: Authorization: Bearer <jwt>
- Body (JSON)
  {
    "filename": "example.pdf",
    "content_type": "application/pdf",
    "size_bytes": 12345
  }
- 200 OK
  {
    "upload_url": "https://...presigned...",
    "file_url": "http://localhost:9000/studynote-docs/<user-id>/<uuid>_example.pdf",
    "key": "<user-id>/<uuid>_example.pdf",
    "expires_in": 900,
    "required_headers": {
      "Content-Type": "application/pdf"
    }
  }

Notes:
- Client must upload with HTTP PUT to upload_url and include the same Content-Type header.

Documents — Register Document
- POST /documents
- Headers: Authorization: Bearer <jwt>
- Body (JSON)
  {
    "title": "Intro to Economics",
    "file_url": "<the file_url returned from signed-url>",
    "course": "ECON-101",
    "size_bytes": 204800
  }
- 201 Created
  {
    "id": "<uuid>",
    "user_id": "<uuid>",
    "title": "Intro to Economics",
    "file_url": "<same file_url>",
    "course": "ECON-101",
    "status": "processing",
    "pages": null,
    "size_bytes": 204800,
    "version": 1,
    "uploaded_at": "2025-09-14T01:40:35"
  }

Documents — Get Metadata
- GET /documents/{id}
- Headers: Authorization: Bearer <jwt>
- 200 OK → same as register response body

Notes
- Emails are normalized to lowercase.
- Passwords hashed via bcrypt (passlib).
- JWT payload includes sub (user id), email, role, iat, exp.


## cURL Examples

Signup
- curl -X POST http://localhost:8000/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"StrongPassword123\",\"name\":\"Ada\",\"university\":\"Uni\"}"

Login
- curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"StrongPassword123\"}"

Request a Signed URL
- TOKEN="<jwt from login>"
- curl -X POST http://localhost:8000/documents/signed-url \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"filename\":\"example.pdf\",\"content_type\":\"application/pdf\",\"size_bytes\":12345}"

Upload File with Presigned URL (if MinIO/S3 available)
- curl -X PUT "<upload_url from previous step>" \
  -H "Content-Type: application/pdf" \
  --data-binary @./path/to/example.pdf

Register Document
- curl -X POST http://localhost:8000/documents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Sample Doc\",\"file_url\":\"<file_url from signed-url>\",\"course\":\"Course 101\",\"size_bytes\":12345}"

Get Document
- curl -X GET http://localhost:8000/documents/<document_id> \
  -H "Authorization: Bearer $TOKEN"


## Postman

- Import postman/StudyNote-Auth.postman_collection.json
- The collection uses a baseUrl variable (defaults to http://localhost:8000).
- Run in this order:
  1) Auth → Signup (or Login)
  2) Documents → Signed URL
  3) Documents → Register Document
  4) Documents → Get Document
- The collection stores the access_token, file_url, and document_id for convenience.

If you change the server port, update the collection variable baseUrl accordingly.


## Database

- Default: SQLite file at ./dev.db for convenience.
- Production: PostgreSQL is recommended per spec.
- Tables auto-created on startup (Phase 1/2). Later phases should introduce Alembic migrations.


## Migration Notes

- Phase 2 introduces a new table: documents
- In development, tables are created automatically via SQLAlchemy metadata.
- For production, use Alembic migrations to manage schema changes consistently across environments.
- The schema is compatible with SQLite (dev) and Postgres (prod).


## Smoke Test Results (example)

A sample smoke test using PowerShell on Windows produced:

- Signed URL acquired. File URL: http://localhost:9000/studynote-docs/<user-id>/<uuid>_sample.pdf
- Registered document ID: <uuid>
- GET /documents/{id} returned 200 with expected fields:
  {
    "id": "...",
    "user_id": "...",
    "title": "Sample Doc",
    "file_url": "http://localhost:9000/studynote-docs/.../....pdf",
    "course": "Course 101",
    "status": "processing",
    "pages": null,
    "size_bytes": 12345,
    "version": 1,
    "uploaded_at": "2025-09-14T01:40:35"
  }

Note: You must have MinIO or S3 available to perform the actual PUT upload. Generating the signed URL does not require the storage to be reachable, but uploading the file does.


## Notes for Frontend Integration

- Include the token in Authorization header:
  Authorization: Bearer <jwt>
- The Signed URL response includes required_headers; set Content-Type when uploading.
- Ensure frontend originates from one of FRONTEND_ORIGINS; otherwise CORS will block requests.


## Files of Interest

- API entry: app/main.py
- Auth routes: app/api/auth.py
- Documents routes: app/api/documents.py
- ORM base/session: app/core/database.py
- Config & CORS & Storage: app/core/config.py
- Security (hash/JWT): app/core/security.py
- Auth deps: app/core/deps.py
- User model: app/models/user.py
- Document model: app/models/document.py
- Storage client: app/services/s3_client.py
- Schemas: app/schemas/*.py


## Next Phases (per spec)

- Worker parsing & chunks
- Vector DB + embeddings
- Q&A endpoint (RAG)
- Flashcards + Billing
- Admin + Monitoring + Security
- Hardening & Deployment