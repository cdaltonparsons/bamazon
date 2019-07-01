var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  beginPrompt();
});

function beginPrompt() {
  inquirer
    .prompt([{
      type: "list",
      name: "action",
      message:
        "Hello sir/madam.  Welcome to Bamazon's premier management app.  Please select one of the following actions to get started",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add a New Product",
        "Exit"
      ]
    }])
    .then(function(userInput) {
      var action = userInput.action;
      switch (action) {
        case "View Products for Sale":
          return viewProducts();
        case "View Low Inventory":
          return viewInventory();
        case "Add to Inventory":
          return restock();
        case "Add a New Product":
          return newProduct();
        case "Exit":
          return exit();
        default:
          return;
      }
    });
}

function viewProducts() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;
    console.table(response);
    beginPrompt();
  });
}

function viewInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(
    err,
    response
  ) {
    if (err) throw err;
    console.table(response);
    beginPrompt();
  });
}

function restock() {
  connection.query(
    "UPDATE products SET ? WHERE stock_quantity < 5",
    { stock_quantity: 50 },
    function(err, response) {
      if (err) throw err;
      console.log(`A new shipment has arrived!`);
      beginPrompt();
    }
  );
}

function newProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newName",
        message: "What is the name of the product you would like to add?"
      },
      {
        type: "input",
        name: "newDept",
        message: "What department does it belong in?"
      },
      {
        type: "input",
        name: "newPrice",
        message: "How much does it cost?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      },
      {
        type: "input",
        name: "newQuantity",
        message: "How many units are you adding?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }]
    )
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          name: answer.newName,
          department_name: answer.newDept,
          price: answer.newPrice,
          stock_quantity: answer.newQuantity
        },
        function(err) {
          if (err) throw err;
          console.log("Item successfully added!");
          beginPrompt();
        }
      );
    });
}

function exit() {
  console.log("Disconnecting");
  connection.end();
}
