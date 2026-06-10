from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt_handler import create_access_token
from app.models.User import User
from app.repositories.User_Repository import UserRepository
from app.schemas.User_Schema import LoginRequest, RegisterRequest, TokenResponse, UserResponse


class UserService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def register(self, request: RegisterRequest) -> UserResponse:
        existing = await self.repo.find_by_email(request.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un usuario con el email {request.email}",
            )
        user = User(
            email=request.email,
            full_name=request.full_name,
            password=request.password,
            role=request.role,
        )
        saved = await self.repo.save(user)
        return UserResponse(
            id=saved.id,
            email=saved.email,
            full_name=saved.full_name,
            role=saved.role,
            is_active=saved.is_active,
        )

    async def login(self, request: LoginRequest) -> TokenResponse:
        user = await self.repo.find_by_email(request.email)
        if not user or user.password != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo",
            )
        token = create_access_token({"sub": str(user.id), "role": user.role})
        return TokenResponse(access_token=token)