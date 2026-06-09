'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`
       CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('VIEWER', 'ADMIN') DEFAULT 'VIEWER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);

      await q(`
       CREATE TABLE library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_manga (user_id, mangadex_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
      `);

      await q(`
        CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_id VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),

    UNIQUE KEY unique_rating (user_id, mangadex_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
      `);

      await q(`
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_id VARCHAR(50) NOT NULL,
    mangadex_chapter_id VARCHAR(50) NOT NULL,
    page INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_progress (user_id, mangadex_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
      `);

      await q(`
        CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_chapter_id VARCHAR(50) NOT NULL,

    UNIQUE KEY unique_like (user_id, mangadex_chapter_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

      `);

      await q(`
       CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_id VARCHAR(50) NOT NULL,
    mangadex_chapter_id VARCHAR(50) NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
      `);

      await q(`
        CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mangadex_id VARCHAR(50) NOT NULL,
    mangadex_chapter_id VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
        `);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`DROP TABLE users;`);
      await q(`DROP TABLE comments;`);
      await q(`DROP TABLE library;`);
      await q(`DROP TABLE history;`);
      await q(`DROP TABLE likes;`);
      await q(`DROP TABLE progress;`);
      await q(`DROP TABLE ratings;`);

    });
  },
};
