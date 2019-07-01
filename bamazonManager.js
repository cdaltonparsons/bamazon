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
      inquirer.prompt({
          type: "list",
          name: "action",
          message: "Hello sir/madam.  Welcome to Bamazon's premier management app.  Please select one of the following actions to get started",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add a New Product"]
      })

  }


  function viewProducts() {
      console.log("view products")
  };

  function viewInventory () {
      console.log("view inventory")
  };

  function restock() {
      console.log("added to inventory")
  };

  function newProduct () {
      console.log("New product added")
  };