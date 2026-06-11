from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    OPERATOR = "OPERATOR"


class RegisterRequest(BaseModel):
    email: str
    full_name: str
    password: str
    role: UserRole = UserRole.OPERATOR

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "operador@smartlogix.cl",
                "full_name": "Juan Pérez",
                "password": "mipassword123",
                "role": "OPERATOR"
            }
        }
    }


class LoginRequest(BaseModel):
    email: str
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "operador@smartlogix.cl",
                "password": "mipassword123"
            }
        }
    }


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool