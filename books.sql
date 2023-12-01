CREATE TABLE books(
    id INT,
    title VARCHAR,
    authorName VARCHAR,
    rating FLOAT,
    ratingCount INT,
    reviewCount INT,
    description TEXT,
    pages INT,
    dateOfPublish DATE,
    editionLanguage TEXT,
    price FLOAT,
    onlineStores TEXT
);

PRAGMA TABLE_INFO(books);

SELECT *
FROM books;