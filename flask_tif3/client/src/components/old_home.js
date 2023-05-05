import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import User from "./User"
import { Modal, Form, Button } from "react-bootstrap";
import {useForm} from 'react-hook-form'


const LoggedinHome=()=>{
    const [users, setUsers]=useState([]);
    const [show, setShow]=useState(false)
    const {register, handleSubmit,setValue, formState:{errors}} = useForm()
    const [userId, setUserId] =useState(0)

    useEffect(
        ()=>{
            fetch('/user/users')
            .then(res=>res.json())
            .then(data=>{
                setUsers(data)
            })
            .catch(err=>console.log(err))
        },[]
    )

    const getAllUsers=()=>{
        fetch('/user/users')
        .then(res=>res.json())
        .then(data=>{
            setUsers(data)
        })
        .catch(err=>console.log(err))
    }

    const closeModal=()=>{
        setShow(false)
    }

    const showModal=(id)=>{
        setShow(true)
        setUserId(id)
        users.map(
            (user)=>{
                if(user.id==id){
                    setValue('username', user.username)
                    setValue('email', user.email)
                    setValue('full_name', user.full_name)
                }
            }
        )
    }

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const updateUser=(data)=>{
        if (data.password === data.confirmPassword){

            const body={
                username:data.username,
                email:data.email,
                password:data.password,
                full_name:data.full_name
            }
            

            const requestOptions={
                method:'PUT',
                headers:{
                    'content-type':'application/json',
                    'Authorization':`Bearer ${JSON.parse(token)}`
                },
                body:JSON.stringify(body)
            }

            fetch(`/user/user/${userId}`, requestOptions)
            .then(res=>res.json())
            .then(data=>{console.log(data)
                const reload =window.location.reload()
                reload()
            })
            .catch(err=>console.log(err))

        } else {
            alert("Passwords do not match")
        }


    }

    const deleteUser=(id)=>{

        const requestOptions={
            method:'DELETE',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`/user/user/${id}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            getAllUsers()
        
        })
        .catch(err=>console.log(err))
    }

    return (
        <div className="users container">
            <Modal show={show} size="lg" onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder='Your username'
                                {...register("username",{required:true,maxLength:25})}
                            />
                            {errors.username && <p style={{color:"red"}}><small>Username is required</small></p>}
                            {errors.username?.type==="maxLength"&&<p style={{color:"red"}}><small>Max characters are 25</small></p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder='Your email'
                                {...register("email",{required:true,maxLength:80})}
                            />
                            {errors.email && <p style={{color:"red"}}><small>Email is required</small></p>}
                            {errors.email?.type==="maxLength"&&<p style={{color:"red"}}><small>Max characters are 80</small></p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder='Your full name'
                                {...register("full_name",{required:true,maxLength:50})}
                            />
                            {errors.full_name && <p style={{color:"red"}}><small>Full name is required</small></p>}
                            {errors.full_name?.type==="maxLength"&&<p style={{color:"red"}}><small>Max characters are 50</small></p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder='Your password'
                                {...register("password",{required:true,minLength:8})}
                            />
                            {errors.password && <p style={{color:"red"}}><small>Password is required</small></p>}
                            {errors.password?.type==="minLength"&&<p style={{color:"red"}}><small>Min characters are 8</small></p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder='Confirm password'
                                {...register("confirmPassword",{required:true,minLength:8,validate:true})}
                            />
                            {errors.confirmPassword && <p style={{color:"red"}}><small>Confirm Password is required</small></p>}
                            {errors.confirmPassword?.type==="minLength"&&<p style={{color:"red"}}><small>Min characters are 8</small></p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Button variant="primary" onClick={handleSubmit(updateUser)}>
                                Save
                            </Button>
                        </Form.Group>
                    </form>
                </Modal.Body>
            </Modal>
            <h1>TwitterWatch</h1>
            {
                users.map(
                    (user, index)=>(
                        <User
                            key={index} 
                            username={user.username}
                            email={user.email}
                            full_name={user.full_name}
                            onClick={()=>{showModal(user.id)}}

                            onDelete={()=>{deleteUser(user.id)}}
                        />
                    )
                )
            }
        </div>
    )
}

const LoggedOutHome=()=>{
    return (
    <div className="home container">
        <h1 className="heading">Welcome to TwitterWatch</h1>
        <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
    </div>
    )
}

const HomePage=()=>{
    const [logged]=useAuth()
    return(
        <div>
            {logged?<LoggedinHome/>:<LoggedOutHome/>}
        </div>
    )
}

export default HomePage