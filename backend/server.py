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

NOTIFY_EMAILS = ["info@globerelations.org", "info@grfus.org", "jaceowie@gmail.com"]


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


class MentorSignupCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    role: str  # Mentor | Volunteer | Center Lead | Partner
    center: Optional[str] = ""
    experience: Optional[str] = ""
    message: Optional[str] = ""


class MentorSignup(MentorSignupCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VolunteerApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    country: str
    region: Optional[str] = ""
    profession: str
    mode: str  # "In-Person" | "Online" | "Both"
    availability: Optional[str] = ""
    message: Optional[str] = ""


class VolunteerApplication(VolunteerApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AmbassadorApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    country: Optional[str] = ""
    track: str  # "Public Diplomat" | "Global Youth Voice Ambassador" | "Nomination"
    nominee_name: Optional[str] = ""
    message: Optional[str] = ""


class AmbassadorApplication(AmbassadorApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def slugify(text: str) -> str:
    import re
    s = (text or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:70] or uuid.uuid4().hex[:8]


class PetitionCreate(BaseModel):
    title: str
    creator_name: str
    creator_email: EmailStr
    category: str
    target: str  # who the petition is addressed to
    summary: str
    full_text: Optional[str] = ""
    country: Optional[str] = ""


class Petition(PetitionCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str = ""
    signature_count: int = 0
    featured_in_newsroom: bool = False
    status: str = "pending"  # pending | approved | rejected
    approval_token: str = Field(default_factory=lambda: uuid.uuid4().hex)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved_at: Optional[datetime] = None


class PetitionSignCreate(BaseModel):
    name: str
    email: EmailStr
    country: Optional[str] = ""
    comment: Optional[str] = ""


class PetitionSignature(PetitionSignCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    petition_id: str
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


@api_router.post("/mentor-signup", response_model=SubmissionAck)
async def create_mentor_signup(payload: MentorSignupCreate):
    obj = MentorSignup(**payload.model_dump())
    await db.mentor_signups.insert_one(to_doc(obj))
    body = (
        f"New Youth Succeed Center signup\n\n"
        f"Role: {obj.role}\nName: {obj.name}\nEmail: {obj.email}\nPhone: {obj.phone or '(none)'}\n"
        f"Preferred Center: {obj.center or '(any)'}\n\nExperience:\n{obj.experience or '(none)'}\n\n"
        f"Message:\n{obj.message or '(none)'}\n\n"
        f"Submission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Youth Succeed] {obj.role} — {obj.name}"
    logging.info("Mentor signup stored id=%s role=%s", obj.id, obj.role)
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


@api_router.get("/mentor-signup", response_model=List[MentorSignup])
async def list_mentor_signups():
    docs = await db.mentor_signups.find().sort("created_at", -1).to_list(500)
    return [MentorSignup(**d) for d in docs]


@api_router.post("/volunteer-application", response_model=SubmissionAck)
async def create_volunteer_application(payload: VolunteerApplicationCreate):
    obj = VolunteerApplication(**payload.model_dump())
    await db.volunteer_applications.insert_one(to_doc(obj))
    body = (
        f"New Volunteer Application\n\n"
        f"Name: {obj.name}\nEmail: {obj.email}\nPhone: {obj.phone or '(none)'}\n"
        f"Country: {obj.country}\nRegion / State: {obj.region or '(none)'}\n"
        f"Profession: {obj.profession}\nVolunteer Mode: {obj.mode}\n"
        f"Availability: {obj.availability or '(none)'}\n\n"
        f"Message:\n{obj.message or '(none)'}\n\n"
        f"Submission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Volunteer Application] {obj.name} — {obj.country}"
    logging.info("Volunteer application stored id=%s country=%s", obj.id, obj.country)
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


@api_router.get("/volunteer-application", response_model=List[VolunteerApplication])
async def list_volunteer_applications():
    docs = await db.volunteer_applications.find().sort("created_at", -1).to_list(500)
    return [VolunteerApplication(**d) for d in docs]


@api_router.post("/ambassador-application", response_model=SubmissionAck)
async def create_ambassador_application(payload: AmbassadorApplicationCreate):
    obj = AmbassadorApplication(**payload.model_dump())
    await db.ambassador_applications.insert_one(to_doc(obj))
    body = (
        f"New Ambassador / Public Diplomat Submission\n\n"
        f"Track: {obj.track}\nName: {obj.name}\nEmail: {obj.email}\n"
        f"Phone: {obj.phone or '(none)'}\nCountry: {obj.country or '(none)'}\n"
        f"Nominee (if nomination): {obj.nominee_name or '(n/a)'}\n\n"
        f"Message:\n{obj.message or '(none)'}\n\n"
        f"Submission ID: {obj.id}\nTime (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Public Diplomat] {obj.track} — {obj.name}"
    logging.info("Ambassador submission stored id=%s track=%s", obj.id, obj.track)
    return SubmissionAck(id=obj.id, mailto=build_mailto(subject, body))


@api_router.get("/ambassador-application", response_model=List[AmbassadorApplication])
async def list_ambassador_applications():
    docs = await db.ambassador_applications.find().sort("created_at", -1).to_list(500)
    return [AmbassadorApplication(**d) for d in docs]


# --- Petitions ----------------------------------------------------------

NEWSROOM_FEATURE_THRESHOLD = 5000


@api_router.post("/petitions", response_model=Petition)
async def create_petition(payload: PetitionCreate):
    obj = Petition(**payload.model_dump())
    # unique slug
    base = slugify(obj.title)
    slug = base
    i = 1
    while await db.petitions.find_one({"slug": slug}):
        i += 1
        slug = f"{base}-{i}"
    obj.slug = slug
    await db.petitions.insert_one(to_doc(obj))

    public_url = os.environ.get("PUBLIC_APP_URL", "").rstrip("/") or "https://agrfus.org"
    backend_api = os.environ.get("BACKEND_API_URL", "").rstrip("/") or f"{public_url}/api"
    approve_link = f"{backend_api}/petitions/{obj.slug}/approve?token={obj.approval_token}"
    reject_link = f"{backend_api}/petitions/{obj.slug}/reject?token={obj.approval_token}"

    body = (
        f"NEW PETITION AWAITING APPROVAL\n\n"
        f"Title: {obj.title}\nCategory: {obj.category}\n"
        f"Target: {obj.target}\nCreator: {obj.creator_name} <{obj.creator_email}>\n"
        f"Country: {obj.country or '(none)'}\n\nSummary:\n{obj.summary}\n\n"
        f"Full text:\n{obj.full_text or '(none)'}\n\n"
        f"====== APPROVAL ACTIONS ======\n"
        f"APPROVE (make live): {approve_link}\n"
        f"REJECT:             {reject_link}\n"
        f"Public page (after approval): {public_url}/petitions/{obj.slug}\n\n"
        f"Submission ID: {obj.id}\nStatus: {obj.status}\n"
        f"Time (UTC): {obj.created_at.isoformat()}\n"
    )
    subject = f"[AGRF Petition — APPROVAL NEEDED] {obj.title}"
    logging.info("Petition pending approval id=%s slug=%s", obj.id, obj.slug)
    return obj


async def _moderate_petition(slug: str, token: str, new_status: str) -> dict:
    doc = await db.petitions.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Petition not found")
    pet = Petition(**doc)
    if pet.approval_token != token:
        raise HTTPException(status_code=403, detail="Invalid approval token")
    if pet.status == new_status:
        return {"ok": True, "already": True, "status": pet.status, "slug": pet.slug}
    update = {"status": new_status}
    if new_status == "approved":
        update["approved_at"] = datetime.now(timezone.utc).isoformat()
    await db.petitions.update_one({"id": pet.id}, {"$set": update})
    return {"ok": True, "already": False, "status": new_status, "slug": pet.slug}


def _moderation_html(title: str, slug: str, status: str) -> str:
    color = "#009EDB" if status == "approved" else "#b00020"
    public_url = os.environ.get("PUBLIC_APP_URL", "").rstrip("/") or "https://agrfus.org"
    return f"""<!doctype html><html><head><meta charset='utf-8'><title>Petition {status}</title>
<style>body{{font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f4f7fa;margin:0;padding:60px 20px;color:#0b2c4a}}
.card{{max-width:560px;margin:0 auto;background:#fff;border-top:6px solid {color};padding:40px;box-shadow:0 8px 32px rgba(11,44,74,.08)}}
h1{{font-family:Georgia,serif;margin:0 0 8px;font-size:28px}}
.eyebrow{{color:{color};font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:700}}
a.btn{{display:inline-block;margin-top:24px;padding:12px 22px;background:{color};color:#fff;text-decoration:none;font-weight:600}}
.muted{{color:#64748b;font-size:13px}}
</style></head><body><div class='card'>
<div class='eyebrow'>Petition {status}</div>
<h1>{title}</h1>
<p class='muted'>This petition has been <b>{status}</b>. {"It is now publicly visible on the AGRF website." if status == "approved" else "It will not appear publicly."}</p>
<a class='btn' href='{public_url}/petitions/{slug}'>View on site</a>
</div></body></html>"""


@api_router.get("/petitions/{slug}/approve")
async def approve_petition(slug: str, token: str):
    res = await _moderate_petition(slug, token, "approved")
    doc = await db.petitions.find_one({"slug": slug})
    title = (doc or {}).get("title", slug)
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=_moderation_html(title, res["slug"], "approved"))


@api_router.get("/petitions/{slug}/reject")
async def reject_petition(slug: str, token: str):
    res = await _moderate_petition(slug, token, "rejected")
    doc = await db.petitions.find_one({"slug": slug})
    title = (doc or {}).get("title", slug)
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=_moderation_html(title, res["slug"], "rejected"))


@api_router.get("/petitions", response_model=List[Petition])
async def list_petitions(featured: Optional[bool] = None, include_pending: bool = False):
    query: dict = {}
    if not include_pending:
        query["status"] = "approved"
    if featured is not None:
        query["featured_in_newsroom"] = featured
    docs = await db.petitions.find(query).sort("signature_count", -1).to_list(500)
    return [Petition(**d) for d in docs]


@api_router.get("/petitions/{slug}", response_model=Petition)
async def get_petition(slug: str):
    doc = await db.petitions.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Petition not found")
    pet = Petition(**doc)
    if pet.status != "approved":
        raise HTTPException(status_code=404, detail="Petition not found")
    return pet


@api_router.post("/petitions/{slug}/sign")
async def sign_petition(slug: str, payload: PetitionSignCreate):
    doc = await db.petitions.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Petition not found")
    pet = Petition(**doc)
    if pet.status != "approved":
        raise HTTPException(status_code=404, detail="Petition not found")
    # Prevent duplicate signatures by email on the same petition
    existing = await db.petition_signatures.find_one({"petition_id": pet.id, "email": payload.email})
    if existing:
        return {"ok": True, "duplicate": True, "signature_count": pet.signature_count, "slug": pet.slug, "featured_in_newsroom": pet.featured_in_newsroom}
    sig = PetitionSignature(petition_id=pet.id, **payload.model_dump())
    await db.petition_signatures.insert_one(to_doc(sig))
    new_count = pet.signature_count + 1
    featured = new_count >= NEWSROOM_FEATURE_THRESHOLD
    await db.petitions.update_one(
        {"id": pet.id},
        {"$set": {"signature_count": new_count, "featured_in_newsroom": featured}},
    )
    return {"ok": True, "duplicate": False, "signature_count": new_count, "slug": pet.slug, "featured_in_newsroom": featured}


@api_router.get("/petitions/{slug}/signatures", response_model=List[PetitionSignature])
async def list_signatures(slug: str, limit: int = 100):
    doc = await db.petitions.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Petition not found")
    pet = Petition(**doc)
    sigs = await db.petition_signatures.find({"petition_id": pet.id}).sort("created_at", -1).to_list(max(1, min(limit, 500)))
    return [PetitionSignature(**s) for s in sigs]


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
