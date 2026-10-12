import requests
import time
import json

base_url = "http://localhost:8000"

print("Registering user...")
res = requests.post(f"{base_url}/auth/register", json={
    "email": "test@example.com",
    "password": "password",
    "role": "USER"
})
if res.status_code == 400: # already exists
    res = requests.post(f"{base_url}/auth/login", json={
        "email": "test@example.com",
        "password": "password"
    })
    
token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

with open("Contract.sol", "r") as f:
    source_code = f.read()

print("Submitting scan...")
res = requests.post(f"{base_url}/api/analysis", json={
    "contract_name": "Contract.sol",
    "source_code": source_code,
    "mode": "C"
}, headers=headers)

analysis_id = res.json()["analysis_id"]

print("Polling for results...")
while True:
    time.sleep(2)
    res = requests.get(f"{base_url}/api/analysis/{analysis_id}", headers=headers)
    data = res.json()
    if data["status"] not in ["PENDING", "RUNNING"]:
        break
    print("...", end="", flush=True)
    
print("\nResults:")
print(json.dumps(data, indent=2))
