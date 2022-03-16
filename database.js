const mongooseClient = require("mongoose");

mongooseClient.connect("mongodb://localhost/notepadDB", {useNewUrlParser:true, useUnifiedTopology:true},(err)=> {
  if(err)   console.log(err.message);
});

const NotesSchema = mongooseClient.Schema({
    title : String,
    description : String,
    img:{
      data:Buffer,
      contentType: String
    },
    mail : String
})

const Notes = mongooseClient.model("Notes", NotesSchema);

module.exports =Notes;