import api from "../api";
import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({children}){

    const [isAuthorized,setIsAuthorized]=useState(null)

    useEffect(()=>{
        auth().catch((err)=>setIsAuthorized(false))
    },[])
    
    const refreshToken=async ()=>{
        const token=localStorage.getItem(REFRESH_TOKEN)
            
        try{
            const res=await api.post("api/token/refresh/",{refresh:token});

            if(res.status==200){
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                setIsAuthorized(true)
            }
            else{
                setIsAuthorized(false)
            }

        }
        catch(err){
            console.log(err)
            setIsAuthorized(false)
        }

    }

    const auth=async ()=>{

        const token = localStorage.getItem(ACCESS_TOKEN)

        if(!token){
            setIsAuthorized(false)
            return 
        }
        
        const decode=jwtDecode(token)
        const now= Date.now()
        const tokenExp=decode.exp

        if(tokenExp<now){
            await refreshToken()
            return
        }
        else{
            setIsAuthorized(true)
            return
        }

    }

    if(isAuthorized===null){
        return <div>Loading ....</div>
    }

    return isAuthorized?children:<Navigate to="/login"/>

    
}

export default ProtectedRoute;