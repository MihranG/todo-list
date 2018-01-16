const express = require("express");
const cookieParser = require('cookie-parser');
const path = require ('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

let todos = [{
    id:1,
    action: 'test action'
}];
let todosId = todos.length;

 
app.use(cookieParser());
app.use(bodyParser());
app.use(expressValidator());

app.set('view engine','pug');


app.get ('/',(req,res)=>{
    
    console.log('pug is rendered');
    res.render ('todo',{todos});
   


});

app.post('/', (req,res)=>{
    

    req.checkBody('action').notEmpty().withMessage('you need to write an action');
    const errors = req.validationErrors();
    if (errors) {
        res.render('todo', {errors});
    } else {

        const action = req.body.action;
        
        let id = todosId;

        todos.push({
            'id' : id, 
            'action' : action,
        }); 

        todosId++;

        console.log(todos);
        
        res.render('todo',{todos,});

    }
    res.end();


});





app.get('/edit/:id', (req, res) => {
    
    const todo = todos.find((element) => {
      return element.id == req.params.id;
     });
    res.render('edit', {todo});
});


app.post('/edit/:id', (req,res)=>{
    

    
        //res.render('todo');
    

        const editableTodo = req.params.id;
        
        todos[editableTodo].action = req.body.action;
        
        res.redirect('/');

        //console.log(todos.editableTodo.action)

    
    res.end();


});


app.get('/del/:id', (req,res)=>{

    const deletableTodo = req.params.id;

    todos.splice(deletableTodo,1);

    res.redirect('/');

})






app.listen(3000,()=>{
    console.log("server is ready for use");

})