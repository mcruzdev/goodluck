import { useEffect, useState } from "react"
import { useMatch, useNavigate } from "react-router-dom"

export function ReadQRCode() {

    const match = useMatch("drawings/:drawingId/qrcode")
    const drawingId = match?.params.drawingId
    const [participants, setParticipants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {

            fetch(`http://localhost:8080/api/drawings/${drawingId}/participants`, {
                method: "GET"
            }).then(response => response.json())
                .then(json => {
                    console.log("Getting participants: ", json.length);
                    setParticipants(json)
                });

        }, 5000)

        return () => clearInterval(interval);
    }, [participants])

    return (
        <main className='bg-blue-500 w-screen h-screen flex flex-col justify-center items-center gap-4'>
            <img className="w-72" height={300} width={300} alt="QRCode" src={`http://localhost:8080/api/drawings/${drawingId}/qrcode`} />
            <p className="text-white w-72 text-xl">Scan the QRCode to participate</p>
            <div className="w-72">
                <button onClick={() => {
                    navigate(`/drawings/${drawingId}/start`)
                }} className='rounded-md bg-purple-800 p-2 shadow-md hover:bg-purple-700  text-white disabled:cursor-not-allowed w-full'>Start</button>
            </div>
            <div>
                <p className="text-white">Participants: {participants.length}</p>
            </div>
        </main>
    )
}