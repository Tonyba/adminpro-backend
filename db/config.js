const mongoose = require('mongoose');

const dbConnection = async () => {
  
  try {
    // await mongoose.connect(process.env.DB_CNN, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   //   useCreateIndex: true,
    // });

    await mongoose.connect(process.env.DB_CNN_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    });

    console.log('DB online');
  } catch (error) {
    console.log(error);
    throw new Error('Error connecting to the database');
  }
};

module.exports = {
  dbConnection,
};
