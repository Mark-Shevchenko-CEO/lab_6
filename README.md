# Лабораторна робота 6 — File-Based Persistence

## Завдання 6.1 Читання файлу (file_read.js)

Сервер читає `data.json` і повертає його вміст через `GET /data`.

**Запуск:**

node file_read.js 3000

**Перевірка:**

curl http://127.0.0.1:3000/data

- `200` — якщо `data.json` валідний
- `400` / `500` — якщо файл відсутній або не є валідним JSON

## Завдання 6.2 Запис файлу (file_write.js)

Сервер приймає JSON-тіло через `POST /data` і зберігає його у `data.json`.

**Запуск:**

node file_write.js 3000

**Перевірка:**

curl -X POST http://127.0.0.1:3000/data -H "Content-Type: application/json" -d "{\"name\":\"test\"}"

- `200` — якщо тіло валідне
- `400` — якщо тіло не є валідним JSON

## Завдання 6.3 Оновлення запису (file_update.js)

Сервер оновлює об'єкт у `data.json` за `id` через `PUT /data/:id`.

**Запуск:**

node file_update.js 3000

**Перевірка:**

curl -X PUT http://127.0.0.1:3000/data/2 -H "Content-Type: application/json" -d "{\"name\":\"Updated\"}"

- `200` — об'єкт знайдено та оновлено
- `404` — об'єкт з таким `id` не існує
- `400` — тіло запиту не є валідним JSON
- `500` — файл `data.json` відсутній

## Завдання 6.4 Видалення запису (file_delete.js)

Сервер видаляє об'єкт з `data.json` за `id` через `DELETE /data/:id`.

**Запуск:**

node file_delete.js 3000

**Перевірка:**

curl -X DELETE http://127.0.0.1:3000/data/2

- `200` — об'єкт знайдено та видалено
- `404` — об'єкт з таким `id` не існує
- `400` — `data.json` містить невалідний JSON
- `500` — файл `data.json` відсутній
