import { useContext } from "react";
import { AuthContext, type IAuthContext } from "react-oauth2-code-pkce";

function LoginStatus() {
    const auth: IAuthContext = useContext(AuthContext);

    return (
        <div>
            {auth.token ? (
                <div>
                    <p>Logged in</p>
                    <p>{auth.token}</p>
                    <button onClick={() => auth.logOut()}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Not logged in</p>
                    <button onClick={() => auth.logIn()}>Login</button>
                </div>
            )}
        </div>
    );
}

export default LoginStatus;