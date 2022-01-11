import React, { useState, useEffect } from 'react';
import HistoryOrderIPO from '../components/HistoryOrderIPO';
import interactions from "../store/interactions";
import Login from './login';
import { connect } from 'react-redux'
import Spinner from '../components/Spinner';

const Orders = (props) => {
    
    let uid = localStorage.getItem("account-info");
    const [id, setId] = useState([]);
    let ids = []
    useEffect(() => {
        if (uid) {
            for (var i = 0; i < Object.entries(interactions).length; i++) {
                ids.push(Object.entries(interactions)[i][0])
            }
            setId(ids);
        }
    }, []);


    return (
        <>
            {
                uid ?
                    (
                    <div>
                        <ul className="d-flex justify-content-between market-order-item">
                            <li className="amount-type" >Name</li>
                            <li className="amount-type" >Time</li>
                            <li className="amount-type" >Buy/Sell</li>
                            <li className="amount-type" >Price</li>
                            <li className="amount-type" >Amount</li>
                        </ul>
                        {
                            // id.map((obj, key) => (
                            //     <HistoryOrderIPO id={key} />
                            // )
                            // )
                            <HistoryOrderIPO id={id.length-1} />
                        }
                    </div>
                    )
                     : <Login />
            }
        </>
    );
}

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(Orders);
