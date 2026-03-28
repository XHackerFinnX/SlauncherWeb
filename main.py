import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/debug")
async def debug():
    import os
    from pathlib import Path
    base = Path(__file__).resolve().parent
    return {
        "base_dir": str(base),
        "templates_exist": (base / "templates" / "index.html").exists(),
        "static_exist": (base / "static" / "favicon.ico").exists(),
        "templates_list": [str(p) for p in (base / "templates").iterdir()] if (base / "templates").exists() else [],
    }