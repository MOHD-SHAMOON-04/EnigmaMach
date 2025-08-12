### Backend
- GET /enigma?seedId=abc (OR)
- GET /enigma?type=navy
  - res: 
  ```json
  {
    "rotors": ["", "", ""],
    "reflector": "",
    "plugboard": "SZRDXFGHMJKOIULQPCAVNTYEWB",
  }
  ```

- POST /enigms
  - req:
  ```json
  {
    "seed": string,
    "email": string
  }
  ```
  - res: 
  ```json
  {
    "message": "check your email to get your new machine"
  }
  ```
  - Email will have
    - share links
    - qr to share
    - quick link
    - machine id