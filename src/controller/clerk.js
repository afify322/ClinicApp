const clerk = require('../models/clerk');
const attend = require('../models/attendance');
const { salary } = require('../models/finance');
const trans = require('../models/finance').transactions;
const moment = require('moment');
const mongoose = require('mongoose');

const items_per_page = 10;

exports.AddClerk = async (req, res) => {
  try {
    const nclerk = await clerk.findOne({ name: req.body.name });

    if (nclerk) {
      return res.status(400).send({ Error_Flag: 1, message: 'User Already Exist' });
    }

    const data = await new clerk(req.body).save();

    return res.status(201).send({ Error_Flag: 0, message: 'Clerk Created Successfuly', Clerk: data });
  } catch (error) {
    return res.status(400).send({ Error_Flag: 1, message: error.message });
  }
};
exports.UpdateClerk = (req, res) => {
  clerk.findByIdAndUpdate(req.body.id, req.body).then((data) => {
    res.status(200).send({ Error_Flag: 0, message: 'Updated Succcessfuly', Clerk: data });
  }).catch((err) => {
    res.status(400).send({ Error_Flag: 1, message: err.message });
  });
};
exports.FindClerk = async (req, res) => {
  const { page } = req.query;

  try {
    clerk.find({
      name: { $regex: req.query.name ?? '', $options: 'i' },
      age: { $gte: req.query.age ?? 0, $lte: req.query.age ?? 100 },
      gender: { $regex: req.query.gender ?? '', $options: 'i' },
      phone: { $regex: req.query.phone ?? '', $options: 'i' },
      salary: { $gte: req.query.salary ?? 0, $lte: req.query.salary ?? 1000000 },
    })
      .skip((page - 1) * items_per_page).limit(items_per_page).then((data) => {
        if (data.length == 0) {
          return res.status(200).send({ Error_Flag: 0, Clerks: 'Not Found', data });
        }

        return res.status(200).send({ Error_Flag: 0, Clerks: data, last_page: Math.ceil(data.length / items_per_page) });
      })
      .catch((error) => res.status(404).send({ Error_Flag: 1, message: error.message }));
  } catch (error) {
    return res.status(400).send({ Error_Flag: 1, message: error.message });
  }
};
exports.FindClerkbyid = async (req, res) => {
  clerk.findById(req.query.id).then((data) => {
    if (data.length == 0) {
      return res.status(200).send({ Error_Flag: 0, Clerk: 'Not Found' });
    }

    return res.status(200).send({ Error_Flag: 0, Clerk: data });
  }).catch((error) => res.status(404).send({ Error_Flag: 1, message: error.message }));
};

exports.DeleteClerk = (req, res) => {
  clerk.findByIdAndDelete(req.body.id).then((data) => {
    res.status(200).send({ Error_Flag: 0, message: 'Clerk Deleted Successfuly' });
  }).catch((err) => {
    res.status(400).send({ Error_Flag: 1, message: err.message });
  });
};
exports.Attended = async (req, res) => {
  try {
    if (req.body.attend == 'true') {
      // هيعرض الموظفين اللي حضروا الشغل

      const attenddata = await attend.findOne({ clerk: req.body.id });
      //   return res.send(attenddata)

      if (attenddata) {
        let d = new Date(attenddata.attend_date.toString()).getDay();

        if (d != moment().day()) {
          const nclerk = await clerk.findByIdAndUpdate(req.body.id, { current_status: 'Attended' });

          await new attend({ clerk: req.body.id, attend_date: new Date(moment().format()), name: nclerk.name }).save();
          return res.status(200).send({ Error_Flag: 0, message: 'Clerk Attended Succcessfuly' });
        }
        if (d = moment().day()) {
          return res.status(200).send({ Error_Flag: 0, message: 'Clerk Already Attended' });
        }
      } else {
        const name = await clerk.findOne({ _id: req.body.id });

        new attend({ clerk: req.body.id, attend_date: moment().format(), name: name.name }).save();
        return res.status(200).send({ Error_Flag: 0, message: 'Clerk Attended Succcessfuly' });
      }
    } else if (req.body.attend == 'false') {
      const attenddata = await attend.findOne({ clerk: req.body.id });

      if (attenddata) {
        let d = new Date(attenddata.attend_date.toString()).getDay();
        const a = moment(moment().format());
        const b = moment(attenddata.attend_date);
        const sol = a.diff(b, 'seconds');

        if (d != moment().day()) {
          return res.status(400).send({ Error_Flag: 1, message: 'Please Attend First' });
        }
        if (d = moment().day()) {
          if (!attenddata.leave_date) {
            const a = await clerk.findOne({ _id: req.body.id });

            await clerk.findByIdAndUpdate(req.body.id, { current_status: 'left', total_seconds: a.total_seconds + sol });

            await attend.findOneAndUpdate({ clerk: req.body.id }, { leave_date: moment().format(), seconds_of_work: sol });

            return res.status(200).send({ Error_Flag: 0, message: 'Clerk left succesfuly', seconds_of_work: sol });
          }

          return res.status(400).send({ Error_Flag: 1, message: 'Clerk Already left succesfuly' });
        }
      } else {
        return res.status(400).send({ Error_Flag: 1, message: 'Please Attend First' });
      }
    }
  } catch (error) {
    res.status(400).send({ Error_Flag: 1, message: error.message });
  }
};
exports.getAttendance = async (req, res) => {
  try {
    const { page } = req.query;

    let a;
    let b;

    if (req.query.lte) {
      a = new Date(req.query.lte.replace(' ', '+'));
    } if (req.query.gte) {
      b = new Date(req.query.gte.replace(' ', '+'));
    }
    await attend.find({ attend_date: { $gte: b ?? new Date('2000-01-08T08:36:37.725+00:00'), $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00') }, name: { $regex: req.query.name ?? '', $options: 'i' } }).select('clerk attend_date leave_date name').populate('clerk', 'name age').skip((page - 1) * items_per_page)
      .limit(items_per_page)
      .exec()
      .then((data) => {
        if (!data.length == 0) {
          return res.status(200).send({ Error_Flag: 0, Attendance: data, last_page: Math.ceil(data.length / items_per_page) });
        }
        return res.status(200).send({ Error_Flag: 1, message: 'Not Found' });
      })
      .catch((err) => {
        res.status(400).send({ Error_Flag: 1, message: err.message });
      });
  } catch (err) {
    res.status(400).send({ Error_Flag: 1, message: err.message });
  }
};
exports.Count = (req, res) => {
  clerk.find().countDocuments().then((data) => {
    res.status(200).send({ Error_Flag: 0, Counter: data });
  }).catch((err) => {
    res.status(400).send({ Error_Flag: 1, message: err.message });
  });
};
exports.salary = (req, res) => {
  new salary({ clerid: req.body.clerkid, date: moment().format(), salary: -Math.abs(req.body.salary) }).save().then((data) => 
  new trans({ type: 'salary', cost: -Math.abs(req.body.salary), date: moment().format(), employee_id: req.body.clerkid}).save()).then((data) => {
    res.status(201).send({ Error_Flag: 0, body: data });
  })
    .catch((err) => {
      res.status(400).send({ Error_Flag: 1, message: err.message });
    });
};
exports.Expenses = (req, res) => {
  new trans({
    type: 'expenses', cost: -Math.abs(req.body.cost), date: moment().format(), note: req.body.note,
  })
    .save().then((data) => {
      res.status(201).send({ Error_Flag: 0, body: data });
    }).catch((err) => {
      res.status(400).send({ Error_Flag: 1, message: err.message });
    });
};
exports.transactions = (req, res) => {
  const { page } = req.query;

  if (req.query.lte) {
  var  a = new Date(req.query.lte.replace(' ', '+'));
  } if (req.query.gte) {
  var  b = new Date(req.query.gte.replace(' ', '+'));
  }

  trans.find({ date: { $gte: b ?? new Date('2000-01-08T08:36:37.725+00:00'), $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00') } }).populate("employee_id","name")
    .skip((page - 1) * items_per_page).limit(items_per_page).exec()
    .then((data) => {
      if (data.length == 0) {
        return res.status(200).send({ Error_Flag: 0, transactions: 'not found' });
      }
      return res.status(200).send({ Error_Flag: 0, transactions: data, last_page: Math.ceil(data.length / items_per_page) });
    })
    .catch((err) => res.status(400).send({ Error_Flag: 1, message: err.message }));
};
exports.finances=async(req,res)=>{
  const { page } = req.query;

  let a;
  let b;

  if (req.query.lte) {
    a = new Date(req.query.lte.replace(' ', '+'));
  } 
  if (req.query.gte) {
    b = new Date(req.query.gte.replace(' ', '+'))
  }
  try {

    let result= await  trans.aggregate([
    { $match:{date:{
       $gte:b ?? new Date('2000-01-08T08:36:37.725+00:00'),
       $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00')}}},
       {
         $group: {  _id:{ $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         
       total : {$sum : "$cost"},
       transactions_type:{ $push: { type: "$type", cost: "$cost", transaction_id:"$_id" }} }
     
      } 
  
  
    ])
    res.status(200).send({Error_Flag:0,result})
  } catch (error) {
    res.status(400).send({Error_Flag:1,message:error.message})
  }

}
