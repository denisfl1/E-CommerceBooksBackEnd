import {Sequelize,DataType} from "sequelize-typescript"
import dontev from 'dotenv'
dontev.config()


const sequelize = new Sequelize('banco','root',process.env.MYSQL,{

    host:'localhost',
    dialect:"mysql",

})


const SCHEMAS = {

    User: sequelize.define('users',{

        id:{
            type:DataType.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
    
        },
    
        name:{
            type:DataType.STRING,
        },
        surname:{
            type:DataType.STRING,
        },
        email:{
            type:DataType.STRING
        },
        password:{
            type:DataType.STRING
        },

        cpf:{
            type:DataType.STRING
        },

        telephone:{
            type:DataType.STRING
        },

        gender:{
            type:DataType.STRING
        },

        date_of_birth:{
            type:DataType.STRING
        },

        favorites:{
            type:DataType.STRING
        },
        shoppingCart:{
            type:DataType.JSON
        },

        creditCard:{
            type:DataType.JSON
        },

        adress:{
            type:DataType.JSON
        },
        requests:{
            type:DataType.JSON
        }
    
    
    }),


        

}

// SCHEMAS.User.sync({force:true})


export default SCHEMAS
