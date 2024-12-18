import InputBox from "../../SmallComponents/InputBox/InputBox";
import styles from "./UserAuthForm.module.css";
import { Link, Navigate } from "react-router-dom";
import google_img from "..//../assets/AppImages/google.jpeg";
import AnimationWrapper from "../../SmallComponents/Animation/Animation";
import { useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { storeInSession } from "../../Common/Session";
import { useDispatch, useSelector } from "react-redux";
import { userContextActions } from "../../Store/userContext";
import authWithGoogle from "../../Common/Firebase";

const UserAuthForm = ({ type }) => {

    const userContext = useSelector(store => store.userData);
    const dispatch = useDispatch();

    const storeData = async (data) => {
        await storeInSession("user", JSON.stringify(data));
        await dispatch(userContextActions.setUserAuth(data));
    }

    const formData = () => {
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        return formData;
    }

    const handleSignUp = async (event) => {
        event.preventDefault();

        await fetch("http://localhost:3000/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(formData())
        }).then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    return toast.error(data.error);
                }
                else {
                    storeData(data);
                    return toast.success("Account is successfully created");
                }
            })

    }

    const handleSignIn = async (event) => {
        event.preventDefault();
        await fetch("http://localhost:3000/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(formData())
        }).then(resp => resp.json())
            .then(async (data) => {
                if (data.error) {
                    return toast.error(data.error);
                }
                else {
                    await storeData(data);
                    return toast.success("successfully loged-in");
                }
            })
    }

    const handleGoogleAuth = (event) => {
        event.preventDefault();

        authWithGoogle().then( async (user) => {
            await fetch("http://localhost:3000/auth/google-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({access_token : user.accessToken})
            }).then(resp => resp.json())
                .then(async (data) => {
                    if (data.error) {
                        return toast.error(data.error);
                    }
                    else {
                        await storeData(data);
                        return toast.success("successfully loged-in");
                    }
                })
        })
        .catch((err) => {
            return toast.error("Trouble login through google")
        })
    }

    return (
        userContext.access_token ?
            <Navigate to="/" /> :
            <AnimationWrapper keyValue={type}>
                <section >
                    <form id="formElement" className={styles["container"]}>
                        <Toaster />
                        <h1>{type === "sign-up" ? "join us today" : "welcome back"} </h1>
                        <div className={styles["confirm-input"]}>
                            <div className={styles["inputs"]}>
                                {type === "sign-up" ? <InputBox name="fullname" placeholder="Full Name" type="text" value="" icon="name" required /> : null}
                                <InputBox name="email" placeholder="Email" type="email" value="" icon="email" required />
                                <InputBox name="password" placeholder="Password" type="password" value="" icon="password" required />
                            </div>
                            {type === "sign-up" ? <button onClick={handleSignUp} className={styles["sign-up"]}>sign-up</button> : <button type="submit" onClick={handleSignIn} className={styles["sign-up"]}>sign-in</button>}
                        </div>
                        <div className={styles["sign-google"]}>
                            <Link to=""><button className={styles["google"]} onClick = {handleGoogleAuth}> <div><img src={google_img} /> continue with google</div></button></Link>
                            <p>{type === "sign-up" ? "Already a member ?" : "Don't have an account ?"}{type === "sign-up" ? <Link to="/sign-in"> Sign in here</Link> : <Link to="/sign-up"> Join us today</Link>}</p>
                        </div>
                    </form>
                </section>
            </AnimationWrapper>
    )
}

export default UserAuthForm;