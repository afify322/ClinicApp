const patient=require("../models/patient")
const mongoose = require("mongoose");
const medicine=require("../models/Medicine").medicine
const test=require("../models/Tests").test
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: "dquzcc6kw",
    api_key: "956728166899899",
    api_secret: "lgMkP22bTqHWfaY5lxRKybkBMsc"
  });
const items_per_page=10;
exports.ADdpatient=(req,res,next)=>{

  
new patient({Name:req.body.name,Age:req.body.age,Phone:req.body.phone,Gender:req.body.gender,Address:req.body.address,Notes:req.body.notes,Prev_visit:req.body.prev_visit,Next_visit:req.body.next_visit}).save().then((data)=>{

return res.status(201).send({Error_Flag:0,message:"Patient was created successfuly",patient:data})

})
.catch((error=>{
    return res.status(400).send({Error_Flag:1,message:error.message})

}))

 


}
exports.Deletepatient=(req,res,next)=>{
    patient.findByIdAndDelete(req.body.id).then((data)=>{
        if(data){
          return  res.status(201).send({Error_Flag:0,message:"Patient was deleted Successfuly"})

        }
     return   res.status(400).send({Error_Flag:0,message:"There is no Patient Have this id"})

    }).catch((error)=>{
        res.status(500).send({Error_Flag:1,message:error.message})

    })

}
exports.FindPatient=async(req,res,next)=>{
    let page=req.query.page
        try {
           let doc=await patient.find().countDocuments()
           patient.find({Name:{$regex: req.query.name??"", $options: "i" },
           Age:{ $gte: req.query.age??0, $lte: req.query.age??100 },
           Gender:{$regex: req.query.gender??"", $options: "i" },
           Phone:{$regex: req.query.phone??"", $options: "i" }}).select("Name _id Age Phone Gender Address ").populate("medicines._id Tests._id","name")
           .skip((page-1)*items_per_page).limit(items_per_page).exec()
           .then((data)=>{
               if(data.length==0){
                  return res.status(200).send({Error_Flag:0,Patients:"Not Found"})
     
               }
               else{
                  return res.status(200).send({rsError_Flag:0,Patients:data,last_page:Math.ceil(doc/items_per_page)})
    
               }
           
           }).catch((error)=>{
             return  res.status(404).send({Error_Flag:1,message:error.message})
           
           })  
        } catch (error) {
         return  res.status(404).send({Error_Flag:1,message:error.message})
    
        }
   
   
}

exports.UpdadtePatient=(req,res,next)=>{
    patient.findByIdAndUpdate(req.body.id,req.body,{new:true, runValidators:true})
    .then((data)=>{
    res.status(200).send({Error_Flag:0,message:"Patient Updated Successfuly",Patient:data})
    
}).catch((error)=>{
    res.status(404).send({Error_Flag:1,message:error.message})

}) 
}
exports.Count=(req,res,next)=>{
    patient.countDocuments((err,num)=>{
       
        if(err==null){
           return res.status(200).send({Error_Flag:0,counter:num})
        }
        return res.status(400).send({Error_Flag:1,message:err})
    }
    )
   
}
exports.AddMed=async(req,res,next)=>{
        let UserId=req.body.id
        let UserId1=mongoose.Types.ObjectId(UserId)
        try {
      let data=await patient.findOne({_id:req.body.id})
       let obj={_id:new mongoose.Types.ObjectId,date:req.body.date,dose:req.body.dose,name:req.body.name}
         data.medicines.push(obj)
         await data.save()
    let MedData=await medicine.findOne({name:obj.name})
        if(!MedData){

          let newmed= await new medicine({_id:obj._id,name:obj.name}).save()
        
         newmed.Patients.push(UserId1)
          await newmed.save()
      
       let hu=await patient.findOne({_id:req.body.id})

       res.status(200).send({Error_Flag:0,message:"Added Successfuly",Patient:hu})
    }
        else if(MedData){
   
    let pa=await patient.findOne({_id:req.body.id})
            pa.medicines._id=MedData._id;
              await pa.save()

            let medpa=await medicine.findOne({_id:MedData._id})
                medpa.Patients.push(UserId1)
                await medpa.save()

        
            res.status(200).send({Error_Flag:0,message:"Added Successfuly",Patient:pa})
 }
} catch (error) {
    res.status(500).send({Error_Flag:1,message:error.message})
    
}
         
}
exports.AddTest=async(req,res,next)=>{
      
   
/*   
    if(!req.file){
        
        res.status(400).send({Error_Flag:1,message:"Test's image is required"})
    }
   else if(!req.file.originalname.match(/\.(png|jpg|jpeg)$/)){
     res.status(400).send({Error_Flag:1,message:"Invalid image type"})
 }
 else{ */
    try {
        let name=req.body.name
        let date=req.body.date
        let UserId=req.body.id
      
  
    let UserId1=mongoose.Types.ObjectId(UserId)
    let med={_id:UserId1}
      /*   let Cloudimage=await cloudinary.uploader.upload(`./images/${req.file.filename}`);
        let path=Cloudimage.secure_url */
        let obj={_id:new mongoose.Types.ObjectId,name:name,path:"http://image-url-Here",date:date}
        console.log(date)

        let data=await patient.findById({_id:UserId1})
           data.Tests.push(obj)
           await data.save()
       
      let TestData=await test.findOne({name:req.body.name})
 
          if(!TestData){    
            let newmed= await new test({_id:obj._id,name:obj.name}).save()   
           newmed.Patients.push(UserId1)
            await newmed.save()
            let hu=await patient.findById(UserId)

         res.status(200).send({Error_Flag:0,message:"Added Successfuly",Patient:hu})
        }
          else if(TestData){
    
      let pa=await patient.findOne({_id:req.body.id})
              pa.medicines._id=TestData._id;
                await pa.save()
          
  
              let medpa=await test.findOne({_id:TestData._id})
                  medpa.Patients.push(UserId1)
                  await medpa.save()
  
          
              res.status(200).send({Error_Flag:0,message:"Added Successfuly",Patient:pa})
   }
  } catch (error) {
      res.status(500).send({Error_Flag:1,message:error.message})
      
 // }
 }
}
exports.GetMed=async(req,res)=>{
  
    let page=req.query.page
   if(req.query.getpatient=='true'||!req.query.getpatient){
    try {
        let docs = await medicine.find().countDocuments()

    medicine.find().skip((page-1)*items_per_page).limit(items_per_page).select(" Patients _id name").populate("Patients","Name Age").exec()
    .then((data)=>{
        res.status(200).send({Error_Flag:0,medicines:data,last_page:Math.ceil(docs/items_per_page)})

    }).catch((err)=>{
        res.status(400).send({Error_Flag:1,message:err.message})
    })
    } catch (err) {
        res.status(400).send({Error_Flag:1,message:err.message})
    }
   }else if(req.query.getpatient=='false') {
        try {
            let docs = await medicine.find().countDocuments()
    
        medicine.find()
        .then((data)=>{

           var reduced = data.reduce(function(filtered,option) {
           
               var someNewValue = { name: option.name, _id:option._id }
               filtered.push(someNewValue);
            
            return filtered;
          }, []);
            res.status(200).send({Error_Flag:0,medicines:reduced,last_page:Math.ceil(docs/items_per_page)})
    
        }).catch((err)=>{
            res.status(400).send({Error_Flag:1,message:err.message})
        })
        } catch (error) {
            res.status(400).send({Error_Flag:1,message:err.message})
        }
    }
    
}
exports.GetTests=async(req,res)=>{
    let page=req.query.page
   if(req.query.getpatient=='true'||!req.query.getpatient){
    try {
        let docs = await test.find().countDocuments()
        test.find().skip((page-1)*items_per_page).limit(items_per_page).select("_id name Patients").populate("Patients","Name Age").then((data)=>{
          //  page=+page +1
           
    
            res.status(200).send({Error_Flag:0,Tests:data,last_page:Math.ceil(docs/items_per_page)})
        }).catch((err)=>{
            res.status(400).send({Error_Flag:1,message:err.message})
        })  
    } catch (error) {
        res.status(400).send({Error_Flag:1,message:err.message})
    
    }
   }
   else if(req.query.getpatient=='false') {
    try {
        let docs = await test.find().countDocuments()

    medicine.find()
    .then((data)=>{

       var reduced = data.reduce(function(filtered,option) {
       
           var someNewValue = { name: option.name, _id:option._id }
           filtered.push(someNewValue);
        
        return filtered;
      }, []);
        res.status(200).send({Error_Flag:0,medicines:reduced,last_page:Math.ceil(docs/items_per_page)})

    }).catch((err)=>{
        res.status(400).send({Error_Flag:1,message:err.message})
    })
    } catch (error) {
        res.status(400).send({Error_Flag:1,message:err.message})
    }
}
   
}
exports.CountMed=(rqe,res)=>{
    medicine.find().countDocuments((err,num)=>{
        if(err){
            res.status(400).send({Error_Flag:1,message:err.message})
        }
        res.status(200).send({Error_Flag:0,counter:num})
    })
}
exports.CountTests=(req,res)=>{
   test.find().countDocuments((err,docs)=>{
    if(err){
        res.status(400).send({Error_Flag:1,message:err.message})
    }
    res.status(200).send({Error_Flag:0,counter:docs})
   }) 
}
exports.UpdateMed=async(req,res)=>{
    try {
        let a=await medicine.findOneAndUpdate({_id:req.body.id},{name:req.body.name})
        if(a){
          res.status(200).send({Error_Flag:0,message:"Updated Successfuly",Medicine:a.name})
        }
        res.status(200).send({Error_Flag:1,message:"Check the id of Medicine "})


    } catch (error) {
        res.status(200).send({Error_Flag:1,message:error.message})

    }

}
exports.UpdateTest=async(req,res)=>{
    try {
        let a=await test.findOneAndUpdate({_id:req.body.id},{name:req.body.name})
        if(a){
         return res.status(200).send({Error_Flag:0,message:"Updated Successfuly",Test:a.name})
        }
      return res.status(200).send({Error_Flag:1,message:"Check the id of Medicine "})


    } catch (error) {
       return res.status(200).send({Error_Flag:1,message:error.message})

    }

}
 exports.Book=(req,res)=>{

} 