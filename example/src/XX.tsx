import {Access, FC, request, useAccess, useModel, useNavigate, useRequest} from "umi";
import {Button, Spin} from "antd";
import {useEffect} from "react";



const XX:FC = (props) => {
    console.log(props)
    return (
        <>ss</>
    )
}

export default XX

XX.getInitialProps=async ()=>{
    await request('http://www.google.com',{})
    return Promise.resolve({xx:"bb"})
}
XX.meta={
    "vvvvv":"bb"
}
XX.loading=<>11</>

