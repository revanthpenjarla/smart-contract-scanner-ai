import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

DB_PATH = os.getenv("SQLITE_DB_PATH", "smart_contract_scanner.db")
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Ensure default demo accounts exist
    from backend.db.models import User
    from backend.core.security import hash_password
    from sqlalchemy.future import select

    async with AsyncSessionLocal() as session:
        # Check auditor
        res = await session.execute(select(User).where(User.email == "auditor@smai.security"))
        if not res.scalar_one_or_none():
            session.add(User(
                email="auditor@smai.security",
                hashed_password=hash_password("password123"),
                role="USER"
            ))
        # Check admin
        res_adm = await session.execute(select(User).where(User.email == "admin@smai.security"))
        if not res_adm.scalar_one_or_none():
            session.add(User(
                email="admin@smai.security",
                hashed_password=hash_password("admin123"),
                role="ADMIN"
            ))
        await session.commit()
