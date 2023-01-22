# Supportive Housing Of Waterloo
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
* 📂 [File STructure](#file-structure)
* 🌳 [Version Control Guide](#version-control-guide)
  * 🌿 [Branching](#branching)
  * 🔒 [Commits](#commits)

## Documentation

[Starter Code](https://uwblueprint.github.io/starter-code-v2)

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

## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your name. The branch name should be in kebab case and it should be short and descriptive. E.g. `sherry/readme-update`
* To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase
# if there are conflicts, resolve them and then:
git add .
git rebase --continue
# force push to remote feature branch
git push -f
```

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"
# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup
# force push to remote feature branch
git push -f
```

* Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>. The first word should be capitalized. E.g. "Create user REST endpoints", not "Created user REST endpoints"
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---

1: From Git's own [guidelines](https://github.com/git/git/blob/311531c9de557d25ac087c1637818bd2aad6eb3a/Documentation/SubmittingPatches#L139-L145)