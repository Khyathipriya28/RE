import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../sassStyles/pages/AllUsersList.scss'
import AccessAllowed from '../components/AccessAllowed'
import AllUsersInfo from '../components/AllUsersInfo'
import AllEmails from '../components/AllEmails'
import { getAllEmails } from '../features/addEmailsSlice'
import { getAllUsers } from '../features/allUsersSlice'


const AllUsersList = () => {

    const [newsSubscribers, setNewsSubscribers] = useState(true)

    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(getAllEmails())
        dispatch(getAllUsers())
    },[])


    const logins = useSelector(state => state.login)
    const {isLoggedIn } = logins

    useEffect(() => {
        if (!isLoggedIn) {
            setNewsSubscribers(false)
        }
    }, [isLoggedIn])


    return (
        <>
            <AccessAllowed />
            <div className={newsSubscribers ? "dashboardContainer" : "dashboardContainer hide"}>
                <AllUsersInfo />
                <AllEmails />
            </div>
        </>
    )
}

export default AllUsersList
