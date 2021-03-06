//express Router
const { Router } = require('express')
//multer
const multer  = require('multer')
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/data/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({ storage: fileStorageEngine })
//controllers
const accountController = require('../controllers/accountController')
const matterController = require('../controllers/matterController')
const messageController = require('../controllers/messageController')
const customerController = require('../controllers/customerController')
const adminController = require('../controllers/adminController')
const imageController = require('../controllers/imageController')

// const validations = require('../validations')
const validate = require('../validations')

//middlewares
const auth = require('../middlewares/auth')

// const res = require('express/lib/response')
const router = new Router()

//account endpoints

router.post('/login', accountController.login)
router.use(auth.setRole)
router.get('/', () =>{
    res.json('server funkar')
})
// matter endpoints
router.post('/matter', validate.createMatter, auth.checkIfAdminOrWorker, matterController.create)
router.get('/matter', matterController.getAll)
router.patch('/matter', validate.updateMatter, auth.checkIfAdminOrWorker, matterController.update)
router.post('/matter/:id/image', auth.relationToMatter, upload.single('file'), imageController.uploadImg)
router.get('/matter/:id/images', auth.relationToMatter, matterController.getOne)
router.get('/matter/:id/image/:image_id', auth.relationToMatter, imageController.getOne)
router.post('/matter/:id/message', auth.relationToMatter, messageController.create)
router.get('/matter/:id/message', auth.relationToMatter, messageController.getAll)

//image enpoints
//Lägg på en validation som kollar att en req.file finns i requesten

// message endpoints
// /matter/:id/message

// custom endpoints
//lägg på auth
router.get('/customers', auth.checkIfAdminOrWorker, customerController.getAll)

//admin enpoints
router.post('/user', validate.createUser, auth.checkIfAdmin, adminController.createUser)
router.get('/user', auth.checkIfAdmin, adminController.getAllUsers)
router.patch('/user', auth.checkIfAdmin, adminController.updateUser)



module.exports = router