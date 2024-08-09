import { useState } from "react";
import { useMatch } from "react-router-dom";
import { useForm } from "react-hook-form";

export function Start() {
    const match = useMatch("/drawings/:drawingId/start");

    const [winners, setWinners] = useState([]);
    const { register, handleSubmit } = useForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onSubmit(data: any) {
        fetch(`http://localhost:8080/api/drawings/${match?.params.drawingId}/start`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
            .then(json => setWinners(json));
    }

    return (
        <main className='w-screen h-screen flex flex-col justify-center items-center gap-4'>
            <div className="w-72 flex flex-col gap-4">

                {winners.length ? <>
                    <h1 className="w-full text-center text-white text-3xl">Congratulations!!! 🎉🎉🎉</h1>
                    {<p className="text-center text-white">{winners.join(', ')}</p>}
                    <button onClick={() => setWinners([])} className='rounded-md text-white bg-purple-800 p-2 shadow-md hover:bg-purple-700 disabled:cursor-not-allowed w-full'>Try again!</button>

                </> : <>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col">

                        <h1 className='text-center text-white font-thin text-5xl'>GoodLuck</h1>
                        <div className="flex flex-col space-y-1">
                            <input id="quantity" {...register("quantityOfWinners", {
                                required: true, min: 1
                            })} type="number" className="p-2 rounded-md outline-none text-blue-950 ring-2 ring-purple-900" placeholder="Quantity of winners" />
                        </div>
                        <button onSubmit={onSubmit} className='rounded-md bg-purple-800 p-2 shadow-md hover:bg-purple-700 disabled:cursor-not-allowed w-full'>Start</button>
                    </form>
                </>}

            </div>
        </main>
    );
}