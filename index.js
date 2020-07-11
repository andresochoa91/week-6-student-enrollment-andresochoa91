let studentsButton = document.querySelector("#students");
let coursesButton = document.querySelector("#courses");
let showInfo = document.querySelector("#show-info");
let studentsList = "";
let coursesList = "";
let students = [];
let courses = [];

class Student {
  constructor (name, lastName, status) {
    this.name = name;
    this.lastName = lastName;
    this.status = status;
  }
}

class Course {
  constructor (name, duration, students=[]) {
    this.name = name;
    this.duration = duration;
    this.students = students;
  }
}

const generateStudents = (st) => {
  st.forEach(student => {
    
    studentsList += `
      <div class="box">
        <h4>${person.name} ${person.last_name}, ${person.status}</h4>      
        <p>course1</p>
        <p>course2</p>
        <button>Add course</button>
        <button>Edit info</button>
      </div>
    `;

  })
}

fetch("https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json")
.then(response => response.json())
.then(data => {
  data.forEach(student => {
    students.push(new Student(student.name, student.last_name, student.status)) 
  });
  generateStudents(students);
});
console.log(students)

fetch("https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Courses.json")
.then(response => response.json())
.then(data => {
  data.forEach(course => {
    courses.push(new Course(course.name, course.duration)); 
    /* coursesList += `
      <div class="box">
        <h4>${course.name}, ${course.duration}</h4>      
        <p>Student 1</p>
        <p>Student 2</p>
        <button>Add student</button>
      </div>
    `; */
  });
});
console.log(courses)



studentsButton.addEventListener("click", () => showInfo.innerHTML = studentsList);
coursesButton.addEventListener("click", () => showInfo.innerHTML = coursesList);

