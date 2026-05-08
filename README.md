# Library Test Back

Backend NestJS para practicar un modelo simple de biblioteca.

## Modelo

- `Book`: catálogo del libro.
- `BookCopy`: copia física disponible/prestada/dañada/perdida.
- `User`: usuario de la biblioteca.
- `LoanRequest`: solicitud de préstamo sobre una copia concreta.
- `Loan`: préstamo efectivo de una copia a un usuario.
- `PenaltyType`: catálogo de tipos de multa.
- `Penalty`: multa asociada a un préstamo.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

El proyecto usa PostgreSQL. Ajusta `.env` según tu base local:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=library
DB_SYNCHRONIZE=true
```

`DB_SYNCHRONIZE=true` está pensado solo para practicar, porque TypeORM crea/actualiza tablas automáticamente.

## Endpoints

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /books`
- `GET /books`
- `GET /books/:id`
- `PATCH /books/:id`
- `DELETE /books/:id`
- `POST /book-copies`
- `GET /book-copies`
- `GET /book-copies/:id`
- `PATCH /book-copies/:id`
- `DELETE /book-copies/:id`
- `POST /loan-requests`
- `GET /loan-requests`
- `GET /loan-requests/:id`
- `PATCH /loan-requests/:id`
- `DELETE /loan-requests/:id`
- `POST /loans`
- `GET /loans`
- `GET /loans/:id`
- `PATCH /loans/:id`
- `DELETE /loans/:id`
- `POST /penalty-types`
- `GET /penalty-types`
- `GET /penalty-types/:id`
- `PATCH /penalty-types/:id`
- `DELETE /penalty-types/:id`
- `POST /penalties`
- `GET /penalties`
- `GET /penalties/:id`
- `PATCH /penalties/:id`
- `DELETE /penalties/:id`

## Flujo Para Probar

1. Crear un `Book`.
2. Crear una o más `BookCopy` usando el `bookId`.
3. Crear un `User`.
4. Crear una `LoanRequest` usando `userId` y `bookCopyId`.
5. Crear un `Loan` usando `userId` y `bookCopyId`.
6. Crear un `PenaltyType`.
7. Crear una `Penalty` usando `loanId` y `typeId`.
