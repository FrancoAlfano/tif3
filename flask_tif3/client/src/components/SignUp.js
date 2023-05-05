import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'


const SignUpPage =()=>{

    const{register,handleSubmit,reset,formState:{errors}}=useForm();
    const [show,setShow]=useState(false)
    const [serverResponse, setServerResponse]=useState('')
    const [alertVariant, setAlertVariant]=useState('')

    const submitForm = (data)=>{
    
        if (data.password === data.confirmPassword){
            const body={
                username:data.username,
                email:data.email,
                password:data.password,
                full_name:data.full_name
            }

            const requestOptions={
                method:"POST",
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify(body)
            }

    
            fetch('/auth/signup', requestOptions)
                .then(res=>res.json())
                .then(data=>{
                    setServerResponse(data.message)
                    if (data.message.includes("created")) {
                        setAlertVariant("success")
                    } else if (data.message.includes("already exists")) {
                        setAlertVariant("danger")
                    }
                    setShow(true)

                })
                .catch(err=>console.log(err))

            reset()
        }
        
        else{
            alert("Passwords do not match")
        }   

    }

    return(
        <div className="container">
            <div className="form">
                {show?
                <>
                <Alert variant={alertVariant} onClose={() => {setShow(false)}} dismissible>
                    <p>{serverResponse}</p>
                </Alert>
                <h1>Sign Up</h1>
                
                </>
                :
                <h1>Sign Up</h1>
                }

                <from>
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
                        <Button as="sub" variant='primary' onClick={handleSubmit(submitForm)}>Create User</Button>
                    </Form.Group>
                </from>
            </div>
        </div>
    )
}

export default SignUpPage