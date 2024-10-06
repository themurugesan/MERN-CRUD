// using express
const express = require("express");
const mongoose = require("mongoose");
const cors= require('cors')



// create an instance of express
const app = express();
app.use(express.json());
app.use(cors())

// let todos=[];
// connection mongodb

mongoose
  .connect("mongodb://127.0.0.1:27017/merb-app")
  .then(() => {
    console.log("DB Connected!!");
  })
  .catch((err) => {
    console.log(err);
  });

// craete shema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

// createing model
const todoModel = mongoose.model("Todo", todoSchema);

// create a new tods item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  // const newTodo={
  //     id:todos.length + 1,
  //     title,
  //     description
  // };
  // todos.push(newTodo);
  // console.log(todos);
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// GEe all items

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo item

app.put("/todos/:id", async(req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await todoModel.findByIdAndUpdate(id, { title, description },{new:true});

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});



// Delete a todo item
app.delete("/todos/:id",async(req,res)=>{
    try { 
      const { title, description } = req.body;
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
 
        
    }
   
})

// start a server

app.listen((port = 8000), () => {
  console.log("Server is listening to port " + port);
});
