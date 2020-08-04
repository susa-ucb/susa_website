DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

DROP TABLE IF EXISTS team;

CREATE TABLE team (
    position INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    summary TEXT NOT NULL,
    portrait TEXT NOT NULL,
    major TEXT NOT NULL,
    year TEXT NOT NULL,
    origin TEXT NOT NULL,
    classes TEXT NOT NULL,
    past_classes TEXT NOT NULL,
    semester TEXT NOT NULL
);

DROP TABLE IF EXISTS events;

CREATE TABLE events (
    event_date DATE PRIMARY KEY,
    event_name TEXT NOT NULL,
    fb_link TEXT DEFAULT 'TBA',
    location TEXT DEFAULT 'TBA',
    is_upcoming INTEGER DEFAULT 1
);
