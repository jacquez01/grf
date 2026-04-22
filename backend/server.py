from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="AGRF API")
api_router = APIRouter(prefix="/api")

# --- Models -------------------------------------------------------------

NOTIFY_EMAILS = ["info@globerelations.org", "jaceowie@gmail.com"]


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProposalCreate(BaseModel):
    organization: str
    name: str
    email: EmailStr
    message: Optional[str] = ""


class Proposal(ProposalCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VolunteerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    interest: Optional[str] = ""


class Volunteer(VolunteerCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubmissionAck(BaseModel):
    id: str
    ok: bool = True
    notify_to: List[str] = NOTIFY_EMAILS
    mailto: str


def build_mailto(subject: str, body: str) -> str:
    from urllib.parse import quote
    to = ",".join(NOTIFY_EMAILS)
    return f"mailto:{to}?subject={quote(subject)}&body={quote(body)}"


def to_doc(model: BaseModel) -> dict:
    d = model.model_dump()
    if "created_at" in d and isinstance(d["created_at"], datetime):
        d["created_at"] = d["created_at"].isoformat()
    if "timestamp" in d and isinstance(d["timestamp"], datetime):
        d["timestamp"] = d["timestamp"].isoformat()
    return d


# --- Routes -------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "AGRF API running", "notify": NOTIFY_EMAILS}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    obj = StatusCheck(client_name=payload.client_name)
    await db.status_checks.insert_one(to_doc(obj))
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**d) for d in docs]


@api_router.post("/contact", response_model=SubmissionAck)
async def create_contact(payload: ContactCreate):
    obj = Contact(**payload.model_dump())
    await db.contacts.insert_one(to_doc(obj))
    body = (
        f"New contact submission from the AGRF website\n\n"
        f"Name: {obj.name}\nEmail: {obj.email}\nSubject: {obj.subject or '(none)'}\n\n"
        f"Message:\n{obj.message}\n\nSubmission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Contact] {obj.subject or obj.name}"
    logging.info("Contact stored id=%s from=%s", obj.id, obj.email)
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    docs = await db.contacts.find().sort("created_at", -1).to_list(500)
    return [Contact(**d) for d in docs]


@api_router.post("/proposal", response_model=SubmissionAck)
async def create_proposal(payload: ProposalCreate):
    obj = Proposal(**payload.model_dump())
    await db.proposals.insert_one(to_doc(obj))
    body = (
        f"New partnership proposal inquiry\n\n"
        f"Organization: {obj.organization}\nContact: {obj.name}\nEmail: {obj.email}\n\n"
        f"Details:\n{obj.message or '(none)'}\n\nSubmission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Partnership] {obj.organization}"
    logging.info("Proposal stored id=%s org=%s", obj.id, obj.organization)
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


@api_router.get("/proposal", response_model=List[Proposal])
async def list_proposals():
    docs = await db.proposals.find().sort("created_at", -1).to_list(500)
    return [Proposal(**d) for d in docs]


@api_router.post("/volunteer", response_model=SubmissionAck)
async def create_volunteer(payload: VolunteerCreate):
    obj = Volunteer(**payload.model_dump())
    await db.volunteers.insert_one(to_doc(obj))
    body = (
        f"New volunteer interest\n\n"
        f"Name: {obj.name}\nEmail: {obj.email}\nPhone: {obj.phone or '(none)'}\n"
        f"Interest area: {obj.interest or '(none)'}\n\nSubmission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Volunteer] {obj.name}"
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
