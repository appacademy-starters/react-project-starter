import React, {useState, useContext} from 'react';
import AuthContext from '../auth'

function UserForm(props) {
    const { id } =  props.location.state.user;
    console.log(id)
    const [username, setUsername] = useState(props.location.state.user.username);
    const [email, setEmail] = useState(props.location.state.user.email);

    const [errors, setErrors] = useState([]);
    const {fetchWithCSRF} = useContext(AuthContext);

    const submitForm = (e) => {
        e.preventDefault();

        async function loginUser() {
            const response = await fetchWithCSRF(`/api/users/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    email
                })
            });

            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            }
        }
        loginUser();
    }
    return (
        <form onSubmit={submitForm}>
            {errors.length ? errors.map((err) => <li key={err} >{err}</li>) : ''}
            <div className="field">
                <label>Email: </label>
                    <div className="control">
                        <input className="input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                    </div>
            </div>
            <div className="field">
                <label>Username: </label>
                <div className="control">
                    <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" />
                </div>
            </div>

            <button>Update</button>
        </form>
    );
}
export default UserForm;