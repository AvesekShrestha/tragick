import React, {useState, useEffect} from 'react';
import {useAuthStore} from '../store/auth';
import useAxios from '../utils/useAxios';
import Dashboard from "./Sidebar.jsx";
import Balance from "./Balance.jsx";

export default function ShowInstances() {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    const [instances, setInstances] = useState([]);
    const api = useAxios();

    async function owner(owner_id) {
        try {
            const response = await api.get(`users/${owner_id}`);
            return response.data['vendor_name'];
        } catch (error) {
            console.error('Error fetching owner:', error);
            return 'N/A';
        }
    }

    useEffect(() => {
        const getInstances = async () => {
            try {
                const response = await api.get('instances/');
                const instancesWithOwnerNames = await Promise.all(
                    response.data.data.map(async (instance) => ({
                        ...instance,
                        owner: await owner(instance.owner),
                    }))
                );
                setInstances(instancesWithOwnerNames);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        getInstances();
    }, []);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <Dashboard/>
                    </div>
                    <div className="col-md-10 d-flex flex-column ">
                        <Balance className="align-self-start"/>
                        <div className="container mt-5">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col">Instance Id</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Serial Number</th>
                                    <th scope="col">Created at</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {instances.map((element, index) => (
                                    <tr key={index}>
                                        <th scope="row">{element.id.substring(0, 3)}</th>
                                        <td>{element.owner}</td>
                                        <td>{element.price}</td>
                                        <td>{element.serial_no}</td>
                                        <td>{element.created_at}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
