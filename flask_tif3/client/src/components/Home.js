import React, {useEffect, useState} from "react";
import { Link, useHistory} from "react-router-dom";
import { useAuth } from "../auth";
import Result from "./Result"
import ImageModal from './ImageModal'

const LoggedinHome=()=>{
    const [results, setResults]=useState([]);
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const history = useHistory()
    const imageUrl = '/images/pepsi_pie_chart_2023-05-11_20-26-48.png';
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
      };

    useEffect(
        ()=>{
            const requestOptions={
                method:'GET',
                headers:{
                    'content-type':'application/json',
                    'Authorization':`Bearer ${JSON.parse(token)}`
                }
            }
            fetch('/result/results', requestOptions)
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('REACT_TOKEN_AUTH_KEY')
                    throw new Error('Session expired');
                }
                else if (res.status === 422) {
                    localStorage.removeItem('REACT_TOKEN_AUTH_KEY')
                    throw new Error('Session expired');
                }
                return res.json()
            })
            .then((data) => {
                setResults(data)
            })
            .catch((err) => {
                history.push('/')
            })
        }, [])

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

    const moreResult = (id) => {
        const requestOptions = {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
      
        fetch(`/result/result/${id}`, requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setModalImageUrl(imageUrl);
            setModalIsOpen(true);
            openModal();
          })
          .catch((err) => console.log(err));
      };
      
      

      return (
        <div className="results container">
          <h1>TwitterWatch</h1>
          {results.reverse().map((result, index) => (
            <Result
              key={index}
              username={result.username}
              tag={result.tag}
              positives={result.positives}
              negatives={result.negatives}
              neutrals={result.neutrals}
              onDelete={() => {
                deleteResult(result.id)
              }}
              onMore={() => {
                moreResult(result.id)
              }}
            />
          ))}
          {modalIsOpen && (
            <ImageModal
              modalImageUrl={modalImageUrl}
              closeModal={() => setModalIsOpen(false)}
            />
          )}
        </div>
      );
    };

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