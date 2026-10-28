import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app, openai_client, qdrant_client, redis_client

client = TestClient(app)

@pytest.mark.asyncio
async def test_embed_and_index_success(mocker):
    mock_embedding_data = MagicMock()
    mock_embedding_data.embedding = [0.1] * 1536
    mock_response = MagicMock()
    mock_response.data = [mock_embedding_data]
    
    mocker.patch.object(openai_client.embeddings, 'create', new_callable=AsyncMock, return_value=mock_response)
    mocker.patch.object(qdrant_client, 'upsert', new_callable=AsyncMock, return_value=True)

    payload = {
        "id": "doc_001",
        "text": "TCS compliance terms updated.",
        "metadata": {"author": "Legal Team"}
    }
    
    response = client.post("/documents/embed", json=payload)
    assert response.status_code == 201
    assert response.json()["status"] == "Success"

@pytest.mark.asyncio
async def test_semantic_search_cached_hit(mocker):
    mocker.patch.object(redis_client, 'get', new_callable=AsyncMock, return_value="This is a cached response answer.")

    payload = {"question": "What are the TCS compliance terms?"}
    response = client.post("/query", json=payload)

    assert response.status_code == 200
    assert response.json()["source"] == "cache"
    assert response.json()["answer"] == "This is a cached response answer."
