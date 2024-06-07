# Overview
In this project i have modified my previous chat-app project to make it more scalable using the features of redis, kafka and batch processing of data. 

# Key Updates
- Implemented Redis Pub/Sub to enhance real-time communication and interaction between users.
- Utilized Kafka to ensure efficient data processing at the required rate, preventing data loss and ensuring reliability.
- Implemented batch processing of data, allowing for the efficient handling and processing of large volumes of data in groups, thereby improving system performance and resource management.


# High Level Design

![High Level Design](/assets/HLD.png)


# Flow Diagram 

- ## When user connects
![User establish connection](/assets/user_connect.png)

- ## When User1 sends message to User2
![User establish connection](/assets/message.png)



# Application Demo


https://github.com/Sumit0709/chat-app-2/assets/91677852/45cfae94-b418-4844-a175-d352c804b02e




# Setting up cassandra 

- Access the Cassandra container's terminal with `docker exec -it cassandra bash`
- enable cql with `cqlsh`

## Create KEYSPACE
```
CREATE KEYSPACE demo_test WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
```

## Create TABLE
```
CREATE TABLE IF NOT EXISTS devprivatechat (
    chat_id UUID,
    sender TEXT,
    receiver TEXT,
    message_id TEXT,
    message TEXT,
    type INT,
    preview TEXT,
    sent_at TIMESTAMP,
    received_at TIMESTAMP,
    seen_at TIMESTAMP,
    sequence INT,
    PRIMARY KEY (chat_id, message_id, sequence)
);
```

# Redis side Note

- If we want to access redis GUI to visualise data stored in redis we can use redis/redis-stack image 

```
redis:
    image: redis/redis-stack:7.2.0-v10
    container_name: redis
    ports:
      - "6379:6379"
      - "7000:8001"
```
- We will be able to access the redis GUI on `localhost:7000`


# Want to run this project?

## Prerequisite
- Docker

## Steps to follow

- `git clone https://github.com/Sumit0709/chat-app-2.git`
- run `docker-compose up` in terminal
- cd into frontend folder and do `npm start`
