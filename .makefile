start:
    npm run server

test:
    npm test

docker-build:
    docker build -t my-node-app .

docker-run:
    docker run -p 8000:8000 portone
