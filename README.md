# swype-a-name

Names from https://www.ssa.gov/oact/babynames/limits.html

## Running

### Local Dev Mode

- Start mongo
  ```
  cd mongo
  docker-compose up -d
  ./mongo-restore-names.sh
  ```
- run server in dev mode so it also serves the client resources
  ```
  cd server
  DEV=1 node server 
  ```
- visit http://localhost:3000