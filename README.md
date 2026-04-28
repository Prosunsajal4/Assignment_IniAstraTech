# Internship Assignment

## Mini Class Scheduling and Dashboard System

Teacher can create and manage slots. Student can view and book slots.

## Tech Used

- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MongoDB

## What Is Implemented

### Teacher Dashboard

- Teacher login with username and password
- Show teacher username
- Show total number of slots
- Add new slot (date and time)
- View all created slots

### Slot Rules

- Each slot is 15 minutes long
- Overlapping slots are blocked
- Past slots are blocked
- Slot status: Available / Booked

### Student View

- Student login with username and password
- View all available slots
- Book a slot
- Booked slot is removed from available list

### Data Handling

- Backend API with MongoDB (bonus requirement)

## How To Run

### 1. Start Backend

```bash
cd Backend
npm install
npm start
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open App

- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health

## Username and Password

Create accounts from UI.

Example test accounts:

- Teacher: username `teacher1`, password `pass123`
- Student: username `student1`, password `pass123`

## Repository Link

- Add your GitHub repository link here after pushing.

## Live Demo Link

- Add your deployed demo link here.

## Slot Conflict Handling

- Convert start/end time to minutes.
- For each existing slot on same teacher and date, check overlap using:
  - newStart < existingEnd AND newEnd > existingStart
- If true, reject slot creation.

## Project Structure

```text
Backend/
	index.js
	config.js
	db/
	models/
	routes/
	utils/

frontend/
	app/
	components/
	lib/
```
