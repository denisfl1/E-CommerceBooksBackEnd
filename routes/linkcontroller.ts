
import SCHEMAS from '../schemas';
import {Request,Response} from 'express'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';

const LoginUser = SCHEMAS.User

interface IUser{
    id?:string,
    name?:string,
    surname?:string,
    email?:string,
    password?:string,
    favorites?:string,
    shoppingCart?:string,
    creditCard?:string,
    numberCard?:string,
    cpf?:string,
    gender?:string,
    telephone?:string,
    date_of_birth?:string,
    adress?:string,
    requests?:string,
    update:(data:any)=>void


}

interface ICustomReq extends Request{
    user?:any
}

const CONTROLLER = {

    register:async(req:Request,res:Response)=>{

        try {

            const name = req.body.name
            const surname = req.body.surname
            const email = req.body.email
            const password = req.body.password

        const searchUser:IUser|null = await LoginUser.findOne({where:{email:email}}) as IUser|null

        if(searchUser){
           res.status(409).send("The user already exists")
        return    
        }
   
    
         const newUser = LoginUser.create({
                name:name,
                surname:surname,
                email:email,
                password:password,
            });const doc:IUser = await newUser

            const token = jwt.sign({email:doc.email,id:doc.id},process.env.TOKEN_SECRET as jwt.Secret,{expiresIn:43200})
          
            res.status(200).send({id:doc.id,email:doc.email,name:doc.name,token:token})
       
        } catch (error) {
            console.log(error)
    
        }

    },

    login:async(req:Request<{},{},IUser>,res:Response)=>{

        try {
            const email = req.body.email
            const password = req.body.password   

            const searchUser:IUser|null = await LoginUser.findOne({where:{email:email}}) as IUser|null
            
            if(!searchUser)
            return  res.status(400).send("Email or password incorrect")
            
            if(searchUser.password != password)
            return res.status(400).send("Email or password incorrect")

            const token = jwt.sign({email:searchUser.email,id:searchUser.id},process.env.TOKEN_SECRET as jwt.Secret,{expiresIn:43200})

            res.status(200).send({id:searchUser.id,email:searchUser.email,name:searchUser.name,token:token})
          
           
        } catch (error) {
          
            console.log(error)
        }


    },

    GetMyData:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
       
            const searchUser:IUser|null = await LoginUser.findByPk(id)

            if(!searchUser)return res.status(404).send("User not Found")

            res.status(200).send({email:searchUser.email,name:searchUser.name,surname:searchUser.surname,
            cpf:searchUser.cpf,gender:searchUser.gender,telephone:searchUser.telephone,date_of_birth:searchUser.date_of_birth,password:searchUser.password,
            })


        } catch (error) {
            console.log(error)
        }


    },

    editMyData:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)
  
            if(!searchUser)return res.status(404).send("User not Found")

      
            const allDATA:string[] = [
                "email",
                "name",
                "surname",
                "cpf",
                "telephone",
                "gender",
                "date_of_birth",
            ];

            allDATA.forEach(async(data)=>{
                const newArray = req.body[data]
                searchUser.update({[data]:newArray})

            })
        
            
            res.status(200).send("Update Successfull")

        } catch (error) {
            console.log(error)
        }


    },

    editPassword:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const password:IUser|null = req.body.password 
            const searchUser = await LoginUser.findByPk(id)

            if(!searchUser)return res.status(404).send("User not Found")

            await searchUser.update({
                password:password
            })

            res.status(200).send("Update Successfull")


        } catch (error) {
            console.log(error)
        }


    },

    newCardCredit:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)
            const CreditCard = req.body.data

            if(!searchUser) return res.status(404).send("User not found")

            const addCard = searchUser.creditCard ? JSON.parse(searchUser.creditCard) : []
            addCard.push(CreditCard)

            searchUser.update({creditCard:JSON.stringify(addCard)})

            res.status(200).send("Added Succesfull")


        } catch (error) {
            console.log(error)
        }

    },

    updateCard:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id) 
            const number = req.body.afterNumber
            const data = req.body.data
  
            if(!searchUser) return res.status(404).send("User not found")

            const searchCard = searchUser.creditCard ? JSON.parse(searchUser.creditCard ):[]
            const editCard = searchCard.map((items:IUser)=>{return items.numberCard == number ? data :items})

            searchUser.update({creditCard:JSON.stringify(editCard)})

            res.status(200).send("Update Successfull")

        } catch (error) {
            console.log(error)
        }


    },

    delCard:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)
            const number = req.params.num
            if(!searchUser) return res.status(404).send("User not found")

            const searchCard = searchUser.creditCard ? JSON.parse(searchUser.creditCard ):res.status(404).send("Item not found")
            const delCard = searchCard.filter((items:IUser)=>{return items.numberCard !== number})
            searchUser.update({creditCard:JSON.stringify(delCard)})

            res.status(200).send("Apagado com sucesso")

        } catch (error) {
            console.log(error)
        }



    },

    getCreditCard:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)

            if(!searchUser) return res.status(404).send("User not found")

            res.status(200).send(searchUser.creditCard)


        } catch (error) {
            console.log(error)
        }

    },

    addAdress:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null= await LoginUser.findByPk(id)
            const data = req.body.data
            if(!searchUser) return res.status(404).send("User not found")
        
            const open = searchUser.adress ? JSON.parse(searchUser.adress) : []
            open.push(data)

            searchUser.update({adress:JSON.stringify(open)})

            res.status(200).send("Edited Successfully")

        } catch (error) {
            console.log(error)
        }

    },

    editAdress:async(req:ICustomReq,res:Response)=>{

        try {
            const MyID = req.user.id
            const searchUser:IUser|null  = await LoginUser.findByPk(MyID)
            const data = req.body.data
            const id = req.body.ID
            if(!searchUser) return res.status(404).send("User not found")

            const edit = searchUser.adress ? JSON.parse(searchUser.adress) : []
            const editFilter = edit.map((items:IUser,index:number)=>index == id ? data : items)
         
            searchUser.update({
             adress:JSON.stringify(editFilter)
            })

            res.status(200).send("Edited Successfully")

        } catch (error) {
            console.log(error)
        }

    },

    deleteAdress:async(req:ICustomReq,res:Response)=>{

        try {
            const ID = req.user.id
            const id:string= req.params.id
            const searchUser:IUser|null = await LoginUser.findByPk(ID)

            if(!searchUser) return res.status(404).send("User not found")

            const searchAdress = searchUser.adress ?  JSON.parse(searchUser.adress) :[]
            const delAdress = searchAdress.filter((items:any,index:string)=>{return index != id})

            searchUser.update(
                {adress:JSON.stringify(delAdress)}
            )
            
            res.status(200).send('Apagado com sucesso!')


        } catch (error) {
            console.log(error)
        }

    },

    getAdress:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)
            if(!searchUser) return res.status(404).send("User not found")

            res.status(200).send(searchUser.adress)

        } catch (error) {
            console.log(error)
        }

    },

    changeFavorite:async (req:ICustomReq,res:Response)=>{

        
        try {
            const id = req.user.id
            const addFavorite = req.body.id

            const searchUser:IUser|null = await LoginUser.findByPk(id)

            if(!searchUser)return res.status(404).send("User not found")
            

            const GetFavorites = searchUser.favorites? searchUser.favorites.split(','):[]
            GetFavorites.push(addFavorite)

            searchUser.update({favorites:GetFavorites.join(',')})
            

            res.status(200).send("Update Successfull")
          
        } catch (error) {

          console.log(error)
            
        }
        
        
    },


    deleteFavorite:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const delFavorite = req.body.id 
            
            const searchUser:IUser|null = await LoginUser.findByPk(id)

            if(!searchUser)return res.status(404).send("User not found")

            const GetFavorites = searchUser.favorites?searchUser.favorites.split(','):[]
            const newArray = GetFavorites.filter((items:string)=>{return items !== delFavorite})

            searchUser.update({favorites:newArray.join(',')})
          
            res.status(200).send("Successfully Deleted")

        } catch (error) {

            res.status(400).send("Error with Delete")
            
        }

    },


    getFavorite:async(req:ICustomReq,res:Response)=>{

        try {
          const id = req.user.id
          const searchUser:IUser|null  = await LoginUser.findByPk(id)  

          if(searchUser){
            res.status(200).send(searchUser.favorites)
      
          }else{
            res.status(404).send("User not found")
          }
    
                  
          
        } catch (error) {
            res.status(404).send(error)
        }

            
    },

    addShoppingCart:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id)
            const cartDATA = req.body.values
   
            if(!searchUser)return res.status(404).send("User not Found")

            const GetShoppingCart = searchUser.shoppingCart ? JSON.parse(searchUser.shoppingCart):[]
            GetShoppingCart.push(cartDATA)

            searchUser.update({shoppingCart:JSON.stringify(GetShoppingCart)})
            
           res.status(200).send("Update Successful")

   

        } catch (error) {
            console.log(error)
            
        }

    },

    updateCart:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.body.id
            const ID = req.user.id
            const quantity = req.body.newQtd
            const searchUser:IUser|null  = await LoginUser.findByPk(ID) 

            if(!searchUser)return res.status(404).send("User not Found")

            const GetShoppingCart = searchUser.shoppingCart ? JSON.parse(searchUser.shoppingCart):[]
            const CartEdited = GetShoppingCart.map((item:any)=>{return item.id === id ?{...item,quantity:quantity}:item})


            searchUser.update({shoppingCart:JSON.stringify(CartEdited)})

            res.status(200).send("Update Successful")
            
        } catch (error) {
            console.log(error)
        }

    },

    delShoppingCart:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null  = await LoginUser.findByPk(id) 
            const cartDATA = req.body.id


            if(!searchUser)return res.status(404).send('User not Found')
            if(!cartDATA)return res.status(404).send('Not Found')


            const GetShoppingCart = searchUser.shoppingCart ? JSON.parse(searchUser.shoppingCart) : []
            const filteringCart = GetShoppingCart.filter((items:any)=>{return items.id !== cartDATA})

            searchUser.update({shoppingCart:JSON.stringify(filteringCart)})

            res.status(200).send("Deleted Successfull")

        } catch (error) {
            console.log(error)
        }


    },

    getShoppingCart:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id) 
          
            if(!searchUser)return res.status(404).send("User not found")
            const GetShoppingCart = searchUser.shoppingCart
      
            if(GetShoppingCart)return res.status(200).send(GetShoppingCart)
            

        } catch (error) {
            console.log(error)
        }


    }
    ,

    finishingShopping:async(req:ICustomReq,res:Response)=>{


        try {
            const id = req.user.id
            const data = req.body.data
            const date:Date = new Date()
            const fomattedDate: string = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
            const rand = Math.floor(Math.random() * 100000000000000000)
            const formatRand = rand.toString().replace(/(\d{3})(\d{8})/, '$1-$2-')
            const data1 = {...data,requestNumber:formatRand,requestDate:fomattedDate}
            const searchUser:IUser|null = await LoginUser.findByPk(id) 
            if(!searchUser)return res.status(404).send("User not found")

        
            const parseRequest = searchUser.requests ? JSON.parse(searchUser.requests) : []
            parseRequest.push(data1)

            searchUser.update({requests:JSON.stringify(parseRequest),shoppingCart:null})

            res.status(200).send(data1)
            
        } catch (error) {
            console.log(error)
        }


    },

    getRequest:async(req:ICustomReq,res:Response)=>{

        try {
            const id = req.user.id
            const searchUser:IUser|null = await LoginUser.findByPk(id) 

            if(!searchUser)return res.status(404).send("User not found")

            res.status(200).send(searchUser.requests)
        } catch (error) {
            console.log(error)
        }


    }
    
 

}

export default CONTROLLER