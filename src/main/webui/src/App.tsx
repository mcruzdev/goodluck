import { useTransition } from 'react'
import { useNavigate } from 'react-router-dom';

function App() {

  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate();

  function onButtonClick() {
    startTransition(function () {
      fetch('http://localhost:8080/api/drawings', {
        method: 'POST'
      }).then(response => response.json()).then(function (json) {
        navigate("/drawings/" + json.id + "/qrcode");
      })
    });
  }

  return (
    <>
      <main className='bg-blue-500 w-screen h-screen flex flex-col justify-center items-center gap-4'>
        <div className='w-72 flex flex-col gap-4'>

          <h1 className='text-center text-white font-thin text-5xl'>GoodLuck</h1>

          <button onClick={onButtonClick} disabled={isPending} className='w-full  text-white rounded-md bg-purple-800 p-2 shadow-md hover:bg-purple-700 disabled:cursor-not-allowed'>Create new drawing!</button>
        </div>
      </main>
    </>
  )
}

export default App
