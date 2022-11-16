

const mongoose = require('mongoose')



export const dbConnection = async() => {

    try {

        await mongoose.connect(
            process.env.DB_CNN,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log('DB Online')

    } catch( err ) {
        console.log(err)
        throw new Error('Error al inicializar BD')
    }

}


