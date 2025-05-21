from fastapi import FastAPI, status, HTTPException, Depends
from pydantic import BaseModel
import openai
from openai import OpenAI
from dotenv import load_dotenv
import os
from mysql.connector import connect, Error
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

class PostBase(BaseModel):
    title: str
    content: str
    user_id: int

class UserBase(BaseModel):
    username: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class FinanceData(BaseModel):
    incomes: list[str]
    expenses: list[str]
    goals: str
    incomeMonthly: str

@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(**user.dict())
    db.add(user)
    db.commit()

@app.post("/analyze-spending")
def analyze_spending(data: FinanceData):
    prompt = f"""
    Analyze the following financial data, and provide insights on how the user can be finacially better and achieve their financial goals. If they are doing well already, state that. Do not use bold lettrs and any '**' characters in your response.:
    Income:
    {data.incomes}
    Expenses:
    {data.expenses}
    Financial Goals:
    {data.goals}
    Income Frequency:
    {data.incomeMonthly}
    """

    chat_completions = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a financial assistant. Help the user with their financial goals by providing insights based on their income and expenses. Keep your response concise and actionable. Do not use bold letters or '**' characters in your response. Inputs will be for monthly data."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )

    return {"analysis": chat_completions.choices[0].message.content}