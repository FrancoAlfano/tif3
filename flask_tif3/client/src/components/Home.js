import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import Result from "./Result"

const LoggedinHome=()=>{
    const [results, setResults]=useState([]);

    useEffect(
        ()=>{
            fetch('/result/results')
            .then(res=>res.json())
            .then(data=>{
                setResults(data)
            })
            .catch(err=>console.log(err))
        },[]
    )

    const getAllResults=()=>{
        fetch('/result/results')
        .then(res=>res.json())
        .then(data=>{
            setResults(data)
        })
        .catch(err=>console.log(err))
    }

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const deleteResult=(id)=>{

        const requestOptions={
            method:'DELETE',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`/result/result/${id}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            getAllResults()
        
        })
        .catch(err=>console.log(err))
    }

    return (
        <div className="results container">
            <h1>TwitterWatch</h1>
            {
                results.reverse().map(
                    (result, index)=>(
                        <Result
                            key={index} 
                            username={result.username}
                            tag={result.tag}
                            positives={result.positives}
                            negatives={result.negatives}
                            neutrals={result.neutrals}
                            onDelete={()=>{deleteResult(result.id)}}
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