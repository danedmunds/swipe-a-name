#! /bin/bash
docker cp ./mongo-backup mongo:/tmp/mongo-backup 
docker exec -it mongo mongorestore --drop --db swipe --dir /tmp/mongo-backup/swipe
