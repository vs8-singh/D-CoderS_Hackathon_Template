var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/food",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"));
app.set("view engine","ejs");

//SCHEMA SETUP
var foodSchema = new mongoose.Schema({
    khana: String,
    type: String,
    price: Number,
    image: String,
    description: String
});
var food = mongoose.model("food", foodSchema);

var custSchema = new mongoose.Schema({
    user: String,
    pwd: String,
    contact: String,
    email: String,
});
var customer = mongoose.model("customer", custSchema);
// food.create({khana:'Aloo Mutter', 
//             type: 'veg', price: '60', 
//             image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/02/Punjabi-Aloo-Matar-Recipe.jpg'}, function(err, food){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Newly created dish");
//         console.log(food);
//     }
// });
var cart = [];
var cook = {name: 'steww', password:'randi'};
var manager = {name: 'appu', password:'fizz'};
//Databases
var userd = [{user: 'vs', pwd:'123', contact: '708020908', email:'jhlabf@gmail.com'},
            {user: 'garima', pwd:'456',contact: '708020908',email:'jhlabf@gmail.com'}];
var fb = [{user:'vs', title:'Hygiene', feedback:'Poor Hygiene'},
            {user:'garima', title:'Non-Veg', feedback:'Kindly remove non veg from your menu please!!'}];
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
            res.redirect('/menu');
        }
    }
});

// signup
app.get('/signup',function(req,res){
    res.render('signup');
});
app.post('/signup',function(req,res){
    userd.push({user: req.body.username, pwd: req.body.password, contact: req.body.contact, email: req.body.email});
    res.redirect('/menu');
});
//menu
app.get('/menu', function(req,res){
    food.find({}, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render('menu',{food: food, name: req.params.id, cart: cart});
        }
    })
})
app.get('/menu/vegmenu', function(req,res){
    food.find({}, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render('vegmenu',{food: food, name: req.params.id, cart: cart});
        }
    })
});
app.get('/menu/drinksgmenu', function(req,res){
    food.find({}, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render('drinksgmenu',{food: food, name: req.params.id, cart: cart});
        }
    })
})
app.get('/menu/nonvegmenu', function(req,res){
    food.find({}, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render('nonvegmenu',{food: food, name: req.params.id, cart: cart});
        }
    })
})
app.get('/menu/dessertmenu', function(req,res){
    food.find({}, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render('dessertmenu',{food: food, name: req.params.id, cart: cart});
        }
    })
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
app.post('/cookpage',function(req,res){
    var newDish = {khana:req.body.food, type:req.body.type, price:req.body.price, image:req.body.image, description:req.body.desc};
    food.create(newDish, function(err, newDish){
        if(err){
            console.log(err);
        }else{
            res.redirect('/menu');
        }
    });
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
    console.log("Conected!!");
});