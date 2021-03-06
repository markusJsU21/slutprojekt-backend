const jwt = require('jsonwebtoken')
const {Matter} = require('../models')
const {authError} = require('../errors')



module.exports = {

    setRole: async(req, res, next)=>{
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const user = jwt.verify(token, process.env.JWT_SECRET)
            if(user){
                req.user = user
                next()
            }else{
                throw new authError()
            }
            } catch(err) {
               next(err)
            }
    },


    relationToMatter: async(req, res, next)=>{
       try{
           const id = req.params.id
           const matter = await Matter.findByPk(id)
           if(matter.workerId === req.user.id || matter.customerId === req.user.id){
               next()
           }else{
               throw new authError()
           }
       }catch(err){
        next(err)
        }
    },

    checkIfWorker: async(req, res, next)=>{
        try {
            if(req.user.role === 'worker'){
                next()
            }
        } catch(err) {
            console.log(err)
        }
        // const {role} = req.body
        // console.log(role)
        // if(role != 'worker'){
            //     console.log('User is not worker')
            //     res.json('Unauthorized')
            // }
            // else{
                //     console.log('User is worker')
                //     next()
                // }
            },
            checkIfAdmin: async(req, res, next)=>{
                try {
                    if(req.user.role === 'admin'){
                        next()
                    }else{
                        errorHandeling.unauthorized(req, res)
                    }
                } catch(err) {
                    console.log(err)
                }
            },
            checkIfAdminOrWorker: async(req, res, next)=> {
                try {
                    if(req.user.role === 'admin' || req.user.role === 'worker'){
                        next()
                    }else{
                        throw new authError()
                    }
                } catch(err) {
                  next(err)
                }
            }
        }