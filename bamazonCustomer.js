var mysql = require("mysql");
var inquirer = require("inquirer");
// consider adding npm pacakage cTable to remove index column
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err, response) {
  if (err) throw err;
  // going to need to call functions here to display the available products
  displayProducts();
  beginPrompt();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;
    console.table(response);
  });
}

function beginPrompt() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "itemSelect",
        type: "input",
        message:
          "Using the item id, which product would you like to purchase? Alternatively, type 'exit' to disconnect",
        validate: function(response) {
          var validIds = [];
          for (var i = 0; i < results.length; i++) {
            validIds.push(results[i].id);
          }
          if (validIds.includes(parseInt(response)) || response === "exit") {
            return true;
          } else {
            return "Please select an item from the table using the specified ID";
          }
        }
      })
      .then(function(response) {
        if (response.itemSelect === "exit") {
          console.log("Disconnecting");
          connection.end();
        } else {
          connection.query(
            "SELECT * FROM products WHERE ?",
            { id: response.itemSelect },
            function(err, results) {
              if (err) throw err;
              if (results[0].stock_quantity < 1) {
                console.log(`Sorry, ${results[0].name} is out of stock`);
                beginPrompt();
              } else {
                inquirer
                  .prompt({
                    type: "input",
                    name: "userQuantity",
                    message: `How many ${
                      results[0].name
                    }(s) would you like to purchase?`,
                    validate: function(value) {
                      if (
                        isNaN(value) === false &&
                        parseInt(value) <= results[0].stock_quantity &&
                        parseInt(value) > 0
                      ) {
                        return true;
                      } else {
                        return `Sorry, we do not have sufficient ${
                          results[0].name
                        }, please select a different amount`;
                      }
                    }
                  })
                  .then(function(response) {
                    var new_quantity =
                      results[0].stock_quantity -
                      parseInt(response.userQuantity);
                    var sales_total = (results[0].price * parseFloat(response.userQuantity).toFixed(2))
                    connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [{ stock_quantity: new_quantity, product_sales: results[0].product_sales + sales_total}, { id: results[0].id }],
                      function(err) {
                        
                        if (err) throw err;
                        displayProducts();
                        console.log(
                          `Your total is: $ ${sales_total}`
                        );
                        beginPrompt();
                      }
                    );
                  });
              }
            }
          );
        }
      });
  });
}
