from sqlalchemy import Boolean, Column , Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uersname = Column(String(50), unique=True)
    hashed_password = Column(String(255))

class Post(Base):

    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50))
    content = Column(String(255))
    user_id = Column(Integer)