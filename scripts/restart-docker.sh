#!/bin/bash

docker compose down 
docker rm -f $(docker ps -a -q) # deletes all running/stopped containers. If this fails that's okay (it means there's nothing to delete)
docker compose down --volumes # brings down all volumes (incl database)
docker volume rm $(docker volume ls -q) # deletes all docker volumes
docker compose up --build