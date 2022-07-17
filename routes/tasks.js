const express = require('express');
const Joi = require('joi');
const router = express.Router();
var mongodb = require('mongodb');
const { db, update } = require('../models/Task');
const Task = require("../models/Task");
const User = require("../models/User");

router.get('/', async(req,res) => {
    try {
        const user = await User.find({"_id" : mongodb.ObjectId(req.query.userId)});
        if (user.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Authentication Failed"})
            return;
        }
    } catch (error) {
        console.log("Finding user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    try {
        const tasks = await Task.find({"userId" : mongodb.ObjectId(req.query.userId)});
        res.send({"isSucess" : true, "data" : tasks});
    } catch (error) {
        console.log("Getting Tasks of user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
    }
})

router.post('/newTask', async(req,res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send({"isSucess" : false,"err" : error.details[0].message});

    try {
        const user = await User.find({"_id" : mongodb.ObjectId(req.query.userId)});
        if (user.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Authentication Failed"})
            return;
        }
    } catch (error) {
        console.log("Finding user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    const task = new Task({
        "userId" : mongodb.ObjectId(req.query.userId),
        "task" : req.body.task
    })
    
    try {
        const newTask = await task.save();
        res.send({"isSucess" : true,"taskId" : newTask._id})
    } catch (error) {
        console.log("Creating New Task Failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
    }
})

router.patch('/updateTask/:taskId', async(req,res) => {
    // const { error } = validateTask(req.body);
    // if (error) return res.status(400).send({"isSucess" : false,"err" : error.details[0].message});
    let updated = false;
    try {
        const user = await User.find({"_id" : mongodb.ObjectId(req.query.userId)});
        if (user.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Authentication Failed"})
            return;
        }
    } catch (error) {
        console.log("Finding user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    try {
        const task = await Task.find({"userId" : mongodb.ObjectId(req.query.userId),"_id":mongodb.ObjectId(req.params.taskId)});
        if (task.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Task ID Not Found"})
            return;
        }
    } catch (error) {
        console.log("Finding Task failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }
    
    if (req.body.task) {
        updated = true;
        try {
            db.collection("tasks").updateOne(
                {"_id" : mongodb.ObjectId(req.params.taskId)},
                {
                    $set : {
                        "task" : req.body.task
                    }
            })
            res.send({"isSucess" : true,"taskId" : req.params.taskId})
        } catch (error) {
            console.log("Updating Task Failed",error);
            res.status(500).send({"isSucess" : false,"err" : error});
        }
    }
    else if(req.body.isCompleted != undefined) {
        updated = true;
        try {
            db.collection("tasks").updateOne(
                {"_id" : mongodb.ObjectId(req.params.taskId)},
                {
                    $set : {
                        "isCompleted" : !req.body.isCompleted
                    }
            })
            res.send({"isSucess" : true,"taskId" : req.params.taskId})
        } catch (error) {
            console.log("Updating Task Failed",error);
            res.status(500).send({"isSucess" : false,"err" : error});
        }
    }

    if (!updated) {
        res.status(400).send('Bad request');
    }

})

router.patch('/completeTask/:taskId', async(req,res) => {
    try {
        const user = await User.find({"_id" : mongodb.ObjectId(req.query.userId)});
        if (user.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Authentication Failed"})
            return;
        }
    } catch (error) {
        console.log("Finding user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    try {
        const task = await Task.find({"userId" : mongodb.ObjectId(req.query.userId),"_id":mongodb.ObjectId(req.params.taskId)});
        if (task.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Task ID Not Found"})
            return;
        }
    } catch (error) {
        console.log("Finding Task failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }
    
    try {
        db.collection("tasks").updateOne(
            {"_id" : mongodb.ObjectId(req.params.taskId)},
            {
                $set : {
                    "isCompleted" : true
                }
        })
        res.send({"isSucess" : true,"taskId" : req.params.taskId})
    } catch (error) {
        console.log("Completing Task Failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
    }
})

router.delete('/deleteTask/:taskId', async(req,res) => {
    try {
        const user = await User.find({"_id" : mongodb.ObjectId(req.query.userId)});
        if (user.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Authentication Failed"})
            return;
        }
    } catch (error) {
        console.log("Finding user failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    try {
        const task = await Task.find({"userId" : mongodb.ObjectId(req.query.userId),"_id":mongodb.ObjectId(req.params.taskId)});
        if (task.length == 0) {
            res.status(401).send({"isSucess" : false,"err" : "Task ID Not Found"})
            return;
        }
    } catch (error) {
        console.log("Finding Task failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
        return;
    }

    try {
        db.collection("tasks").findOneAndDelete({"_id":mongodb.ObjectId(req.params.taskId),"userId":mongodb.ObjectId(req.query.userId)})
        res.send({"isSucess" : true,"taskId" : req.params.taskId})
    } catch (error) {
        console.log("Deleting Task Failed",error);
        res.status(500).send({"isSucess" : false,"err" : error});
    }
})

function validateTask(task) {
    const schema = Joi.object({
        task: Joi.string().required()
    })

    return schema.validate(task);
}

module.exports = router;