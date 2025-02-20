FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]

# Start the Container
# docker-compose up --build
#
# Check Running Containers
# docker ps
#
# Access PostgreSQL Database
# docker exec -it 222d0b44f010 bash
# psql -h db -U postgres
#
# Create a User
# curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com"}'
#
# To stop the containers:
# docker-compose down
#
# To remove all containers and volumes:
# docker-compose down -v