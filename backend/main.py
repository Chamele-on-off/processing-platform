from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "OK", "message": "Processing Platform API"}
