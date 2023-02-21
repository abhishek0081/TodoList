const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require("lodash");
// const date = require(`${__dirname}/date.js`)
mongoose.set('strictQuery', true);
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@${process.env.DB_CLUSTER}.${process.env.DB_AD}.${process.env.DB_NET}/${process.env.DB_DB}`, {useNewUrlParser:true,useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name:String
});
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Welcome to your ToDo List"
});
const item2 = new Item({
    name:"Hit the + Button to add new item"
});
const item3 = new Item({
    name:"<----Hit this to delete an item."
});

const defaultsItems = [item1,item2,item3];
// Item.find({},(err,item)=>{
//     if (err){
//         console.log(err);
//     }else
//     {item.forEach(element => {
//         console.log(element);
        
//     })};
// });

const listSchema ={
    name: String,
    items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);




app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.submit;
    const item = new Item({
        name:itemName
    });
    // console.log(listName);
    if (listName === "Today"){

        item.save();
        res.redirect("/")
    }else{
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect(`/${listName}`);
        })
    }
// if (req.body.submit ==='Work') {
//     workItems.push(item);
//     res.redirect("/work");
// }else{
//     item.push(item);
//     res.redirect("/");
// }
});

app.get("/",(req,res)=>{
    Item.find({},(err,elements)=>{
        if (elements.length === 0){
            Item.insertMany(defaultsItems,err=>{
            if (err){
                console.log(err);
            }else{
                console.log("Successfully saved the items");
            }
        });
        res.redirect("/");
        }else
        {res.render('list',{listTitle : "Today",newListItems : elements})}  
    });
    // const dateAndTime = date.getDate(); //day is on 0th index // time is on 1st index
    // res.render('list',{listTitle : "Today",newListItems : items})
});

app.get("/:topic",(req,res)=>{
    const newDirectory = _.capitalize(req.params.topic);
    
   
    // list.save();
    // let i = 0;
    if (newDirectory === "About"){
        res.render("about");
    }else
    {List.findOne({name:newDirectory},(err,result)=>{
        if (!err) {
            if (result ===  null) {
                // i+=1;
                // console.log(i);
                const list = new List({
                    name:newDirectory,
                    items:defaultsItems
                });
                list.save();
                res.redirect(`/${newDirectory}`);
            }else{
                // console.log(result);
                res.render('list',{listTitle: newDirectory,newListItems:result.items});
            }
            
        }
    })};

})

// app.post("/:topic",(req,res)=>{
//     const item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work")
// })

// app.get("/todolist/about",(req,res)=>{
//     res.render("about")
// });


app.post("/delete",(req,res)=>{
    const checkedBodyItem = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today"){
        Item.findByIdAndRemove(checkedBodyItem,err=>{
            if (err){
                console.log(err);
            }else{
                console.log(`deleted item`);
                res.redirect("/");
            }
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull: {items:{_id: checkedBodyItem}}},(err,result)=>{
            if(!err){
                res.redirect(`/${listName}`);
            }
        })
    }
    
})
app.listen(process.env.PORT || port,()=>console.log(`Server is up and runing on port ${port}`));