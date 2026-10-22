"""Generate reference copies of the latest local Make exports without account bindings."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "make"
OUT.mkdir(exist_ok=True)
SOURCES = {
    "availability.reference.blueprint.json": ROOT / "upload/Potala Demo – Calendar – Check Indoor Availability.blueprint (4).json",
    "booking.reference.blueprint.json": ROOT / "upload/Potala Demo – Calendar – Book Indoor Table.blueprint (1).json",
}

def clean(value):
    if isinstance(value, list):
        return [clean(item) for item in value]
    if not isinstance(value, dict):
        return value
    result = {key: clean(item) for key, item in value.items() if key != "restore"}
    if "module" in result:
        parameters = result.get("parameters")
        if isinstance(parameters, dict):
            for key in ("hook", "__IMTCONN__"):
                if key in parameters:
                    parameters[key] = None
        mapper = result.get("mapper")
        if isinstance(mapper, dict) and "calendar" in mapper:
            mapper["calendar"] = ""
    return result

for target, source in SOURCES.items():
    data = clean(json.loads(source.read_text()))
    output = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    # Account-specific URLs and IDs are not safe in even a private reference repo.
    forbidden = [r"hook\.[^\s\"]+\.make\.com", r"https?://[^\s\"]+", r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}"]
    for pattern in forbidden:
        if re.search(pattern, output, flags=re.I):
            raise SystemExit(f"Unredacted URL or email remains in {target}")
    (OUT / target).write_text(output)
    print(f"Wrote {target}")
