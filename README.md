# Supportive Housing Of Waterloo 🏘️
Welcome to the SHOW platform repository!

## Technical Overview
**Backend Language:** Python (with Flask)<br>
**Backend API:** REST<br>
**Database:** PostgreSQL<br>
**User Auth:** Opt-in<br>
**File Storage:** Opt-in<br>

The frontend is a React application written in TypeScript.

## Table of Contents
* 📝 [Documentation](#documentation)
* 👨‍💻 [Getting Started](#getting-started)
* 💻 [The Team](#the-team)

## Documentation

- [Starter Code](https://uwblueprint.github.io/starter-code-v2)
- [Dev Cheatsheat](https://www.notion.so/uwblueprintexecs/Dev-Cheat-Sheet-from-CAS-65c53ce229ca4e91aa3abfe2079ac383) (adapted from Children's Aid Society team)
- [Dev Guidelines](https://www.notion.so/uwblueprintexecs/Dev-Guidelines-9ebd726d5b244e2094c54e10afc7303a)

## Getting Started
This repository was setup using [Blueprint's starter-code](https://uwblueprint.github.io/starter-code-v2/docs/getting-started). To connect to all the services we use, we use `.env` files that keep track of keys, urls, and more. Make sure you have a `.env` file in the following locations:
- `./.env` (the main folder)
- `./frontend/.env`
- `./e2e-tests/.env` (optional)

Once you have these, build and run the system using:
```
docker-compose up --build
```

To run the linter, use the following commands while the docker containers are running:
- Mac
  - `docker exec -it SHOW-backend /bin/bash -c "black ."`
  - `docker exec -it SHOW-frontend /bin/bash -c "yarn fix"`
- Windows
  - `docker exec -it SHOW-backend bash -c "black ."`
  - `docker exec -it SHOW-frontend bash -c "yarn fix"`

Or, if you have yarn installed locally, running `yarn fix` *should* work as well.

To run tests:
```
cd e2e-tests
python3 -m pytest --lang python --auth --fs
```
## The Team
### Term 1 (W23):
**Project Lead:** Dinu Wijetunga<br>
**Product Managers:** Rachel Scott & Maitry Mistry<br>
**Developers:** Connor Bechthold, Helen Guan, Joyce Wangsa, Juthika Hoque, Kelly Pham, Safwaan Chowdhury<br>
**Designers:** Elle Luo, Serena Li<br>

Huge shoutout to the Internal Tools team for creating StarterCode v2!<br>