FROM mariadb:latest

WORKDIR /db

COPY .env .

# ENV $(cat .env | grep -v ^# | xargs)

ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}