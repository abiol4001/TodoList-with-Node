const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set("view engine", "ejs");

let items = []
let workItems = [];
app.get("/", (req, res) => {
  
    let day = date()
    res.render("list", { listTitle: day, newListItems: items });
});

app.post('/', function(req, res) {
    let item = req.body.item

    if(item.length === 0) {
        return
    }

    if(req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
         items.push(item);
         res.redirect("/");
    }
        

    
})

app.get('/work', function(req, res) {
    res.render('list', {listTitle: "Work List", newListItems: workItems})
})

// app.post('/work', function(req, res) {

// })

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
