import {Badge} from "@mui/material";

export default function AppliedStatus({ status }){
    function badge(){
        let color = "info"
        let content = "None"
        if(status === "Pending") {
            color = "warning"
            content = "Pending"
        }else if(status === "Accepted"){
            color = "success"
            content = "Accepted"
        }
        else if(status === "Rejected"){
            content = "Rejected"
            color = "error"
        }
        return <Badge badgeContent={content} color={color}/>
    }

    return badge()
}