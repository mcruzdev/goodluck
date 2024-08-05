import { useMatch, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Enter() {

    const { register, handleSubmit, formState: { errors } } = useForm();


    const match = useMatch("drawings/:drawingId/enter");
    const navigate = useNavigate();
    const drawingId = match?.params.drawingId;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onSubmit(data: any) {
        fetch(`http://localhost:8080/api/drawings/${drawingId}/participants`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status !== 201) {
                throw new Error('Bad request, invalid form!')
            }
        })
            .then(json => {
                console.log("Participant created: ", json);
                navigate(`/drawings/${drawingId}/goodluck`);
            });
    }

    return (
        <main className='bg-blue-500 w-screen h-screen flex flex-col justify-center items-center gap-4'>
            <h1 className='text-center text-white font-thin text-5xl'>GoodLuck</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-200 gap-y-2">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="name" className="text-white font-light" >Name</label>
                    <input {...register("name", {
                        required: true
                    })} id="name" type="text" className="p-2 rounded-md outline-none" placeholder="Name" />
                    {errors.name && <p className="text-red-900">Invalid name</p>}
                </div>
                <div className="flex flex-col space-y-1 my-4">
                    <label htmlFor="email" className="text-white font-light">Email</label>
                    <input {...register("email", {
                        required: true
                    })} id="email" type="email" className="p-2 rounded-md outline-none" placeholder="email@email.com" />
                    {errors.email && <p className="text-red-900">Invalid email</p>}

                </div>
                <button onSubmit={onSubmit} className='rounded-md text-white bg-purple-800 p-2 shadow-md hover:bg-purple-700 disabled:cursor-not-allowed w-full'>Enter</button>
            </form>
        </main>
    );
}