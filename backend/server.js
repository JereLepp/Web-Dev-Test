const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let courses = [
  { name: 'Web Development', grade: '5' },
  { name: 'Database Systems', grade: '3' }
];

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Add new course
app.post('/api/courses', (req, res) => {
  const course = req.body;
  courses.push(course);
  res.status(201).json(course);
});

// Add these routes BEFORE app.listen()

// Update a course
app.put('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedCourse = req.body;
  if (id >= 0 && id < courses.length) {
    courses[id] = updatedCourse;
    res.json(updatedCourse);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < courses.length) {
    const deletedCourse = courses.splice(id, 1);
    res.json(deletedCourse[0]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});