"""One-time seed script to create/update the three featured petitions."""
import asyncio
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).parent / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]


def slugify(text: str) -> str:
    import re
    s = (text or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:70]


SEEDS = [
    {
        "title": "Protect Clean Drinking Water",
        "creator_name": "AGRF Editorial",
        "creator_email": "info@globerelations.org",
        "category": "Public health and community development",
        "target": "United Nations and national governments",
        "summary": "A global call to protect safe, clean drinking water as a human right — strengthening infrastructure, regulation and community-led stewardship in every region.",
        "full_text": "Access to safe drinking water remains unequal across the world. We urge global leaders to commit to measurable investments in water infrastructure, enforce pollution standards, and support community-led stewardship programs.",
        "country": "Global",
        "signature_count": 1000,
    },
    {
        "title": "Youth Inclusion in Nation Building and Policy Processes",
        "creator_name": "AGRF Editorial",
        "creator_email": "info@globerelations.org",
        "category": "Youth empowerment and inclusion",
        "target": "National governments and policy institutions",
        "summary": "Young people must have a meaningful seat at the table. This petition calls for formal youth representation in nation-building and policy decision-making processes at every level of government.",
        "full_text": "We call on governments and institutions to embed young people in the design, debate and evaluation of national policies — through youth advisory boards, legislative youth councils and transparent consultation mechanisms.",
        "country": "Global",
        "signature_count": 500,
    },
    {
        "title": "More Focus on Youth Empowerment in America and Around the World",
        "creator_name": "AGRF Editorial",
        "creator_email": "info@globerelations.org",
        "category": "Youth empowerment and inclusion",
        "target": "Policy makers and international institutions",
        "summary": "A unified call for sustained investment in youth empowerment — from education and mentorship to entrepreneurship and mental health — in the United States and across the globe.",
        "full_text": "Youth empowerment is the foundation of stable, innovative societies. We ask policy makers to prioritise funding, access and opportunity so young people can lead, contribute and thrive in America and worldwide.",
        "country": "United States & Global",
        "signature_count": 1000,
    },
]


async def main():
    await db.petitions.delete_many({})
    await db.petition_signatures.delete_many({})
    for s in SEEDS:
        slug = slugify(s["title"])
        doc = {
            "id": str(uuid.uuid4()),
            "slug": slug,
            "title": s["title"],
            "creator_name": s["creator_name"],
            "creator_email": s["creator_email"],
            "category": s["category"],
            "target": s["target"],
            "summary": s["summary"],
            "full_text": s["full_text"],
            "country": s["country"],
            "signature_count": s["signature_count"],
            "featured_in_newsroom": s["signature_count"] >= 5000,
            "status": "approved",
            "approval_token": uuid.uuid4().hex,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "approved_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.petitions.insert_one(doc)
        print(f"Seeded: {s['title']} -> /petitions/{slug} ({s['signature_count']} signed)")
    total = await db.petitions.count_documents({})
    print(f"Done. Total petitions: {total}")


asyncio.run(main())
