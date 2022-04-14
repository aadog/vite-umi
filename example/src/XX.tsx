import {Access, FC, request, useAccess, useModel, useNavigate, useRequest} from "umi";
import {Button, Spin} from "antd";



const XX:FC = (props) => {
    console.log(props)
    return (
        <Access accessible={true} fallback={<>没有权限</>} />
    )
}

export default XX

XX.getInitialProps=()=>{
    return {"props1":"test"}
}
