const mongoose = require('mongoose');

// Conection to Mongodb on Localhost
// async function dbconnect() {
//     await mongoose.connect(process.env.DB_LOCAL)
//       .then(()=>{
//         console.log("DB is connected");
//       })
//       .catch((err)=>{
//         console.log(err);
//       })
// }

// Connecting to MongoDB Atlas
async function dbconnect(){
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB Atlas'))
      .catch(err => console.error('Error connecting to MongoDB Atlas:', err));
}

module.exports = dbconnect;