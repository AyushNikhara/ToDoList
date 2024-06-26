import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
   name: "Welcome To The ToDo List"
 });

// const item2 = new Item({
//   name: "Hit + button to add new item"
// });

// const item3 = new Item({
//   name: "<-- Hit This To Delete Item"
// });

 const defaultItems = [item1];

const listSchema={
  name:String,
  items: [itemsSchema]
};

const List =mongoose.model("List",listSchema);

app.get("/", (req, res) => {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let today  = new Date();
  const day = today.toLocaleDateString("en-US", options);
  Item.find({}).then(function (foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
        .then(function () {
          console.log("Successfully saved into our DB.");
        })
        .catch(function (err) {
          console.log(err);
        });
      res.redirect("/");
    } else {
      res.render('index.ejs', { day:day, newItem: foundItems });
    }
  })
    .catch(function (err) {
      console.log(err);
    });
});


app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox;
  if (checkedItemId != undefined) {
    await Item.findByIdAndRemove(checkedItemId)
      .then(() => console.log(`Deleted ${checkedItemId} Successfully`))
      .catch((err) => console.log("Deletion Error: " + err));
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

