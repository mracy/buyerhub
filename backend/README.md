# Real Estate Buyer Portal - Backend

## How to run the app

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

3. **Run the database migrations**:
   ```bash
   npm run migration:run
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Example flows

### Sign up → Login → Add Favorite
1. **Sign up**: Send a POST request to `/api/auth/register` with user details.
2. **Login**: Send a POST request to `/api/auth/login` to receive a JWT token.
3. **Add Favorite**: Use the JWT token to send a POST request to `/api/favorites` with the property ID.
