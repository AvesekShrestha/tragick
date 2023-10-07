import { useEffect } from 'react';
// import { LoggedOutView } from './home';
import Login from './login';
import { logout } from '../utils/auth';

const Logout = () => {
    useEffect(() => {
        logout();
    }, []);
    // return <LoggedOutView title="You have been logged out" />;
    return <Login/>
};

export default Logout;
