const mongoose = require('mongoose');
const moment = require('moment');
const patient = require('../models/patient');
const { medicine } = require('../models/Medicine');
const { test } = require('../models/Tests');
const book = require('../models/booking');
const trans = require('../models/finance').transactions;

const items_per_page = 10;

exports.Addpatient = (req, res, next) => {
  new patient({
    smoker: req.body.smoker,
    diabetic: req.body.diabetic,
    Name: req.body.name,
    Age: req.body.age,
    Phone: req.body.phone,
    Gender: req.body.gender,
    Address: req.body.address,
    medical_info: req.body.medical_info,
    medical_issues: req.body.medical_issues,
  }).save().then((data) => res.status(201).json({ Error_Flag: 0, message: 'Patient was created successfuly', patient: data }))
    .catch(((error) => res.status(400).json({ Error_Flag: 1, message: error.message })));
};
exports.Deletepatient = (req, res, next) => {
  patient.findByIdAndDelete(req.body.id).then((data) => {
    if (data) {
      return res.status(201).json({ Error_Flag: 0, message: 'Patient was deleted Successfuly' });
    }
    return res.status(400).json({ Error_Flag: 0, message: 'There is no Patient Have this id' });
  }).catch((error) => {
    res.status(500).json({ Error_Flag: 1, message: error.message });
  });
};
exports.FindPatient = async (req, res, next) => {
  const { page } = req.query;

  patient.find({

    Name: { $regex: req.query.name ?? '', $options: 'i' },
  
    Gender: { $regex: req.query.gender ?? '', $options: 'i' },
    Phone: { $regex: req.query.phone ?? '', $options: 'i' }
  })
  
  
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .exec()
    .then((data) => {
      if (data.length == 0) {
        return res.status(200).json({ Error_Flag: 0, Patients: 'Not Found' });
      }

      return res.status(200).json({ Error_Flag: 0, Patients: data, last_page: Math.ceil(data.length / items_per_page) });
    })
    .catch((err) => res.status(400).json({ Error_Flag: 1, message: err.message }));
};
exports.FindpatientByid = async (req, res) => {
  patient.findById(req.query.id).select('Name _id Age Phone Gender Address  Prev_visit Next_visit Notes createdAt updatedAt ')
    .populate('Tests medicines').populate('test medicine', 'name')
    .exec()

    .then((data) => {
      if (!data) {
        return res.status(200).json({ Error_Flag: 0, Patient: 'Not Found' });
      }

      return res.status(200).json({ Error_Flag: 0, Patient: data });
    })
    .catch((err) => res.status(400).json({ Error_Flag: 1, message: 'Invalid ID' }));
};
exports.UpdadtePatient = (req, res, next) => {
  patient.findByIdAndUpdate(req.body.id, req.body, { new: true, runValidators: true })
    .then((data) => {
      res.status(200).json({ Error_Flag: 0, message: 'Patient Updated Successfuly', Patient: data });
    }).catch((error) => {
      res.status(404).json({ Error_Flag: 1, message: error.message });
    });
};
exports.Count = (req, res, next) => {
  patient.countDocuments((err, num) => {
    if (err == null) {
      return res.status(200).json({ Error_Flag: 0, counter: num });
    }
    return res.status(400).json({ Error_Flag: 1, message: err });
  });
};
exports.AddMed = async (req, res, next) => {
  const UserId = req.body.id;
  const UserId1 = mongoose.Types.ObjectId(UserId);

  try {
    const obj = {
      _id: new mongoose.Types.ObjectId(), date: req.body.date, dose: req.body.dose, name: req.body.name,
    };
    const MedData = await medicine.findOne({ name: obj.name });

    if (!MedData) {
      const newmed = await new medicine({ _id: obj._id, name: obj.name }).save();
      const data = await patient.findOne({ _id: req.body.id });
      data.medicines.push(obj);
      await data.save();
      newmed.Patients.push({ Patient: UserId });
      await newmed.save();

      res.status(200).json({ Error_Flag: 0, message: 'Added Successfuly', Patient: data });
    } else if (MedData) {
      const pa = await patient.findOne({ _id: req.body.id });
      obj._id = MedData._id;
      data.medicines.push(obj);
      await data.save();

      const medpa = await medicine.findOne({ _id: MedData._id });

      medpa.Patients.push({ Patient: UserId });
      await medpa.save();

      res.status(200).json({ Error_Flag: 0, message: 'Added Successfuly', Patient: pa });
    }
  } catch (error) {
    res.status(500).json({ Error_Flag: 1, message: error.message });
  }
};
exports.AddTest = async (req, res, next) => {
  try {
    if (req.files == 0 || !req.files) {
      return res.status(400).json({ Error_Flag: 1, message: 'Please Upload Image' });
    }

    const { name } = req.body;
    const { date } = req.body;
    const UserId = req.body.id;

    const UserId1 = mongoose.Types.ObjectId(UserId);

    const path = req.files.map((data, index) => ({ image: data.path }));
    const obj = {
      _id: new mongoose.Types.ObjectId(), name, images: path, date,
    };

    const data = await patient.findById({ _id: UserId1 });

    data.Tests.push(obj);
    await data.save();

    const TestData = await test.findOne({ name: req.body.name });

    if (!TestData) {
      const newmed = await new test({ _id: obj._id, name: obj.name }).save();

      newmed.Patients.push({ Patient: UserId1 });
      await newmed.save();
      const hu = await patient.findById(UserId);

      res.status(200).json({ Error_Flag: 0, message: 'Added Successfuly', Patient: hu });
    } else if (TestData) {
      const pa = await patient.findOne({ _id: req.body.id });

      pa.medicines._id = TestData._id;
      await pa.save();

      const medpa = await test.findOne({ _id: TestData._id });

      medpa.Patients.push({ Patient: UserId1 });
      await medpa.save();

      res.status(200).json({ Error_Flag: 0, message: 'Added Successfuly', Patient: pa });
    }
  } catch (error) {
    res.status(400).json({ Error_Flag: 1, message: error.message });

    // }
  }
};
exports.GetMed = async (req, res) => {
  const { page } = req.query;

  if (!req.query.id) {
    try {
      const docs = await medicine.find().countDocuments();

      medicine.find().skip((page - 1) * items_per_page).limit(items_per_page).select(' Patients _id name')
        .populate('Patients.Patient', 'Name')
        .exec()
        .then((data) => {
          res.status(200).json({ Error_Flag: 0, medicines: data, last_page: Math.ceil(docs / items_per_page) });
        })
        .catch((err) => {
          res.status(400).json({ Error_Flag: 1, message: err.message });
        });
    } catch (err) {
      res.status(400).json({ Error_Flag: 1, message: err.message });
    }
  } else if (req.query.id) {
    await medicine.findById(req.query.id).select('_id name Patients').populate('Patients.Patient', 'Name').exec()
      .then((data) => {
        if (data) {
          return res.status(200).json({ Error_Flag: 0, Medicine: data });
        }
        return res.status(200).json({ Error_Flag: 0, Medicine: 'Not Found' });
      })
      .catch((err) => {
        res.status(400).json({ Error_Flag: 1, message: err.message });
      });
  }
};
exports.GetTests = async (req, res) => {
  const { page } = req.query;

  if (req.query.id) {
    await test.findById(req.query.id).select('_id name Patients').populate('Patients.Patient', 'Name').exec()
      .then((data) => {
        if (data) {
          return res.status(200).json({ Error_Flag: 0, Tests: data });
        }
        return res.status(200).json({ Error_Flag: 0, Tests: 'Not Found' });
      })
      .catch((err) => {
        res.status(400).json({ Error_Flag: 1, message: err.message });
      });
  } else {
    try {
      const docs = await test.find().countDocuments();

      test.find().skip((page - 1) * items_per_page).limit(items_per_page).select('_id name Patients')
        .populate('Patients.Patient', 'Name')
        .exec()
        .then((data) =>
        //  page=+page +1

          res.status(200).json({ Error_Flag: 0, Tests: data, last_page: Math.ceil(docs / items_per_page) }))
        .catch((err) => res.status(400).json({ Error_Flag: 1, message: err.message }));
    } catch (error) {
      return res.status(400).json({ Error_Flag: 1, message: err.message });
    }
  }
};
exports.CountMed = (rqe, res) => {
  medicine.find().countDocuments((err, num) => {
    if (err) {
      return res.status(400).json({ Error_Flag: 1, message: err.message });
    }
    return res.status(200).json({ Error_Flag: 0, counter: num });
  });
};
exports.CountTests = (req, res) => {
  test.find().countDocuments((err, docs) => {
    if (err) {
      return res.status(400).json({ Error_Flag: 1, message: err.message });
    }
    return res.status(200).json({ Error_Flag: 0, counter: docs });
  });
};
exports.UpdateMed = async (req, res) => {
  try {
    const a = await medicine.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name }, { new: true });

    if (a) {
      return res.status(200).json({ Error_Flag: 0, message: 'Updated Successfuly', Medicine: a.name });
    }
    return res.status(200).json({ Error_Flag: 1, message: 'Check the id of Medicine ' });
  } catch (error) {
    return res.status(200).json({ Error_Flag: 1, message: error.message });
  }
};
exports.UpdateTest = async (req, res) => {
  try {
    const a = await test.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name }, { new: true });

    if (a) {
      return res.status(200).json({ Error_Flag: 0, message: 'Updated Successfuly', Test: a.name });
    }
    return res.status(200).json({ Error_Flag: 1, message: 'Test Not Found' });
  } catch (error) {
    return res.status(200).json({ Error_Flag: 1, message: error.message });
  }
};
exports.Deletemed = async (req, res) => {
  medicine.deleteOne({ _id: req.body.id }).then((data) => {
    res.status(200).json({ Error_Flag: 0, message: 'deleted successfuly' });
  }).catch((err) => {
    res.status(400).json({ Error_Flag: 1, message: err.message });
  });
};
exports.Deletetest = (req, res) => {
  test.deleteOne({ _id: req.body.id }).then((data) => {
    res.status(200).json({ Error_Flag: 0, message: 'deleted successfuly' });
  })
    .catch((err) => {
      res.status(400).json({ Error_Flag: 1, message: err.message });
    });
};
exports.reservation = async (req, res) => {
  let date=new Date(req.body.date.replace(' ', '+'))
  try {
    const data = await book.find({ patient: req.body.id, status: 'pending' });

    if (!data.length == 0) {
      return res.status(400).json({ Error_Flag: 1, message: 'Reservation is Alreeady Exist Please Confirm The last one first ' });
    }

    const Patient = await patient.findByIdAndUpdate(req.body.id, { Prev_visit: date });
    const book1 = await new book({
      patient: req.body.id, cost: req.body.cost, notes: req.body.notes, status: 'pending', type: req.body.type, date:date , name:Patient.Name
    }).save();

    return res.status(201).json({ Error_Flag: 0, reservation: book1 });
  } catch (error) {
    return res.status(400).json({ Error_Flag: 0, reservation: error.message });
  }
};
exports.Confirmreservation = async (req, res) => {
  try {
    const data = await book.findOne({ _id: req.body.id, status: 'pending' });

    if (!data) {
      return res.status(200).json({ Error_Flag: 0, message: 'Reservation Not Found' });
    }

    const a = await book.findOneAndUpdate({ _id: req.body.id, status: 'pending' }, { status: 'confirmed'  ,date: moment().format() }, { new: true });
    console.log(a)
    new trans({
      type: 'Revenues', date: moment().format(), cost: a.cost, note: req.body.note,
    }).save();

    const b = await patient.findOneAndUpdate({ _id: a.patient }, { Prev_visit: moment().format(), Next_visit: req.body.next_visit }, { new: true });

    return res.status(200).json({ Error_Flag: 1, message: 'Confirmed Successfuly', data: a });
  } catch (error) {
    return res.status(400).json({ Error_Flag: 0, message: error.message });
  }
};
exports.Cancelreservation = async (req, res) => {
  try {
    const data = await book.findOne({ _id: req.body.id, status: 'pending' });

    if (!data) {
      return res.status(200).json({ Error_Flag: 0, message: 'Reservation Not Found' });
    }

    const a = await book.findOneAndUpdate({ _id: req.body.id, status: 'pending' }, { status: 'canceled', deleted: true }, { new: true });

    const b = await patient.findOneAndUpdate({ _id: a.patient }, { Prev_visit: '', Next_visit: '' }, { new: true });

    return res.status(200).json({ Error_Flag: 1, message: 'Canceled Successfuly', data: a });
  } catch (error) {
    return res.status(400).json({ Error_Flag: 0, message: error.message });
  }
};
exports.Getreservations = async (req, res) => {
  const { page } = req.query;

  let a;
  let b;

  if (req.query.lte) {
    a = new Date(req.query.lte.replace(' ', '+'));
  } if (req.query.gte) {
    b = new Date(req.query.gte.replace(' ', '+'));
  }

  book.find( {
    type:{ $regex: req.query.type ?? '', $options: 'i' },
    name:{ $regex: req.query.name ?? '', $options: 'i' } ,
    date: { $gte: b ?? new Date('2000-01-08T08:36:37.725+00:00'), $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00') },
    status: { $regex: req.query.status ?? '', $options: 'i' },
    cost: { $gte: req.query.cost ?? 0, $lte: req.query.cost ?? 10000 },
  } )
/*     .select('patient cost status notes updatedAt createdAt')
 */ .populate('patient', 'Name Age Phone')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .exec()
    .then((data) => {
      if (data.length == 0) {
        return res.status(200).json({ Error_Flag: 0, reservation: 'Not Found' });
      }

      console.log(data.length);
      return res.status(200).json({ Error_Flag: 0, reservation: data, last_page: Math.ceil(data.length / items_per_page) });
    })
    .catch((err) => res.status(400).json({ Error_Flag: 1, message: err.message }));
};
exports.Deletereservation = (req, res) => {
  book.deleteOne({ _id: req.body.id }, (err, doc) => {
    if (err) {
      return res.status(400).json({ Error_Flag: 1, message: err.message });
    }
    return res.status(200).json({ Error_Flag: 1, message: 'Deleted Successfuly' });
  });
};

