let mongoose= require("mongoose");
let  async= require("async");
let  moment= require("moment");

var Schema= mongoose.Schema;

let AuthorSchema= new Schema({
    first_name:{type:String,required:true, max:100 },
    family_name:{type:String,required:true, max:100},
    date_of_birth:{required:true,type: Date },
    date_of_death:{required:false,type: Date },
})

AuthorSchema.virtual("name").get(function(){
    var name="";
    if(first_name && family_name){
        name= first_name + "," + family_name;
    }
    if(!fist_name && !family_name){
        name=" ";
    }
    return name;
})
AuthorSchema.virtual("life_span").get(function(){
    var life_span= " ";
    if(date_of_birth){ 
        life_span= moment(date_of_birth).format("MMMM Do, YYYY");
    }
    life_span+= "-";
    if(date_of_death){
        life_span+=moment(date_of_death).format("MMMM Do, YYYY");
    }

    return life_span;
})

AuthorSchema.virtual("url").get(function(){
return "/catalog/author/"+ this._id;
})

AuthorSchema.virtual("date_of_birth_YYYY_MM_DD").get (function(){
   return moment(this.date_of_birth).format("MM/DD/YYYY");
})

AuthorSchema.virtual("date_of_death_YYYY_MM_DD").get (function(){
    return moment(this.date_of_death).format("MM/DD/YYYY");
})


module.exports= mongoose.model("Author", AuthorSchema);