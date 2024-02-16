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
  * 🛳️ [Prerequisites](#prerequisites)
  * 🔨 [Setup](#setup)
* 🔐 [Two Factor Authentication](#two-factor-authentication)
* 📄 [Sign In Logs](#sign-in-logs)
* 🧰 [Useful Tools](#useful-tools)
  * 🚙 [Database Migrations](#database-migrations)
  * 🔌 [Connect To Database](#connect-to-database)
  * ♻️ [Restart Docker Containers](#restart-docker-containers)
  * 🌱 [Seeding](#seeding)
  * 👕 [Linter](#linter)
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

4. Run the initial migration: `bash ./scripts/flask-db-upgrade.sh`

5. Create an Admin user. In `seeding/.env`, ensure `FIRST_NAME`, `LAST_NAME`, and `EMAIL` are set (you should use your Blueprint email/any email you have access to here). Ensure `ROLE` is set to `Admin`. Run:
```bash
bash ./seeding/invite-user.sh
```
**IMPORTANT**: If you've reset your local DB and want to re-use an email, ensure it's deleted from Firebase as well (ask the PL for access if you don't have it)

6. Signup for an account on the app! Ensure that you use the values you used in Step 3. Your password can be anything you remember

7. Verify your email address. You should receive an email in your inbox with a link - once you click the link, you're good to freely use the app! You can invite any other users through the `Employee Directory` within the `Admin Controls`

## Two Factor Authentication
Two factor authentication is used for Relief Staff users. You can enable/disable this in your local environment by setting the following environment variable in the root `.env` file:
```
TWO_FA_ENABLED=<insert value here> # this can either be "True" or "False"
```
If this is enabled, follow these steps to enable code generation:
1. Download [Authenticator](https://authenticator.cc/) extension (Chrome recommended)
2. Open the extension and click the `pencil` icon in the top right corner, followed by the `plus` icon
3. Click `Manual Entry`
4. Under `Issuer` enter any name you'd like, and under `Secret` enter the `TWO_FA_SECRET` environment variable
5. Click `Advanced`, and set the `Period` to 30
6. Click `OK`, and you should see codes being generated!

## Sign In Logs
Sign in logs are automatically generated every time you sign into the application with any user. If you want to control when these are created and ensure your database doesn't become bloated, you can set the following environment variable:
```
CREATE_SIGN_IN_LOG=<insert value here> # this can either be "True" or "False"
```
## Useful Tools

### Database Migrations
As mentioned in the previous section, the main command you'll use to sync your local DB will be:
```bash
bash ./scripts/flask-db-upgrade.sh
```

If you make any changes to the database schema, you'll need to create a migration for it and re-sync your DB. Follow the guide [here](https://www.notion.so/uwblueprintexecs/Dev-Cheat-Sheet-65c53ce229ca4e91aa3abfe2079ac383?pvs=4#e5f29ee88d0547d586746020b5e7ac0a) to do this.

### Connect To Database 
Execute this script to interact directly with the database through SQL queries. Some sample commands that can be ran are linked [here](https://www.notion.so/uwblueprintexecs/Dev-Cheat-Sheet-65c53ce229ca4e91aa3abfe2079ac383?pvs=4#d7da2558fe2748888d84bd7a32c798dc).
```bash
bash ./scripts/exec-db.sh
```

### Restart Docker Containers
Execute this to restart all running SHOW Docker containers and clear your volumes.
```bash
bash ./scripts/restart-docker.sh
```

### Seeding
These scripts will allow you to seed your local database with randomized data. Each step shows the environment variables (in `/seeding/.env`) you should set in order to achieve your desired results. It's recommended that you execute the scripts in the following order:
1. Create any number of users. Set `FIRST_NAME`, `LAST_NAME`, `ROLE`, and `EMAIL` to your desired values. `ROLE` should be one of `Admin`, `Regular Staff`, or `Relief Staff`, and `EMAIL` should contain a valid email.
 ```bash
 bash ./seeding/invite-user.sh
 ```
2. Create any number of tags. Set `TAG_ROWS` to your desired value. This should be a valid integer.
 ```bash
 bash ./seeding/create-tags.sh
 ```
3. Create any number of residents. Set `RESIDENT_ROWS` to your desired value. This should be a valid integer.
 ```bash
 bash ./seeding/create-residents.sh
 ```
4. Create any number of log records. Set `LOG_RECORD_ROWS` to your desired value. This should be a valid integer.
 ```bash
 bash ./seeding/create-log-records.sh
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

## The Team
### Term 3 (F23):
**Project Lead:** Connor Bechthold<br>
**Product Managers:** Zafir Raeid<br>
**Developers:** Aathithan Chandrabalan, Daniel Kim, Kelly Pham, Kevin Pierce, Owen Sellner, Braydon Wang, Carolyn Zhang<br>
**Designers:** Amanda Yu<br>

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
