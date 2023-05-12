import React, {useEffect, useState} from "react";
import { Link, useHistory} from "react-router-dom";
import { useAuth } from "../auth";
import Result from "./Result"
import jwt_decode from 'jwt-decode' 

const LoggedinMoreData=()=>{
    const [results, setResults]=useState([]);
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const history = useHistory()

    useEffect(
        ()=>{
            const requestOptions={
                method:'GET',
                headers:{
                    'content-type':'application/json',
                    'Authorization':`Bearer ${JSON.parse(token)}`
                }
            }
            fetch('/result/results',requestOptions)
            .then(res=>res.json())
            .then(data=>{
                setResults(data)
            })
            .catch(err=>console.log(err))
        },[]
    )

    const getAllResults=()=>{
        
        const requestOptions={
            method:'GET',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            }
        }
        fetch("/result/results",requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setResults(data)
        })
        .catch(err=>console.log(err))
    }

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

    const moreResult=(id)=>{

        const requestOptions={
            method:'GET',
            headers:{
                'content-type':'application/json',
                'Authorization':`Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`/result/result/${id}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            history.push('/moredata')
        })
        .catch(err=>console.log(err))
    }

    return (
        <div className="results container">
            <h1>More data</h1>
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
                            onMore={()=>{moreResult(result.id)}}
                        />
                    )
                )
            }
        </div>
    )
}

const LoggedOutMoreData=()=>{
    return (
    <div className="home container">
        <h1 className="heading">More data on the tag</h1>
        <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
    </div>
    )
}

const MoreData=()=>{
    const [logged]=useAuth()
    return(
        <div>
            {logged?<LoggedinMoreData/>:<LoggedOutMoreData/>}
        </div>
    )
}

export default MoreData