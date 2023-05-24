import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const results = this.#database[table] ?? []

    return results;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex == -1) {
      throw new Error(`Not found corresponding on ${table}`)
    }

    const oldData = this.#database[table][rowIndex]
    this.#database[table][rowIndex] = { id, ...oldData, ...data }
    this.#persist()
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex == -1) {
      throw new Error(`Not found corresponding on ${table}`)
    }

    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}