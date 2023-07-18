#!/bin/bash
docker exec -it SHOW-database /bin/bash -c "psql -U postgres -d show_db"
INSERT INTO buildings (id, address, name) VALUES (1, '144 Erb St. East', '144');
INSERT INTO buildings (id, address, name) VALUES (2, '362 Erb St. West', '362');
INSERT INTO buildings (id, address, name) VALUES (3, '402 Erb St. West', '402');
