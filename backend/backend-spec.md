# Backend Specification — AI Study Note Tool

⚠️ Note for Cursor:
The frontend is **React (Vite + shadcn + PWA)**, not Next.js.
- All API calls will come from `http://localhost:5173` (or 8080).
- Ensure **CORS settings** in FastAPI allow requests from React dev server.
- Do NOT generate Next.js API routes — backend is fully handled by FastAPI.
# Backend Specification — AI Study Note Tool

## 1. Goal & Scope
Build a production-ready backend for the AI Study Note Tool that supports:
- User auth (signup/login/JWT)
- Document uploads (S3 signed URLs + metadata)
- Document processing pipeline (OCR, parsing, chunking, embeddings)
- Vector search (RAG) + LLM integration to answer questions with citations
- Flashcard generation
- Billing (MTN MoMo + Stripe placeholders) and subscriptions
- Admin endpoints + analytics
- Robust testing (Postman collection), monitoring, and secure deployment

Stack recommendation: **FastAPI + PostgreSQL + Redis + Celery + MinIO/S3 + Pinecone/Weaviate/Milvus + OpenAI/Anthropic embeddings & LLM**.

---

## 2. Architecture

Frontend (Next.js) ↔ Backend (FastAPI REST) ↔ DB (Postgres)
Backend ↔ Object Storage (S3/MinIO)
Backend ↔ Vector DB (Pinecone / Weaviate / Milvus)
Workers (Celery + Redis) handle extraction → chunking → embeddings → indexing
Backend ↔ LLM Provider (OpenAI/Anthropic/etc.)
Payments via Stripe + MTN MoMo webhooks → Billing service


---

## 3. Environment Variables


APP_ENV=development
SECRET_KEY=supersecretkey
BASE_URL=https://api.studynote.ai

PORT=8000

DATABASE_URL=postgresql://user:pass@postgres:5432/studynote
REDIS_URL=redis://redis:6379/0

S3_ENDPOINT=http://minio:9000

S3_BUCKET=studynote-docs
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=yyy
S3_REGION=us-east-1
SIGNED_URL_EXPIRY=900

VECTORDB_PROVIDER=pinecone
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=xxx

LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

STRIPE_SECRET_KEY=sk_test_xxx
MOMO_CLIENT_ID=...
MOMO_CLIENT_SECRET=...
MOMO_API_KEY=...

SENTRY_DSN=...

JWT_SECRET=another-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRES=3600

MAX_UPLOAD_SIZE=209715200


---

## 4. Database Schema
```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  university TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  course TEXT,
  status TEXT DEFAULT 'processing',
  pages INT,
  size_bytes BIGINT,
  version INT DEFAULT 1,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chunks
CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_order INT,
  text TEXT,
  char_start INT,
  char_end INT,
  page_start INT,
  page_end INT
);

-- Embeddings
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id UUID REFERENCES chunks(id) ON DELETE CASCADE,
  vector_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Queries
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  question TEXT,
  answer TEXT,
  tokens_used INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id),
  question TEXT,
  answer TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT,
  provider_subscription_id TEXT,
  status TEXT,
  renew_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);

5. Core API Endpoints
Auth

POST /auth/signup → register user, return JWT

POST /auth/login → login, return JWT

Documents

POST /documents/signed-url → generate S3 signed URL

POST /documents → register doc, enqueue processing

GET /documents/:id → metadata, status, links

Q&A

POST /qa/query → RAG pipeline with citations

Flashcards

POST /flashcards → generate from doc or text

Billing

POST /billing/subscribe → create subscription

Webhooks: /webhooks/payments/stripe, /webhooks/payments/momo

6. Processing Pipeline (Workers)

Fetch file from S3

Virus scan (optional)

Extract text (pdfplumber/docx/pptx/ocr)

Clean text

Chunk text (~500–1000 tokens)

Generate embeddings

Index vectors (vector DB)

Mark document ready

7. Retrieval-Augmented Generation (RAG)

Retrieve top-k chunks (k=6)

Prompt template includes chunks, user question, system instructions

Return concise answer + inline citations

Temperature: 0.0–0.3

8. Security Checklist

Hash passwords with bcrypt/argon2

JWT with expiry + refresh

HTTPS/TLS everywhere

Rate-limit login & queries

Signed S3 URLs with short expiry

Sanitize uploads & text

CORS limited to frontend domains

9. Testing Plan (Postman)

Auth → Signup, Login (get token)

Documents → Signed URL → Upload → Register

Worker → process document → mark ready

Q&A → Ask question → get answer + citations

Flashcards → Generate flashcards

Billing → Subscribe → Webhook simulation

10. Implementation Roadmap

Phase 0: Repo + docker-compose

Phase 1: Auth (signup/login)

Phase 2: Document upload + register

Phase 3: Worker parsing & chunks

Phase 4: Vector DB + embeddings

Phase 5: Q&A endpoint (RAG)

Phase 6: Flashcards + Billing

Phase 7: Admin + Monitoring + Security

Phase 8: Hardening & Deployment

11. Local Dev Setup (docker-compose)
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: studynote
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports: ["6379:6379"]

  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"

volumes:
  pgdata:

12. Monitoring

Integrate Sentry for error tracking

Prometheus metrics via FastAPI + Grafana

Log vector DB & LLM failures

Track daily API costs & token usage

13. Cost Control

Cache repeated queries

Use cheaper embedding models for indexing

Batch embeddings

Enforce quotas per user

14. Deliverables for Cursor

feature/backend-mvp branch with docker-compose

Alembic migrations

Postman collection

README with local dev steps

Smoke tests (pytest)

Changelog for any deviations