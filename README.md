# test_bet_provider

## Структура проекта

- **/provider** - Сервис, предоставляющий информацию о событиях.
- **/bet_platform** - Сервис, принимающий ставки на эти события от пользователей..
- **/prisma** - Папка с конфигурациями базы данных и миграциями.
- **/tests** - Папка с тестами.
- **docker-compose.yml** - Конфигурация для запуска всех сервисов в контейнерах Docker.
- **.env** - Файл с переменными окружения для настройки приложения.

## Установка

1. Клонируйте репозиторий:

   ```bash
   git clone <URL_репозитория>
   cd <папка_репозитория>
   ```

2. Убедитесь, что у вас установлены [Docker](https://www.docker.com/get-started) и [Docker Compose](https://docs.docker.com/compose/).

3. Настройте файл `.env`:

4. Запустить приложение:
   ```bash
   docker-compose up --build
   ```

## Использование

После успешного запуска вы можете получить доступ к вашим сервисам через браузер или с помощью инструментов вроде Postman по следующим адресам:

- [http://localhost:3001](http://localhost:3001) - для сервиса provider.
- [http://localhost:3002](http://localhost:3002) - для сервиса bet_platform.

## Структура API

### Provider Service

- **GET /events** - Получить список всех событий.
- **POST /events** - Создать новое событие.
  - **Тело запроса**:
    ```json
    {
      "coefficient": 1.5,
      "deadline": 1727694022
    }
    ```
- **PUT /events/:id** - Обновить статус существующего события.
    - `id` (строка): ID события.
  ```json
  {
    "status": "first_team_won"
  }
  ```

### Bet Platform Service

- **GET /events** - Получить список всех событий с учетом deadline.
- **GET /bets** - Получить историю всех сделанных ставок.
- **POST /bets** - Совершает ставку на событие.

  - **Тело запроса**:
    ```json
    {
      "eventId": "event2",
      "amount": 100.0
    }
    ```

**Запуск Provider Service**:
  ```bash
  npm run start:provider
  ```

**Запуск Bet Platform Service**:
  ```bash
  npm run start:bets_platform
  ```
  
**Запуск Provider Service и Provider Service**:
  ```bash
  npm run start:all
  ```

**Запуск тестов**:
  ```bash
  npm run test
  ```
