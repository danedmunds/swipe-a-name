#! /bin/bash
docker exec -it mongo mongodump --db swipe --collection names --out /tmp/mongo-backup
docker cp mongo:/tmp/mongo-backup/ .
