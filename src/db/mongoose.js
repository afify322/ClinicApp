const mongoose=require("mongoose")
    mongoose.connect("mongodb+srv://first:6PhsjC3EuCp4z9oy@cluster0.kb4eg.mongodb.net/clinic?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true},)
    