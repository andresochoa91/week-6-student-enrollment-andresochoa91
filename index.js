let studentsButton = document.querySelector("#students");
let coursesButton = document.querySelector("#courses");
let showInfo = document.querySelector("#show-info");
let newStudentButton = document.querySelector("#new_student");
let modalButton = document.querySelector("#modal-button");
let modalContent = document.querySelector("#modal-content");
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


const getCourses = () => {
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


const getStudents = () => {
  fetch("https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(student => {
      students[genIdStu] = new Student(student.name, student.last_name, student.status);
      genIdStu++; 
    });
    generateInfo()
  });
}


const generateCoursesDropdown = () => {
  coursesDropdown = `<select><option>Add course</option>`;
  coursesDropdown += Object.entries(courses).reduce((acc, course) => {
    return acc += `<option onclick="addCourse(this)" value="course${course[0]}">${course[1].name}</option>`;
  }, "");
  coursesDropdown += `</select>`;
}


const generateStudentsDropdown = () => {
  studentsDropdown = `<select><option>Add student</option>`;
  studentsDropdown += Object.entries(students).reduce((acc, student) => {
    return acc += `<option onclick="addStudent(this)" value="student${student[0]}">${student[1].name} ${student[1].lastName}</option>`;
  }, "");
  studentsDropdown += `</select>`;
}


const generateCourses = () => {
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
      <div id="course${course[0]}" class="box p-3">
        <h4>${course[1].name}<br> <span class="badge badge-success">${course[1].duration}</span></h4>      
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


const generateStudents = () => {
  let studentsDisplayed = Object.entries(students).reduce((acc, student) => {
    let dropdrop = [];
    let ddc = `<select class="btn btn-outline-primary"><option>Add course</option>`;

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
      <div id="student${student[0]}" class="box p-3">
        <h4>${student[1].name} ${student[1].lastName} <div class="circle ${student[1].status === true ? "green" : "red"}"></div></h4>      
        <div>
          ${showCourses}
        </div>
        ${ddc}
        <button class="btn btn-primary" onclick="editInfoButton(this)">Edit info</button>
      </div>
    `;
  }, "");

  studentsList = `
    <div class="st-list">
      ${studentsDisplayed}
    </div>
  `;
}


const displayModalContent = (info) => {
  modalContent.innerHTML = info;
  modalButton.click();
}


const editInfoButton = (element) => {
  let fName = prompt("Enter your first name (keep blank to not do changes)");
  let lName = prompt("Enter your last name (keep blank to not do changes)");
  if (fName) students[element.parentElement.id.split("student")[1]].name = fName;
  if (lName) students[element.parentElement.id.split("student")[1]].lastName = lName;

  generateInfo()
  displayModalContent("Information updated successfuly")
  showList("students");
}


const newStudent = () => {
  let fName = prompt("Enter first name");
  while (!fName) {
    if (confirm("First name field is mandatory.\n\nTo continue adding new student, press OK.\n\nTo stop adding new student, press Cancel.\n\n")) {
      fName = prompt("Please add first name");
    } else {
      return; 
    }
  }

  let lName = prompt("Enter last name");
  while (!lName) {
    if (confirm("Last name field is mandatory.\n\nTo continue adding new student, press OK.\n\nTo stop adding new student, press Cancel.\n\n")) {
      lName = prompt("Please add last name");
    } else {
      return; 
    }
  }

  fetch("https://student-challenge-api.herokuapp.com/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: fName,
      last_name: lName
    })
  })
  .then(response => response.json())
  .then(data => {
    displayModalContent(data.message);
    students[genIdStu] = new Student(data.student.name, data.student.last_name, data.student.status);
    genIdStu++;
    generateInfo();
  })
  .catch("Not possible to add new student") 
}


const addCourse = (element) => {
  let studentId = element.parentElement.parentElement.id.split("student")[1];
  let courseId = element.value.split("course")[1];
  
  if (students[studentId].courses.length < 4 && courses[courseId].students.length < 3 && students[studentId].status === true) {

    students[studentId].addCourse(courses[courseId]);
    generateInfo()
    showList("students");
    
  } else if (students[studentId].status !== true) {
    displayModalContent("This student can't add courses");
  } else if (students[studentId].courses.length >= 4) {
    displayModalContent("This student can't add more courses");
  } else {
    displayModalContent("This course has the maximum number of students allowed");
  }
}


const addStudent = (element) => {
  let studentId = element.value.split("student")[1];
  let courseId = element.parentElement.parentElement.id.split("course")[1];

  if (students[studentId].courses.length < 4 && courses[courseId].students.length < 3 && students[studentId].status === true) {
    
    courses[courseId].addStudent(students[studentId]);
    generateInfo()
    
    showList("courses");

  } else if (students[studentId].courses.length >= 4) {
    displayModalContent("This student can't add more courses")
  } else if (students[studentId].status !== true) {
    displayModalContent("This student can't add courses");
  } else {
    displayModalContent("This course has the maximum number of students allowed");
  }
}


const showList = (list) => {
  if (list === "students") {
    showInfo.innerHTML = studentsList;
  } else {
    showInfo.innerHTML = coursesList;
  }
}

studentsButton.addEventListener("click", () => showList("students"));
coursesButton.addEventListener("click", () => showList("courses"));
newStudentButton.addEventListener("click", newStudent)


const generateInfo = () => {
  generateCoursesDropdown();
  generateStudentsDropdown();
  generateCourses();
  generateStudents();
  showList("students");

}

getCourses();
