const express = require("express");
const { EmployeeModel } = require("../models/employee.model");
const jwt = require("jsonwebtoken");
const {auth} = require("../middlewares/auth")
const dashboardRoute = express.Router();

dashboardRoute.get("/", auth, async (req,res) => {
    const token = req.headers.authorization;
    console.log("token",token);

    const decoded = jwt.verify(token, "masai");
    try {
        if(decoded){

            const post = await EmployeeModel.find();
            res.status(200).send(post);
        }else {
            res.status(400).send({msg: "Token not verified"});
        }
    } catch (error) {
        res.status(400).send({msg: err.message});
    }


})

dashboardRoute.post("/employees", auth, async (req,res) => {
    try{

        const post = new EmployeeModel(req.body);
        await post.save();
        res.status(200).send({msg: "Employee has been successfully added"})
    }catch(err){
        res.status(400).send({msg: err.message})
    }
})

dashboardRoute.patch("/update/:id",auth, async (req,res )=> {
    const token = req.headers.authorization;

    console.log(req.params);
    const payload = req.body;
    const decoded = jwt.verify(token, "masai");
    console.log(decoded);

    const req_id = decoded._id;

    const postID = req.params.id;
    const post = await EmployeeModel.findOne({_id: postID})
    console.log("post", post)
    const userID_in_post = post._id

    let fID = userID_in_post+"";
    
    // if(fID.includes(postID)){
    //     console.log("Yes");
    // }else {
    //     console.log("no");
    // }

    try {
        console.log("Hello",userID_in_post, postID, req_id);

        if(fID.includes(postID)){
            await EmployeeModel.findByIdAndUpdate({_id: post._id}, payload);
            res.status(200).send({msg: "Post has been successfully Updated"})
        }else {
            res.status(400).send({msg: "you are not authorized to update the post"})
        }
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})

dashboardRoute.delete("/delete/:id",auth, async (req,res )=> {
    const token = req.headers.authorization;

    console.log(req.params);
    const decoded = jwt.verify(token, "masai");
    console.log(decoded);

    if(decoded){

        const req_id = decoded._id;

    const postID = req.params.id;
    const post = await EmployeeModel.findOne({_id: postID})
    const userID_in_post = post._id

    let fID = userID_in_post+"";
    
    try {
        console.log(userID_in_post, postID, req_id);

        if(fID.includes(postID)){
            await EmployeeModel.findByIdAndDelete({_id: post._id});
            res.status(200).send({msg: "Employee has been successfully Deleted"})
        }else {
            res.status(400).send({msg: "This user is Not exist in Database"})
        }
    } catch (error) {
        res.status(400).send({msg: "Something went wrong"})
    }
    }else {
        res.status(400).send({msg: 'You are not authorize to delete Anything from Database'})
    }

    
})


module.exports = {
    dashboardRoute
}