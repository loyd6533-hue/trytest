const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class User {
  constructor() {
    this.dbPath = path.join(__dirname, '../database.json');
    this.db = new Low(new JSONFile(this.dbPath));
    this.init();
  }

  async init() {
    await this.db.read();
    this.db.data ||= { users: [] };
    await this.db.write();
  }

  async create(userData) {
    await this.db.read();
    const user = { id: uuidv4(), ...userData, createdAt: new Date().toISOString() };
    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }

  async findByEmail(email) {
    await this.db.read();
    return this.db.data.users.find(user => user.email === email);
  }

  async findById(id) {
    await this.db.read();
    return this.db.data.users.find(user => user.id === id);
  }
}

module.exports = new User();