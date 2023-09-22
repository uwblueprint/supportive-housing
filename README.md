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

### Prerequisites
- Install Docker Desktop ([MacOS](https://docs.docker.com/desktop/install/mac-install/) | [Windows (Home)](https://docs.docker.com/desktop/install/windows-install/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/desktop/install/windows-install/) | [Linux](https://docs.docker.com/engine/install/#server)) and ensure that it is running
- Ask the current PL to receive access to ENV Variables

### Setup
1. Clone this repository and `cd` into the project folder
```bash
git clone https://github.com/uwblueprint/supportive-housing.git
cd supportive-housing
```

2. Ensure that environment variables have been added to the following directories:
```
/.env
/frontend/.env
/seeding/.env
```

3. Run the application
```bash
docker-compose up --build
```

## Useful Commands

### Database Migration
```bash
bash ./scripts/flask-db-upgrade.sh
```

### Connect To Database 
```bash
bash ./scripts/exec-db.sh
```

### Restart Docker Containers
```bash
bash ./scripts/restart-docker.sh
```

### Database Migration
```bash
bash ./scripts/flask-db-upgrade.sh
```

### Seeding
Before running these scripts, remember to update the `.env` file to ensure you're configuring your data to your needs:
```bash
bash ./seeding/create-user.sh         # Create a user with a specific name and role
bash ./seeding/create-residents.sh    # Create a number of residents
bash ./seeding/create-log-records.sh  # Create a number of log records
```

### Linter 
To run the linter, use the following commands while the docker containers are running:
- Mac
  - `docker exec -it SHOW-backend /bin/bash -c "black ."`
  - `docker exec -it SHOW-frontend /bin/bash -c "yarn fix"`
- Windows
  - `docker exec -it SHOW-backend bash -c "black ."`
  - `docker exec -it SHOW-frontend bash -c "yarn fix"`

Or, if you have yarn installed locally, running `yarn fix` *should* work as well.

### Tests
```
cd e2e-tests
python3 -m pytest --lang python --auth --fs
```
## The Team
### Term 2 (S23):
**Project Lead:** Safwaan Chowdhury<br>
**Product Managers:** Hiba Altaf<br>
**Developers:** Connor Bechthold, Helen Guan, Kelly Pham, Daniel Kim, Kevin Pierce, Owen Sellner<br>
**Designers:** Lauren Fearn, Yousuf Zia<br>

### Term 1 (W23):
**Project Lead:** Dinu Wijetunga<br>
**Product Managers:** Rachel Scott & Maitry Mistry<br>
**Developers:** Connor Bechthold, Helen Guan, Joyce Wangsa, Juthika Hoque, Kelly Pham, Safwaan Chowdhury<br>
**Designers:** Elle Luo, Serena Li<br>

Huge shoutout to the Internal Tools team for creating StarterCode v2!<br>
