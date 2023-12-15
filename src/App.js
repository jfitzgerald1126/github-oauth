import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const CLIENT_ID = "c2f7c573f77adca3ec14";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  // forward user to github login screen with client ID
  // use log in
  // forwarded back with a code like localhost:3000/?code=ASDASDASD
  // use code to get access token

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    console.log(codeParam);

    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET"
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
            setRerender(!rerender);
          } 
        })
      }
      getAccessToken();
    }
  }, []);

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken")
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      setUserData(data);
    });
  }

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }


  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ? 
        <>
          <h1>We have the access token</h1>
          <button onClick={() => { localStorage.removeItem("accessToken"); setRerender(!rerender); }}>
            Log out
          </button> 
          <h3>Get User Data from GitHub API</h3>
          <button onClick={getUserData}>Get Data`</button>
          {Object.keys(userData).length !== 0 ?
          <>
            <h4>Hey there {userData.login}</h4>
            <img width="100px" height="100px" src={userData.avatar_url}/>
            <a href={userData.html_url} style={{"color": "white"}}>Link to GitHub profile</a>
          </>
          :
          <>
          </>
          }
        </> 
        :
        <>
          <h3>User is not logged in</h3>
          <button onClick={loginWithGithub}>
            Login with GitHub
          </button>
        </>
        }
      </header>
    </div>
  );
}

export default App;
