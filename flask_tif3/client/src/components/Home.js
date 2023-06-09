import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth, authFetch } from "../auth";
import Result from "./Result";
import ImageModal from "./ImageModal";
import "../styles/results.css"

const LoggedinHome = () => {
  const [results, setResults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ModalImageUrls, setModalImageUrls] = useState([]);
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const history = useHistory();
  const [modalIndex, setModalIndex] = useState(null);
  const [csvContent, setCSVContent] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/result/results");
        if (response.status === 401 || response.status === 422) {
            // Token expired, try refreshing the token
            const refreshTokenResponse = await authFetch("/auth/refresh", {
                method: "POST",
                body: JSON.stringify({
                refresh_token: JSON.parse(token).refresh_token,
                }),
            });
            if (refreshTokenResponse.ok) {
                const { access_token } = await refreshTokenResponse.json();
                localStorage.setItem("REACT_TOKEN_AUTH_KEY", JSON.stringify(access_token));
                // Retry the original request with the new token
                const refreshedResponse = await authFetch("/result/results");
                if (refreshedResponse.ok) {
                  const data = await refreshedResponse.json();
                  setResults(data);
                } else {
                throw new Error("Failed to fetch data after refreshing token");
                }
            } else {
                // Token refresh failed, redirect to login page
                throw new Error("Failed to refresh token");
            }
        } else {
            const data = await response.json();
            setResults(data);
        }
      } catch (err) {
        localStorage.removeItem("REACT_TOKEN_AUTH_KEY");
        history.push("/");
      }
    };

    fetchData();
  }, []);


    //Show all results
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

    //Delete a search
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

    //Show a modal with the images made from the search
    const moreResult = (id) => {
        const requestOptions = {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
      
        fetch(`/result/result/${results[id].id}`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          const { word_cloud, pie_chart, frequency } = data;
          const imageUrls = ["/images/"+pie_chart, "/images/"+word_cloud, "/images/"+frequency];
          setModalImageUrls(imageUrls);
          setModalIndex(id);
          setModalIsOpen(true);
          openModal();
    })
    .catch((err) => console.log(err));
    };

    //Make an analysis on old and new data
    const compare = (id) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
    
      fetch(`/result/result/${results[id].id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const { tag, username } = data;
        console.log(tag, username)      
  })
  .catch((err) => console.log(err));
  };



      return (
        <div className="container">
          <h1>TwitterWatch</h1>
          <div className="results">
          {results.reverse().map((result, index) => (
            <Result
              key={index}
              username={result.username}
              tag={result.tag}
              positives={result.positives}
              negatives={result.negatives}
              neutrals={result.neutrals}
              word_cloud={result.word_cloud}
              pie_chart={result.pie_chart}
              frequency={result.frequency}
              start_date={result.start_date}
              end_date={result.end_date}
              max_tweets={result.max_tweets}
              onDelete={() => {deleteResult(result.id)}}
              onMore={() => {moreResult(index)}}
              onCompare={() => {compare(index)}}
            />
          ))}
          </div>
          {modalIsOpen && (
            <ImageModal
              modalImageUrls={ModalImageUrls}
              closeModal={() => {
                setModalIsOpen(false);
                setModalIndex(null);
              }}
              csvContent={csvContent} // Pass the csvContent prop
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