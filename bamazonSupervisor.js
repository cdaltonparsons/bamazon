var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err, response) {
  if (err) throw err;  
  beginPrompt();
});

function beginPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View product sales by department", "Create a new department", "Exit"]
        }
    ]).then(function(userInput) {
        var action = userInput.action;
        switch(action) {
            case "View product sales by department":
                return salesByDept();
            case "Create a new department":
                return newDepartment();
            case "Exit":
                return exit();
            default:
                return;
        }
    });
};


function salesByDept() {
    connection.query("SELECT departments.id, departments.name, departments.overhead_costs, products.product_sales FROM departments INNER JOIN products ON departments.name = products.department_name GROUP BY products.name", function (err, res) {
        if(err) throw err;
        console.table(res)
    })
}


function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you would like to add?"
        },{
            type: "input",
            name: "overhead",
            message: "What are the total overhead costs of this department?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return "Sorry, this amount must be a number";
              }
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO departments SET ?", {
            name: answer.name,
            overhead_costs: answer.overhead
        }, function(err) {
            if (err) throw err;
            console.log("Department successfully added!");
            beginPrompt();
        })
    })
};

function exit() {
    console.log("Disconnecting");
    connection.end();
  };