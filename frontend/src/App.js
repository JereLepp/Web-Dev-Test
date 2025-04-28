import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '' });
  const [editingId, setEditingId] = useState(null);
  const [editCourse, setEditCourse] = useState({ name: '', grade: '' });

  // Fetch courses on component mount
  useEffect(() => {
    fetch('http://localhost:5001/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  // Add new course
  const handleAddCourse = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    })
      .then(res => res.json())
      .then(data => {
        setCourses([...courses, data]);
        setNewCourse({ name: '', grade: '' });
      })
      .catch(err => console.error(err));
  };

  // Edit existing course
  const handleEditCourse = (id) => {
    setEditingId(id);
    setEditCourse(courses[id]);
  };

  // Update course
  const handleUpdateCourse = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5001/api/courses/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCourse)
    })
      .then(res => res.json())
      .then(updatedCourse => {
        const updatedCourses = [...courses];
        updatedCourses[editingId] = updatedCourse;
        setCourses(updatedCourses);
        setEditingId(null);
      })
      .catch(err => console.error(err));
  };

  // Delete course
  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          setCourses(courses.filter((_, index) => index !== id));
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jere Leppiniemi</h1>
        <p>Group: NTIS22K</p>
        
        <h2>My Courses</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {editingId === index ? (
                <form onSubmit={handleUpdateCourse} className="edit-form">
                  <input
                    type="text"
                    value={editCourse.name}
                    onChange={(e) => setEditCourse({...editCourse, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    value={editCourse.grade}
                    onChange={(e) => setEditCourse({...editCourse, grade: e.target.value})}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  {course.name} - Grade: {course.grade}
                  <button onClick={() => handleEditCourse(index)}>Edit</button>
                  <button onClick={() => handleDeleteCourse(index)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <h2>Add New Course</h2>
        <form onSubmit={handleAddCourse}>
          <input
            type="text"
            placeholder="Course name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Grade"
            value={newCourse.grade}
            onChange={(e) => setNewCourse({...newCourse, grade: e.target.value})}
            required
          />
          <button type="submit">Add Course</button>
        </form>
      </header>
    </div>
  );
}

export default App;