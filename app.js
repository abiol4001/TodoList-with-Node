const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash')
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



const item1 = new List({
  name: "Welcome to your todolist!",
});
const item2 = new List({
  name: "Hit the + button to add a new item.",
});
const item3 = new List({
  name: "<-- Hit this to delete an item.",
});

const itemSchema = {
  name: String,
  items: [listSchema],
};

const defaultItems = [item1, item2, item3];

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
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
   
    let day = date()

    if(day.includes(listName)) {
        List.findByIdAndDelete(checkedItemId).then((result) => res.redirect("/"));
    } else if (listName !== day) {
        Item.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
            .then(result => res.redirect('/' + listName))
    }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

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


