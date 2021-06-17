DROP TABLE IF EXISTS password_reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_picture VARCHAR,
    bio VARCHAR (500),
    password VARCHAR (255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR REFERENCES users(email),
    code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships( 
  id SERIAL PRIMARY KEY, 
  sender_id INT REFERENCES users(id) NOT NULL, 
  recipient_id INT REFERENCES users(id) NOT NULL, 
  accepted BOOLEAN DEFAULT false);

CREATE TABLE chat_messages(
      id SERIAL PRIMARY KEY,
      message VARCHAR(500) NOT NULL,
      user_id INT REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE private_messages(
      id SERIAL PRIMARY KEY,
      message VARCHAR(1000) NOT NULL,
      sender_id INT REFERENCES users(id) NOT NULL, 
      recipient_id INT REFERENCES users(id) NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

