import React,{useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../auth";
import {useForm} from "react-hook-form"
import PacmanLoader from 'react-spinners/PacmanLoader';


const LoggedInSearchTag=()=>{

    const{register,handleSubmit,reset,formState:{errors}}=useForm();
    const [loadingInProgress, setLoading] = useState(false);
    const history = useHistory()
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const submitForm = (data)=>{
        setLoading(true)

        const body={
            tag:data.tag,
            username:data.username
        }

        const requestOptions={
            method:"POST",
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(body)
        }


        fetch('/result/results', requestOptions)
            .then(res=>res.json())
            .then(data=>{
                if (data.msg === "Missing Authorization Header") {
                    alert(data.msg)
                }
                setLoading(false)
                history.push('/')
            })
            .catch(err=>console.log(err))

        reset()

    }

    return(
        <div>
            {loadingInProgress ? (
            <div className="loader-container">
                <PacmanLoader
                    color="#1DA1F2"
                    size={50}
                />
            </div>
        ) : (
            <div className='container'>
            <div className="form">
                <h1>Search Tag</h1>

                <from>
                    <Form.Group>
                        <Form.Label>Insert tag: </Form.Label>
                        <Form.Control type="text" placeholder='Twitter tag #'
                            {...register("tag",{required:true,maxLength:10})}
                        />
                        {errors.tag && <p style={{color:"red"}}><small>tag is required</small></p>}
                        {errors.tag?.type==="maxLength"&&<p style={{color:"red"}}><small>Max characters are 10</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Button as="sub" variant='primary' onClick={handleSubmit(submitForm)}>Search Tag</Button>
                    </Form.Group>
                </from>
            </div>
            </div>
        )}
        </div>
    )
}


const LoggedOutSearchTag=()=>{
    return (
    <div className="home container">
        <h1 className="heading">Welcome to TwitterWatch</h1>
        <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
    </div>
    )
}

const SearchTagPage=()=>{
    const [logged]=useAuth()
    return(
        <div>
            {logged?<LoggedInSearchTag/>:<LoggedOutSearchTag/>}
        </div>
    )
}

export default SearchTagPage