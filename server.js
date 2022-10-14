const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');

//inquirer questions 
const startMenuQuestion = [
    {
        type: 'list',
        name: 'startMenuQuestion',
        message: 'Where do you want to go ?',
        choices: [
            'Show all Roles',
            'Add a Role',
            'Show all Departments',
            'Add a Department',
            'Show all Employees',
            'Add an Employee',
            'Update an Employees Role'
        ]
    }
]

const addRoleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of your new role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the new roles salary?(numbers only please)'
    },
    {
        type: 'input',
        name: 'department',
        message: 'What department is this role in?'
    }
]

const addDepartmentQuestion = [
    {
        type: 'input',
        name: 'name',
        message: 'What department would you like to add?'
    }
]

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the new employee first name?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the new employee last name?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What role will the new employee have?'
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'Who is the new employee manager?'
    }
]

const chooseEmployeeUpdate = [
    {
        type: 'input',
        name: 'employee_id',
        message: 'Which employee would you like to update?'
    }
]

const updateEmployeeRoleQuestion = [
    {
        type: 'input',
        name: 'role_id',
        message: 'What new role would you like for your employee?'
    }
]

const addRole = async () => {
    const result = await inquirer.prompt(addRoleQuestions);
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [result.title, result.salary, result.department];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        consoleTable(results);
    });
    startMenu();
}

const addDepartment = async () => {
    const result = await inquirer.prompt(addDepartmentQuestion);
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [result.name];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        consoleTable(results);
    });
    startMenu();
}

const addEmployee = async () => {
    const result = await inquirer.prompt(addEmployeeQuestions);
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
    const params = [result.first_name, result.last_name, result.role_id, result.manager_id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        consoleTable(results);
    });
    startMenu();
}

const chooseEmployee = async () => {
    const result = await inquirer.prompt(chooseEmployeeUpdate);
    const sql = `SELECT role_id, role_title FROM role`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        consoleTable(results);
    });
    updateEmployeeRole(result.employee_id);
}

const updateEmployeeRole = async (employeeID) => {
    const result = await inquirer.prompt(updateEmployeeRoleQuestion)
    const sql = `UPDATE employee SET role_id = ${result.role_id}
    WHERE id = ${employeeID}`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        consoleTable(results);
    });
    startMenu();
}

const startMenu = async() => {
    const result = await inquirer.prompt(startMenuQuestion)
    .then(function(result) {
      switch (result.startMenuQuestion) {
        case "Show all Roles":
          db.query('SELECT role.id, role.title, role.salary, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
            console.log("");
            console.table(results);
          });
          startMenu();
          break;
        
        case "Add a Role":
          db.query('SELECT * FROM department', function (err, results) {
            console.log("");
            console.table(results);
          });
          addRole();
          break;
  
        case "Show all Departments":
          db.query('SELECT * FROM department', function (err, results) {
            console.log("");
            console.table(results);
          });
          startMenu();
          break;
  
        case "Add a Department":
          addDepartment();
          break;
  
        case "Show all Employees":
          db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, results) {
            console.log("");
            console.table(results);
          });
          startMenu();
          break;
  
        case "Add an Employee":
          db.query('SELECT role.*, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
            console.log("");
            console.table(results);
          });
          db.query('SELECT employee.*, role.title AS role_title FROM employee LEFT JOIN role ON employee.role_id = role.id', function (err, results) {
            console.log("");
            console.table(results);
          });
          addEmployee();
          break;
  
        case "Update an Employee's role":
          db.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', function (err, results) {
            console.log("");
            console.table(results);
          });
          chooseEmployee();
          break;
      }
    });
  }
  
  // startApp function to welcome user and routes to main startMenu function as switchboard for app
  const startApp = async() => {
    console.log('Welcome to the Employee Tracker!');
    console.log('Please choose an option below to get started:');
  
    startMenu();
  }
  
    
  
  // calls startApp function to begin app
  startApp();



