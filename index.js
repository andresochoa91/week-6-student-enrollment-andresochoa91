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
    this.display = display;
  }
  addCourse (course) {
    // this.display = "d-none";
    this.courses.push(course);
    // this.courses[this.courses.length - 1].display = "d-none";
    course.students.push(this);
  }
}

class Course {
  constructor (name, duration, students=[], display="") {
    this.name = name;
    this.duration = duration;
    this.students = students;
    this.display = display;
  }
  addStudent (student) {
    // this.display = "d-none";
    this.students.push(student);
    // this.students[this.students.length - 1].display = "d-none";
    // console.log(this.students[this.students.length - 1].display)
    // console.log(this)
    // console.log(courses)
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
    coursesDropdown = generateCoursesDropdown();
    studentsDropdown = generateStudentsDropdown();
    generateCourses();
    generateStudents();
  });
}

function generateCoursesDropdown (courseId) {
  let coursesDropdown = `<select><option>Add course</option>`;
  coursesDropdown += Object.entries(courses).reduce((acc, course) => {
    if (courseId !== course[0]) {
      return acc += `<option class="" onclick="addCourse(this)" value="course${course[0]}">${course[1].name}</option>`;
    }
  }, "");
  return coursesDropdown += `</select>`;
}

function generateStudentsDropdown (studentId) {
  let studentsDropdown = `<select><option>Add student</option>`;
  studentsDropdown += Object.entries(students).reduce((acc, student) => {
    if (studentId !== student[0]) {
      return acc += `<option class="" onclick="addStudent(this)" value="student${student[0]}">${student[1].name} ${student[1].lastName}</option>`;
    }
  }, "");
  return studentsDropdown += `</select>`;
}

function generateCourses (sDrop, courseId) {
  let coursesDisplayed = Object.entries(courses).reduce((acc, course) => {
    
    let showStudents = course[1].students.reduce((acc, student) => {
      return acc += `<p>${student.name} ${student.lastName}</p>`;
    }, "");

    return acc += `
      <div id="course${course[0]}" class="box">
        <h4>${course[1].name}, ${course[1].duration}</h4>      
        <div>
          ${showStudents}
        </div>
        ${course[0] === courseId ? sDrop : studentsDropdown}
      </div>
    `;
  }, "");


  coursesList = `
    <div class="cs-list">
      ${coursesDisplayed}
    </div>
  `;
}

function generateStudents (cDrop, studentId) {
  let studentsDisplayed = Object.entries(students).reduce((acc, student) => {
    let showCourses = student[1].courses.reduce((acc, course) => {
      return acc += `<p>${course.name}</p>`;
    }, "");

    return acc += `
      <div id="student${student[0]}" class="box">
        <h4>${student[1].name} ${student[1].lastName} <div class="circle ${student[1].status === true ? "green" : "red"}"></div></h4>      
        <div>
          ${showCourses}
        </div>
        ${student[0] === studentId ? cDrop : coursesDropdown}
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
    let cDrop = generateCoursesDropdown(courseId);
    let sDrop = generateStudentsDropdown(studentId);
    generateCourses(sDrop, courseId);
    generateStudents(cDrop, studentId);

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
    let cDrop = generateCoursesDropdown(courseId);
    let sDrop = generateStudentsDropdown(studentId);
    generateCourses(sDrop, courseId);
    generateStudents(cDrop, studentId);
    
    coursesButton.click();

  } else {
    alert(`Not avaliable`)
  }
}

studentsButton.addEventListener("click", () => showInfo.innerHTML = studentsList);
coursesButton.addEventListener("click", () => showInfo.innerHTML = coursesList);

getCourses();




// function generateStudents (id, info) {
//   return `
//     <div id="st${id}" class="box">
//       <h4>${info.name} ${info.lastName} <div class="circle ${info.status === true ? "green" : "red"}"></div></h4>      
//       <div id="course${id}">
//       </div>
//         ${select}
//       <button>Edit info</button>
//     </div>
//   `;
// }


// function generateCourses (id, info) {
//   let stud = info.students.reduce((acc, student) => {
//     return acc += `<p>${student.name} ${student.lastName}</p>`;
//   }, "");
//   return `
//     <div id="cse${id}" class="box">
//       <h4>${info.name}, ${info.duration}</h4>      
//       <div id="student${id}">
//         ${stud}
//       </div>
//       <select class="student-select"></select>
//     </div>  
//   `;
// }


// function couCou () {
//   coursesList = `<div class="st-list">`;
//   Object.entries(courses).forEach(course => {
//     select += `<option id="op${course[0]}" onclick="addCourse(this.parentElement.parentElement.children[1], ${course[0]})">${course[1].name}</option>`;
//     coursesList += generateCourses(course[0], course[1]);  
//   });
//   coursesList += `</div>`;
// }

// function stuStu () {
//   studentsList = `<div class="cs-list">`;
//   console.log(Object.entries(students))
//   Object.entries(students).forEach(student => {
//     select += `<option id="op${student[0]}" onclick="addCourse(this.parentElement.parentElement.children[1], ${student[0]})">${student[1].name} ${student[1].lastName}</option>`;
//     studentsList += generateCourses(student[0], student[1]);  
//   });
//   studentsList += `</div>`;
// }


// function addCourse (elem, id) {
//   console.log(id)
//   let sts = students[elem.parentElement.id.split("t")[1]];
//   let cses = sts.courses;

//   if (courses[id].students.length < 3 && students[elem.id.split("course")[1]].courses.length < 4) {
    
//     courses[id].students.push(sts);
//     cses.push(courses[id])
    
//     elem.parentElement.children[1].innerHTML = Object.entries(cses).reduce((acc, course) => {
//       return acc += `<p>${course[1].name}</p>`;
//     }, "");
    
//     studentsList = elem.parentElement.parentElement.innerHTML;
//     couCou();
  
//     elem.parentElement.children[2][id + 1].classList.add("d-none");  
  
//     if (elem.children.length >= 4) {
//       elem.parentElement.children[2].classList.add("d-none");
//     } else {
//       elem.parentElement.children[2].classList.remove("d-none");
//     }
//     studentsList = elem.parentElement.parentElement.innerHTML;
//   } else {
//     alert(`${courses[id].name} is not available anymore`);
//   }
// }


// function addStudent (elem, studentId) {
//   let elemId = elem.parentElement.id.split("cse")[1]; 
//   console.log(elemId, studentId);

  
//   if (courses[elemId].students.length < 4 && students[studentId].courses.length < 3) {

//     courses[elemId].addStudent(students[studentId]);
        
//     elem.parentElement.children[1].innerHTML = courses[elemId].students.reduce((acc, student) => {
//       return acc += `<p>${student.name} ${student.lastName}</p>`;
//     }, "");
    
//     coursesList = elem.parentElement.parentElement.innerHTML;
//     stuStu();
  
//     elem.parentElement.children[2][id + 1].classList.add("d-none");  
  
//     if (elem.children.length >= 4) {
//       elem.parentElement.children[2].classList.add("d-none");
//     } else {
//       elem.parentElement.children[2].classList.remove("d-none");
//     }
//     studentsList = elem.parentElement.parentElement.innerHTML;
//   } else {
//     alert(`${courses[id].name} is not available anymore`)
//   }    
// }



// studentsButton.addEventListener("click", () => showInfo.innerHTML = studentsList);

// coursesButton.addEventListener("click", () => {
//   showInfo.innerHTML = coursesList;
//   Array.from(document.querySelectorAll(".student-select")).forEach(student => {
//     student.innerHTML = studentOptions;
//   })
// });

