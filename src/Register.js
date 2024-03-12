import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import './css/login.css';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
// defining all the regular expression
const USER_REGEX = /^[a-zA-Z][a-zA-Z ]*$/;
const Email_REGEX=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'http://localhost:8080/add';

const Register = () => {
    //useRef() will allow us to set the focus on userRef (name input) once the component is loaded
    const userRef = useRef();
    //useRef() will allow us to set the focus on errRef (any input with error) if there is any error in field
    const errRef = useRef();

    //state for all fields
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    //state for error message and success
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //this useEffect() is used to set the focus on userRef (name input field) when the component load
    useEffect(() => {
        userRef.current.focus();
    }, [])//nothing in the dependency array

    //to valiadte the name 
    useEffect(() => {
        const result=USER_REGEX.test(user);//testing user state against the regex
        console.log(result);//to see the result on console (true/false)
        console.log(user);//to check user state
        setValidName(result);
    }, [user])//user is in the dependency array anytime it will change then it will check the validation of that field 

    //to validate email
    useEffect(() => {
        const result=Email_REGEX.test(email);//testing email state against the regex
        console.log(result);//to see the result on console (true/false)
        console.log(user);//to check email state
        setValidEmail(result);
    }, [email])//email is in the dependency array anytime it will change then it will check the validation of that field 

    //to validate password and check confirm password
    useEffect(() => {
        const result=PWD_REGEX.test(pwd);//testing password state against the regex
        console.log(result);//to see the result on console (true/false)
        console.log(user);//to check email state
        setValidPwd(result);
        const match=pwd === matchPwd;//check password match or not
        setValidMatch(match);
    }, [pwd, matchPwd])//pwd and matchpwd is in the dependency array anytime it will change then it will check the validation of that field 

    //for error message
    useEffect(() => {
        setErrMsg('');
    }, [user,email, pwd, matchPwd])//if user changes the state of one of these three array dependency then it will clear error message

    //when we submit form if somehow empty form submitted it will test with regex for validation
    const handleSubmit = async (e) => {
        e.preventDefault();//reload the page
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v3 = Email_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;//returning so we dont submit anything to our backend
        }
        // console.log(user,email,pwd);
        // setSuccess(true);
        try {
            
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ 
                    name:user,
                    email:email,
                    password:pwd
                }),
                {
                 
                    headers: { 'Content-Type': 'application/json' ,},
                    withCredentials: false
                }
                
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setEmail('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response!!');
            } else if (err.response?.status === 400) {
                setErrMsg('Email Already Taken!!');
            } else {
                setErrMsg('Registration Failed!!')
            }
            errRef.current.focus();
        }
    }
    
    return (
        <>
            {/* if we have a success state redirect to login page */}
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                 
                        <Link to={'/login'}>LogIn</Link>
                    
                       
                    </p>
                </section>
            ) : (
                <section className="signup">
                    {/* heading */}
                    <h2>Create an Account</h2>
                    {/* to display error message on page using errRef and in class errMsg is state and "errMsg" is class name */}
                    {/* errMag (if the error message exist) ? (ternary operaor) "errMag" (show error message) : (else) "offscreen" (this para way off the screen) */}
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    {/* form */}
                    <form onSubmit={handleSubmit} className="input-field">
                        <label htmlFor="username">{/* html4 attribute value shoud be same as id */}
                            Full Name:
                            {/* if name is valid then valid class (show icon) else hide class (display none) */}
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            {/* if name is valid or user state exist then hide class (display none) else invalid class (show icon) */}
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your Name"
                            id="username"
                            ref={userRef} //to set focus on this field once component is loaded
                            autoComplete="off" //to not get suggetions ofprevious value
                            onChange={(e) => setUser(e.target.value)} //ties the input to the user state
                            value={user}
                            required
                            //attributes for accessibility
                            aria-invalid={validName ? "false" : "true"}//set to true when the compoenet load cause we not have a valid name
                            aria-describedby="uidnote"//describe the input field
                            onFocus={() => setUserFocus(true)}//when click set focus true
                            onBlur={() => setUserFocus(false)}//when leave set focus false
                        />
                        {/* if user focus is true and user state exist (its not empty) and not a valid name (wait till one character is typed) show instruction else offscreen*/}
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must have only letters along with space.<br />
                            Numbers amd special characters are not allowed.
                        </p>

                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your Email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="eidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            @gmail.com.
                        </p>


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        
                        <input
                            type="password"
                            placeholder="Create a Password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm a Password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button className='sign' disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false}>Create</button>
                    </form>
                    <p className="line"> 
                        
                            {/*put router link here*/}
                            Already have an account?<Link to={'/login'}>LogIn</Link> 
                       
                    </p>
                </section>
            )}
        </>
    )
}

export default Register