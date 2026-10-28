import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models
import redis.asyncio as aioredis

app = FastAPI(title="Semantic AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock-key"))
qdrant_client = AsyncQdrantClient(url=os.getenv("VECTOR_DB_URL", "http://localhost:6333"))
redis_client = aioredis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True)

class DocumentPayload(BaseModel):
    id: str
    text: str
    metadata: dict

class QueryPayload(BaseModel):
    question: str

@app.on_event("startup")
async def startup_event():
    try:
        await qdrant_client.create_collection(
            collection_name="enterprise_knowledge",
            vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
        )
    except Exception:
        pass  # Collection already instantiated vector layout structural properties

@app.post("/documents/embed", status_code=status.HTTP_201_CREATED)
async def embed_and_index(payload: DocumentPayload):
    try:
        response = await openai_client.embeddings.create(
            input=payload.text,
            model="text-embedding-3-small"
        )
        vector = response.data[0].embedding

        await qdrant_client.upsert(
            collection_name="enterprise_knowledge",
            points=[
                models.PointStruct(
                    id=payload.id,
                    vector=vector,
                    payload={"text": payload.text, **payload.metadata}
                )
            ]
        )
        return {"status": "Success", "message": f"Document {payload.id} vectorized."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def semantic_search(payload: QueryPayload):
    try:
        cached_response = await redis_client.get(f"query:{payload.question}")
        if cached_response:
            return {"source": "cache", "answer": cached_response}

        response = await openai_client.embeddings.create(
            input=payload.question,
            model="text-embedding-3-small"
        )
        query_vector = response.data[0].embedding

        search_results = await qdrant_client.search(
            collection_name="enterprise_knowledge",
            query_vector=query_vector,
            limit=3
        )
        
        if not search_results:
            return {"source": "vector_engine", "answer": "No semantic matches found."}

        context = "\n".join([hit.payload["text"] for hit in search_results])
        
        completion = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"Answer based on this context:\n{context}"},
                {"role": "user", "content": payload.question}
            ]
        )
        answer = completion.choices[0].message.content
        
        await redis_client.setex(f"query:{payload.question}", 3600, answer)
        return {"source": "vector_engine", "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
