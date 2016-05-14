var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitize")


mongoose.connect("mongodb://localhost/restfulblog_db");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

// SETUP BLOG ENTITY STRUCTURE & MODEL
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function(request, response){
  response.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(request, response){
  Blog.find({}, function(error, blogs){
    if(error){
      console.log(error);
    } else {
      response.render("index", {blogs:blogs})
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(request, response){
  response.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(request, response){
  var title = request.body.title;
  var content = request.body.body;
  var image = request.body.image;
  var newPost = {
    title: title,
    body: content,
    image: image
  }

  content = request.sanitize(content)
  Blog.create(newPost, function(error, newPost){
    if(error){
      console.log(error);
    } else {
      response.redirect("/blogs")
    }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(request, response){
  var id = request.params.id;

  Blog.findById(id, function(error, foundPost){
    if(error){
      console.log(error);
    } else {
      response.render("show", {post:foundPost})
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(request, response){
  var id = request.params.id;
  Blog.findById(id, function(error, foundPost){
    if(error){
      console.log(error);
    } else {
      response.render("edit", {post:foundPost})
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(request, response){
  var id = request.params.id;

  Blog.findByIdAndUpdate(id, request.body, function(error, foundPost){
    console.log(request.body)
    if(error){
      console.log(error);
    } else {
      response.redirect("/blogs/" + id);
    }
  });
});

// DELETE ROUTE
app.get("/blogs/:id", function(request, response){
  Blog.findByIdAndRemove(request.params.id, function(error){
    if(error){
      console.log(error)
    } else {
      response.redirect("/blogs");
    }
  })
});
// LETS GET THE SERVER LISTENING - START SERVER
app.listen(3000,function(){
  console.log("Nathaniel Made Me Listen....");
});
