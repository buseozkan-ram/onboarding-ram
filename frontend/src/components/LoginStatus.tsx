import { useContext } from "react";
import { AuthContext, type IAuthContext } from "react-oauth2-code-pkce";
import Main from "./Main";
import Button from "./places/Button";

function LoginStatus() {
    const auth: IAuthContext = useContext(AuthContext);

    return (
        <div>
            {!auth.token ? (
                <div>
                    <Button onClick={() => auth.logIn()} colour={"bg-blue-500"}>
                        Login
                    </Button>
                </div>
            ) : (
                <div>
                    <Button onClick={() => auth.logOut()} colour={"bg-blue-500"}>
                        Logout
                    </Button>
                    <div className="mt-4 flex flex-col items-start gap-4">
                        <Main authToken={auth.token} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginStatus;