from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.database import Base, engine
from sqlalchemy import text

import app.models.User

from app.controllers.User_Controller import router as auth_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.execute(text('CREATE SCHEMA IF NOT EXISTS usuario'))
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Scraping",
    version="2.0.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "UP", "service": "scraping"}