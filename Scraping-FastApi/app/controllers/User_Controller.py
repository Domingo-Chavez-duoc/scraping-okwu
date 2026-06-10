from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.schemas.User_Schema import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.User_Service import UserService

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Registra un nuevo usuario en el sistema."""
    return await UserService(db).register(request)


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    return await UserService(db).login(request)