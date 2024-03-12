import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import './css/login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const LOGIN_URL = 'http://localhost:8080/login';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    //useRef() will allow us to set the focus on userRef (name input) once the component is loaded
    const userRef = useRef();
    //useRef() will allow us to set the focus on errRef (any input with error) if there is any error in field
    const errRef = useRef();
    //state
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //this useEffect() is used to set the focus on userRef (email input field) when the component load
    useEffect(() => {
        userRef.current.focus();
    }, [])

    //this useEffect is to empty the error message if we have any error before user changes the state of email and password
    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    //when we submit form if somehow empty form submitted it will test with regex for validation
    const handleSubmit = async (e) => {
        e.preventDefault();//reload the page

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ 
                    email:email,
                    password:pwd 
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: false
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ email, pwd, roles, accessToken });
            setEmail('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 500) {
                setErrMsg('Missing Email or Password');
            }else if (err.response?.status === 409) {
                setErrMsg('Incorrect Email');
            }else if (err.response?.status === 400) {
                setErrMsg('Incorrect Email and password');
            }else if (err.response?.status === 403) {
                setErrMsg('Incorrect Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                    <Link to={'/'}>Home</Link>
                    </p>
                </section>
            ) : (
                <section>
                    
                    <h1>Sign In</h1>
                    {/* to display error message on page using errRef and in class errMsg is state and "errMsg" is class name */}
                    {/* errMag (if the error message exist) ? (ternary operaor) "errMag" (show error message) : (else) "offscreen" (this para way off the screen) */}
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    {/* form */}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            
                        />
                        <button className='sign'>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                        <Link to={'/register'}>
                            Sign Up</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login