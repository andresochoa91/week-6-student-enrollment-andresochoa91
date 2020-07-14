let studentsButton = document.querySelector("#students");
let coursesButton = document.querySelector("#courses");
let showInfo = document.querySelector("#show-info");
let studentsDropdown;
let coursesDropdown;
let studentsList;
let coursesList;
let students = {};
let courses = {};
let genIdCou = 0;
let genIdStu = 0;


class Student {
  constructor (name, lastName, status, courses=[], display="") {
    this.name = name;
    this.lastName = lastName;
    this.status = status;
    this.courses = courses;
  }
  addCourse (course) {
    this.courses.push(course);
    course.students.push(this);
  }
}

class Course {
  constructor (name, duration, students=[], display="") {
    this.name = name;
    this.duration = duration;
    this.students = students;
  }
  addStudent (student) {
    this.students.push(student);
    student.courses.push(this);
  } 
}

function getCourses () {
  fetch("https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Courses.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(course => {
      courses[genIdCou] = new Course(course.name, course.duration);
      genIdCou++;
    });
    getStudents();
  });
}

function getStudents () {
  fetch("https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(student => {
      students[genIdStu] = new Student(student.name, student.last_name, student.status);
      genIdStu++; 
    });
    generateCoursesDropdown();
    generateStudentsDropdown();
    generateCourses();
    generateStudents();
  });
}

function generateCoursesDropdown () {
  coursesDropdown = `<select><option>Add course</option>`;
  coursesDropdown += Object.entries(courses).reduce((acc, course) => {
    return acc += `<option onclick="addCourse(this)" value="course${course[0]}">${course[1].name}</option>`;
  }, "");
  coursesDropdown += `</select>`;
}

function generateStudentsDropdown () {
  studentsDropdown = `<select><option>Add student</option>`;
  studentsDropdown += Object.entries(students).reduce((acc, student) => {
    return acc += `<option onclick="addStudent(this)" value="student${student[0]}">${student[1].name} ${student[1].lastName}</option>`;
  }, "");
  studentsDropdown += `</select>`;
}

function generateCourses () {
  let coursesDisplayed = Object.entries(courses).reduce((acc, course) => {
    let dropdrop = [];
    let dds = `<select><option>Add student</option>`;    
    
    let showStudents = course[1].students.reduce((acc, student) => {
      dropdrop.push(`${student.name} ${student.lastName}`)
      return acc += `<p>${student.name} ${student.lastName}</p>`;
    }, "");

    Object.entries(students).forEach(s => {
      if (!dropdrop.includes(`${s[1].name} ${s[1].lastName}`)) {
        dds += `<option onclick="addStudent(this)" value="student${s[0]}">${s[1].name} ${s[1].lastName}</option>`;
      }
    })

    dds += `</select>`;

    return acc += `
      <div id="course${course[0]}" class="box">
        <h4>${course[1].name}, ${course[1].duration}</h4>      
        <div>
          ${showStudents}
        </div>
        ${dds}
      </div>
    `;
  }, "");


  coursesList = `
    <div class="cs-list">
      ${coursesDisplayed}
    </div>
  `;
}

function generateStudents () {
  let studentsDisplayed = Object.entries(students).reduce((acc, student) => {
    let dropdrop = [];
    let ddc = `<select><option>Add course</option>`;

    let showCourses = student[1].courses.reduce((acc, course) => {
      dropdrop.push(course.name)
      return acc += `<p>${course.name}</p>`;
    }, "");

    Object.entries(courses).forEach(c => {
      if (!dropdrop.includes(c[1].name)) {
        ddc += `<option onclick="addCourse(this)" value="course${c[0]}">${c[1].name}</option>`;
      }
    })

    ddc += `</select>`;

    return acc += `
      <div id="student${student[0]}" class="box">
        <h4>${student[1].name} ${student[1].lastName} <div class="circle ${student[1].status === true ? "green" : "red"}"></div></h4>      
        <div>
          ${showCourses}
        </div>
        ${ddc}
        <button>Edit info</button>
      </div>
    `;
  }, "");

  studentsList = `
    <div class="st-list">
      ${studentsDisplayed}
    </div>
  `;
}

function addCourse (element) {
  let studentId = element.parentElement.parentElement.id.split("student")[1];
  let courseId = element.value.split("course")[1];
  
  if (students[studentId].courses.length < 4 && courses[courseId].students.length < 3) {
    students[studentId].addCourse({...courses[courseId]});
    generateCoursesDropdown();
    generateStudentsDropdown();
    generateCourses();
    generateStudents();

    studentsButton.click();
    
  } else {
    alert(`Not avaliable`)
  }
}

function addStudent (element) {
  let studentId = element.value.split("student")[1];
  let courseId = element.parentElement.parentElement.id.split("course")[1];

  if (students[studentId].courses.length < 4 && courses[courseId].students.length < 3) {
    courses[courseId].addStudent({...students[studentId]});
    generateCoursesDropdown();
    generateStudentsDropdown();
    generateCourses();
    generateStudents();
    
    coursesButton.click();

  } else {
    alert(`Not avaliable`)
  }
}

studentsButton.addEventListener("click", () => showInfo.innerHTML = studentsList);
coursesButton.addEventListener("click", () => showInfo.innerHTML = coursesList);

getCourses();
