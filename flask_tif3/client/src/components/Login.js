import React,{useState} from 'react'
import {Form, Button, Alert} from 'react-bootstrap'
import { useHistory, Link } from "react-router-dom"
import {useForm} from 'react-hook-form'
import {login} from '../auth'

const LoginPage=()=>{

    const {register,handleSubmit,reset,formState:{errors}}=useForm()
    const [show,setShow]=useState(false)
    const [serverResponse, setServerResponse]=useState('')
    const history = useHistory()
    const [alertVariant, setAlertVariant]=useState('')


    const loginUser=(data)=>{

        const requestOptions={
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(data)
        }
        
        fetch('/auth/login', requestOptions)
        .then(res=>res.json())
        .then(data=>{
            
            if (data.message !== undefined) {
                setServerResponse(data.message)
                if (data.message.includes("incorrect")) {
                    setAlertVariant("danger")
                }
                setShow(true)
            } else {
                login(data.access_token)
                history.push('/')
            }

        })
        .catch(err=>console.log(err))

        reset();
    }

    return(
        <div className="container">
            <div className="form">
                {show?
                <>
                <Alert variant={alertVariant} onClose={() => {setShow(false)}} dismissible>
                    <p>{serverResponse}</p>
                </Alert>
                <h1>Login</h1>
                
                </>
                :
                <h1>Login</h1>
                }
                <from>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder='Your username'
                            {...register('username',{required:true, maxLength:25})}
                        />
                    </Form.Group>
                    {errors.username && <p style={{color:'red'}}><small>Username is required</small></p>}
                    {errors.username?.type === "maxLength" && <p style={{color:'red'}}><small>Max length is 25</small></p>}
                    <br></br>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder='Your password'
                            {...register('password',{required:true, minLength:8})}
                        />
                    </Form.Group>
                    {errors.password && <p style={{color:'red'}}><small>Password is required</small></p>}
                    {errors.password?.type === "minLength" && <p style={{color:'red'}}><small>Min length is 8</small></p>}
                    <br></br>
                    <Form.Group>
                        <small>Don't have an account?, <Link to='/signup'>Sign Up</Link></small>
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Button as="sub" variant='primary' onClick={handleSubmit(loginUser)}>Login</Button>
                    </Form.Group>
                </from>
            </div>
        </div>
    )
}

export default LoginPage