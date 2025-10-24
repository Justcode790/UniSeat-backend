# UniSeat Backend API

## Setup and Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your MongoDB URI and other configurations.

4. Start MongoDB service (if not running):
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (admin only)

### Blocks
- `GET /api/blocks` - Get all blocks
- `GET /api/blocks/:id` - Get block by ID
- `POST /api/blocks` - Create new block
- `PUT /api/blocks/:id` - Update block
- `DELETE /api/blocks/:id` - Delete block

### Floors
- `GET /api/blocks/:blockId/floors` - Get floors for a block
- `POST /api/blocks/:blockId/floors` - Create floor in block
- `PUT /api/floors/:id` - Update floor
- `DELETE /api/floors/:id` - Delete floor

### Classrooms
- `GET /api/classrooms` - Get all classrooms
- `GET /api/classrooms/:id` - Get classroom by ID
- `POST /api/classrooms` - Create new classroom
- `PUT /api/classrooms/:id` - Update classroom
- `DELETE /api/classrooms/:id` - Delete classroom

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student or upload CSV
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create new exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Seat Plans
- `POST /api/exams/:examId/generate-seatplan` - Generate seat plan for exam
- `GET /api/exams/:examId/seatplan` - Get seat plan for exam

## Example API Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uniseat.local","password":"Admin@123"}'
```

### Create Block
```bash
curl -X POST http://localhost:5000/api/blocks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Block A","location":"Main Campus","totalFloors":3}'
```

### Create Classroom
```bash
curl -X POST http://localhost:5000/api/classrooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"floor":"<floor_id>","name":"Room 101","capacity":50,"layoutType":"standard"}'
```

### Upload Students CSV
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer <token>" \
  -F "file=@students.csv"
```

### Create Exam
```bash
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Mid Term Exam","date":"2024-01-15","subject":"Computer Science","branch":"CSE","year":2}'
```

### Generate Seat Plan
```bash
curl -X POST http://localhost:5000/api/exams/<exam_id>/generate-seatplan \
  -H "Authorization: Bearer <token>"
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify MongoDB is accessible on default port 27017

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill process using port 5000: `lsof -ti:5000 | xargs kill -9`

3. **JWT Token Errors**
   - Ensure JWT_SECRET is set in .env
   - Check token format in Authorization header: `Bearer <token>`

4. **CORS Issues**
   - Backend is configured to allow frontend origin (http://localhost:5173)
   - Check if frontend URL matches CORS configuration

## Demo Walkthrough

1. Start MongoDB service
2. Run `npm run seed` to populate database
3. Run `npm run dev` to start backend
4. Login with admin credentials: `admin@uniseat.local` / `Admin@123`
5. Create exam or use seeded exam
6. Generate seat plan for the exam
7. View seat plan visualization in frontend
