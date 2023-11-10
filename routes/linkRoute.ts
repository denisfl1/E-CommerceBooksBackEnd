import express from 'express';
const router = express.Router()
import bodyParser  from 'body-parser'
import linkcontroller from './linkcontroller'
import Authvalidation from './authvalidation';

router.get('/getfav',Authvalidation.auth,linkcontroller.getFavorite)
router.get('/getShoppingCart',Authvalidation.auth,linkcontroller.getShoppingCart)
router.get('/getCreditCard',Authvalidation.auth,linkcontroller.getCreditCard)
router.get('/mydata',Authvalidation.auth,linkcontroller.GetMyData)
router.get('/getAdress',Authvalidation.auth,linkcontroller.getAdress)
router.get('/getRequests',Authvalidation.auth,linkcontroller.getRequest)
router.post('/register',bodyParser({extended:true}),linkcontroller.register)
router.post('/login',bodyParser({extended:true}),linkcontroller.login)
router.post('/addCardCredit',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.newCardCredit)
router.put('/editfav',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.changeFavorite)
router.put('/delfav',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.deleteFavorite)
router.put('/addBookCart',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.addShoppingCart)
router.put('/delBookCart',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.delShoppingCart)
router.put('/updateShoppingCart',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.updateCart)
router.put('/editCard',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.updateCard)
router.put('/editMydata',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.editMyData)
router.put('/addAdress',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.addAdress)
router.put('/editAdress',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.editAdress)
router.put('/editpassword',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.editPassword)
router.put('/newshopping',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.finishingShopping)
router.delete('/delCard/:num',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.delCard)
router.delete('/deleteAdress/:id',Authvalidation.auth,bodyParser({extended:true}),linkcontroller.deleteAdress)

export default router
