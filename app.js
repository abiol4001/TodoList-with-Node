const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const { List, Item, listSchema } = require("./model/list");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbURL = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@nodetuts.zrzd40b.mongodb.net/todoList?retryWrites=true&w=majority`;

mongoose
  .connect(dbURL)
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

let workItems = [];

const item1 = new List({
  name: "Get up to pray",
});
const item2 = new List({
  name: "Get some water to drink",
});
const item3 = new List({
  name: "Eat some food!",
});

const itemSchema = {
  name: String,
  items: [listSchema],
};

const defaultItems = [item1, item2, item3];
// List.insertMany([item1, item2, item3])
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

app.get("/", (req, res) => {
  let day = date();
  List.find().then((result) => {
    res.render("list", { listTitle: day, newListItems: result });
  });
});

app.post("/", function (req, res) {
  let newItem = req.body.item;
  let listName = req.body.list;
  

  const list = new List({
    name: newItem,
  });

  if (newItem.length === 0) {
    return;
  }
  let day = date();

  console.log(day.includes(listName));
  console.log(listName !== day);
   if(day.includes(listName)) {
    list
      .save()
      .then((result) => res.redirect("/"))
      .catch((err) => console.log(err));
  }
  else if (listName !== day) {
    Item.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(list);
      foundList.save()
      .then(result => res.redirect("/" + listName))
    });
  }
});

app.post("/delete", (req, res) => {
  List.findByIdAndDelete(req.body.checkbox).then((result) => res.redirect("/"));
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  Item.findOne({ name: customListName }).then((foundList) => {
    if (!foundList) {
      const item = new Item({
        name: customListName,
        items: defaultItems,
      });
      item.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  });
});

// app.post('/work', function(req, res) {

// })
