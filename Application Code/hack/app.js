var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(express.static("public"));
app.set("view engine","ejs");

var cart = [];
var cook = {name: 'steww', password:'randi'};
var manager = {name: 'appu', password:'fizz'};
//Databases
var userd = [{user: 'vs', pwd:'123'},
            {user: 'garima', pwd:'456'}];
var fb = [{user:'vs', title:'Hygiene', feedback:'Poor Hygiene'},
            {user:'garima', title:'Non-Veg', feedback:'Kindly remove non veg from your menu please!!'}];
var food = [{khana:'Kadhai Paneer', type: 'veg', price: '75', image: 'https://i0.wp.com/vegecravings.com/wp-content/uploads/2016/08/kadai-paneer-gravy-recipe-step-by-step-instructions.jpg?w=1612&quality=65&strip=all&ssl=1'},
            {khana:'Aloo Mutter', type: 'veg', price: '60', image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/02/Punjabi-Aloo-Matar-Recipe.jpg'},
            {khana:'Chicken Tandoori', type: 'non-veg', price: '105', image: 'https://dinnerthendessert.com/wp-content/uploads/2018/03/Tandoori-Chicken-4-688x1032.jpg'},
            {khana:'Murg Punjabi', type: 'non-veg', price: '110', image: 'https://lh5.googleusercontent.com/-rzDrCxRw7ig/ToB_lvEejVI/AAAAAAAAHvs/TiKFkebc5cc/s640/Punjabi%2520Chicken%2520Bhuna-1.jpg'},
            {khana:'Chocolate Shake', type: 'drinks', price: '60', image: 'https://nordicfoodliving.com/wp-content/uploads/2014/09/Recipe-for-Nordic-Healthy-Banana-and-Chocolate-Shake-683x1024.jpg'},
            {khana:'Watermelon Blast', type: 'drinks', price: '80', image: 'https://i0.wp.com/happywelllifestyle.com/media/cooling-watermelon-lime.jpg?w=960&ssl=1'},
            {khana:'Hot Sizzling Brownie', type: 'dessert', price: '115', image: 'https://cookingshooking.com/wp-content/uploads/2018/07/Sizzling-Brownie.jpg'},
            {khana:'Double Chocolate Pan Cake', type: 'dessert', price: '160', image: 'http://kitchenrunway.com/wp-content/uploads/2010/02/Chocolate-Pancakes-41-630x1024.jpg'}];
app.use(bodyparser.urlencoded({extended:true}));
app.get('/',function(req,res){
    res.render('home');
});


//Routes
// login
app.get('/login',function(req,res){
    res.render('login');
});
app.post('/login',function(req,res){
    var name= req.body.username;
    var pwd = req.body.password;
    for(var i = 0; i<userd.length; i++){
        if(name === userd[i]['user'] && pwd === userd[i]['pwd']){
            res.redirect('/menu/:'+name);
        }
    }
});

// signup
app.post('/signup',function(req,res){
    userd.push({user: req.body.username, pwd: req.body.password, contact: req.body.contact, email: req.body.email});
    for(var i = 0; i<userd.length; i++){
        console.log(userd[i]['user']);
    }
    res.redirect('/menu/'+req.body.username);
});
app.get('/signup',function(req,res){
    res.render('signup');
});

//menu without login
app.get('/menu', function(req,res){
    res.render('menu',{food: food, name: req.params.id,});
})
app.get('/menu//vegmenu', function(req,res){
    res.render('vegmenu',{food: food, name: req.params.id,});
});
app.get('/menu//drinksgmenu', function(req,res){
    res.render('drinksgmenu',{food: food, name: req.params.id,});
})
app.get('/menu//nonvegmenu', function(req,res){
    res.render('nonvegmenu',{food: food, name: req.params.id,});
})
app.get('/menu//dessertmenu', function(req,res){
    res.render('dessertmenu',{food: food, name: req.params.id,});
})
//menu after login
app.get('/menu/:id/menu',function(req,res){
    res.render('menu',{food: food, name: req.params.id,});
});
app.get('/menu/:id',function(req,res){
    res.render('menu',{food: food, name: req.params.id});
});
app.post('/menu/:id',function(req,res){
        console.log(req.body.food+" - "+req.body.price);
      cart.push({food: req.body.food, price:req.body.price, quantity:req.body.quantity});
  });
app.get('/menu/:id/vegmenu',function(req,res){
    res.render('vegmenu',{food: food, name: req.params.id});
});
app.get('/menu/:id/nonvegmenu',function(req,res){
    res.render('nonvegmenu',{food: food, name: req.params.id});
});
app.get('/menu/:id/drinksgmenu',function(req,res){
    res.render('drinksgmenu',{food: food, name: req.params.id});
});
app.get('/menu/:id/dessertmenu',function(req,res){
    res.render('dessertmenu',{food: food, name: req.params.id});
});
//cook and manager
app.get('/cook', function(req,res){
    res.render('cook', {cook: cook});
});
app.post('/cook',function(req,res){
    var info = {name: req.body.username, password: req.body.password};
    if(info['name'] === cook['name'] && info['password'] === cook['password']){
        res.redirect('/cookpage');
    }
    else{
        res.send('wrong username or password');
    }
});
app.get('/cookpage', function(req,res){
    res.render('cookpage', {cook: cook});
});
app.post('/manager',function(req,res){
    var info1 = {name: req.body.username, password: req.body.password};
    if(info1['name'] === manager['name'] && info1['password'] === manager['password']){
        res.redirect('/manpage');
    }
    else{
        res.send('wrong username or password');
    }
});
app.get('/manpage', function(req,res){
    res.render('manpage', {manager: manager});
});
app.get('/manager', function(req,res){
    res.render('manager', {manager: manager});
});
//feedback 
app.get('/menu/:id/feedback',function(req,res){
    res.render('feedback');
});
app.post('/menu/:id/feedback',function(req,res){
    fb.push({user: req.params.id, title: req.body.title, feedback: req.body.feedback});
    for(var i = 0; i< fb.length; i++){
        console.log(fb[i]['user']+" : "+fb[i]['feedback']);
    }
    res.redirect('/menu/:id');
});
app.get("*",function(req,res){
    res.send('Sorry, page not found... What are you doing with your life??');
});
app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log("Conected!!")
});