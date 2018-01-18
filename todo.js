const express = require("express");
const cookieParser = require('cookie-parser');
const path = require ('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const url =  "mongodb://localhost:27017/tododb"


var mongoose = require('mongoose');



function connectToDB(ext){

    

}

function addToDB(newTodo){

    
    MongoClient.connect(url, (err,db)=>{

        if (err) throw err;
        console.log(" inside dateBaseDatabase !");
        
        let dbo = db.db("tododb");
        
        
     
    
    
    //dbo = db.db("tododb");
    query = {
        
            
            action : newTodo
        
    }
    dbo.collection("todos").insert(query, function(err, res){
        if (err) throw err;
        console.log("Number of todos inserted: ");

      })
    db.close();
    })
}


function deleteFromDB(deletableTodo){

    MongoClient.connect(url, (err,db)=>{

        if (err) throw err;
        console.log(" inside dateBaseDelete!");    
        
        const query = {action : deletableTodo};
        const dbo = db.db("tododb");
        dbo.collection("todos").deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
        
        });
    

        db.close();
    })
}

function editFromDB(editableTodo,editableAction){
    MongoClient.connect(url, (err,db)=>{

        if (err) throw err;
        console.log(" inside dateBaseEdit!");
        
    
        
        const dbo = db.db("tododb");
        const query = {action : editableAction};
        const newValues = {action: editableTodo}
        
        dbo.collection("todos").updateOne(query, {$set: newValues}, function(err, obj) {
            if (err) throw err;
            console.log("query is "+ query.action);
           
        });
        db.close();
    })
        
}


function getFromDB(){
    MongoClient.connect(url, (err,db)=>{

        if (err) throw err;
        console.log(" inside dateBaseEdit!");
        
    
        
        const dbo = db.db("tododb");
        dbo.collection("todos").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            return result;
        
        });
        db.close();
    })
        
}







/**
 * 
 *------------------------------------end of datebase----------------------------
 */






const app = express();

let todos = [{
    id:0,
    action: 'test action'
}];




let todosId = todos.length;

 
app.use(cookieParser());
app.use(bodyParser());
app.use(expressValidator());
app.use(bodyParser.json());

app.set('view engine','pug');
app.use(express.static(__dirname + '/public'));



app.get ('/',(req,res)=>{
    
    console.log('html is rendered');
    res.sendFile(__dirname +'/index.html');
   


});

app.get ('/api/todos', (req,res)=>{

    console.log('api/todos API ');


    
    res.send({todos});
    //res.send({getFromDB();});


})

app.post('/', (req,res)=>{
    

    req.checkBody('action').notEmpty().withMessage('you need to write an action');
    const errors = req.validationErrors();
    if (errors) {
        errors.forEach(error=>{
            res.send(error.msg);
        })
    } else {

        const action = req.body.action;
        
        let id = todosId;

        todos.push({
            'id' : id, 
            'action' : action,
        }); 

        addToDB(action);

        todosId++;

        console.log(todos);
        
        res.redirect('/');

    }
    res.end();


});


app.post('/api/todos', (req,res)=>{
    

    

        const action = req.body.action;
        
        let id = todosId;

        todos.push({
            'id' : id, 
            'action' : action,
        }); 

        todosId++;

        console.log(todos);
        
        res.redirect('/');

    
    res.end();


});




app.get('/edit/:id', (req, res) => {
    
    const todo = todos.find((element) => {
      return element.id == req.params.id;
     });
    res.render('edit', {todo});
});


app.put('/api/edit', (req,res)=>{
    

    
        //res.render('todo');

    

        const editableTodo = req.body.id;
        console.log("EDITABLE"+editableTodo);

        const editabletodoAction = req.body.action;


        
        
        

        let oldValue = req.body.oldVal;
        for (let i = 0; i<todos.length; i++){
            if(todos[i].id==editableTodo){
                console.log("ird is "+ i);
                
                todos[i].action = req.body.action;
                console.log(todos[i]);
            }
    
        }

        editFromDB(editabletodoAction,oldValue);

        res.send("editable todo was ");

        //console.log(todos.editableTodo.action)

    
    //res.end();


});





app.delete('/api/del', (req,res)=>{

    //console.log('inside of delete request');
    



    const deletableTodo = Number(req.body.id);

    const deletabletodoAction = req.body.action;


    console.log("deletabletodo is "+deletableTodo);

    deleteFromDB(deletabletodoAction);
    for (let i = 0; i<todos.length; i++){
        if(todos[i].id==deletableTodo){
            console.log(i);

            todos.splice(i , 1);

        }

    }
    
    

    

    
    console.log("todos after"+todos);
    res.send({ id: req.body.id});
    //res.redirect('/');


})








app.listen(3000,()=>{
    console.log("server is ready for use");

})