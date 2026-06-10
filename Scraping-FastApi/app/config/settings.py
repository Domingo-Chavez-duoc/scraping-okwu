from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    app_env: str = "development"

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()