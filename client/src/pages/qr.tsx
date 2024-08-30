
import { useState } from "react";
import QRCode from "react-qr-code";

function qr() {

    const [organizer, setOrganizer] = useState("")
    // wallet address
    // type
    // additional information

    // organization options can be stored in json or database somewhere in next backend


    return (
        <div><QRCode value="hey" /></div>
    )
}

export default qr