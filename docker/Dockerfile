FROM mysql:5.7

ENV MYSQL_DATABASE=mydb \
    MYSQL_USER=myuser \
    MYSQL_PASSWORD=mypassword \
    MYSQL_ROOT_PASSWORD=myrootpassword

COPY ./init.sql /docker-entrypoint-initdb.d/