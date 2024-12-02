const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

const students = require("./data/students.js");

const port = 3000;

//Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

//Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/home");
app.set("view engine", "ejs");

//===========================MethodOverride==========================//
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//===========================Middleware==============================//
//app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use((req, res, next) => {
  console.log("-Middleware: I run for all routes");
  next();
});

app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-${time.toLocaleDateString()}: Received a ${req.method} request to ${
      req.url
    }`
  );
  // console.log(req.body);
  // console.log(Object.keys(req.body));
  // console.log(`${JSON.stringify(req.body)}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(req.body);
    console.log(Object.keys(req.body));
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});
//==========================================================================================================================//

app.listen(port, () => {
  console.log(`Port ${port} is up and running`);
});

app.get("", (req, res) => {
  res.render("index");
});

app.get("/students", (req, res) => {
  res.render("students", { students });
});

//==========================POST=====================================//

app.get("/enroll", (req, res) => {
  res.render("enroll");
});

app.post("/students", (req, res) => {
  const newStudent = {
    name: req.body.name,
    email: req.body.email,
    studentID: req.body.studentID,
    dateOfBirth: req.body.dateOfBirth,
    graduated: req.body.readyToEat === "on",
  };

  students.push(newStudent);
  res.redirect("/students");
});

//===========================Edit======================================//

app.get("/modify", (req, res) => {
  res.render("modify");
});

app.put("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students[studentId];

  student.name = req.body.name;
  student.email = req.body.email;
  student.studentID = req.body.studentID;
  student.dateOfBirth = req.body.dateOfBirth;
  student.graduated = req.body.graduated === "on";

  res.redirect("/students");
});

app.get("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const student = students[studentId];

  if (!student) {
    return res.status(404).send("Student not found");
  }

  res.render("modify", { student, studentId });
});

//=============================This always runs at the end======================================//
app.use((req, res) => {
  console.log(
    "I am only in this middleware if no other routes have sent a response"
  );
  res.status(404);
  res.json({ error: "Resources not found" });
});
