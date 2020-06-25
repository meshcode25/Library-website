const mongoose= require("mongoose");
const moment= require("moment")

var Schema= mongoose.Schema;

var  BookinstanceSchema= new Schema({
    book: {type: Schema.Types.ObjectId, ref:"Book",required:true},
    imprint:{type: String, required: true},
    status: {type: String, required: true,enum:["maintainance","loaned", "available", "reserved"], default: "maintainance"},
    due_back:{type: Date, default: Date.now}
})

//virtual for url
BookinstanceSchema.virtual("url").get(function(){
    return "/catalog/bookinstance/"+ this._id;
})

//virtual for formated date

BookinstanceSchema.virtual('due_back_YYYY-MM-DD').get(function(){
  return  moment(this.due_back).format("YYYY-MM-DD");
})

BookinstanceSchema.virtual('due_back_MMMM Do, YYYY').get(function(){
  return  moment(this.due_back).format("MMMM Do, YYYY");
})


//export this  bookinstance model
module.exports= mongoose.model("Bookinstance", BookinstanceSchema);