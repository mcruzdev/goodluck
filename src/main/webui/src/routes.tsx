import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import { ReadQRCode } from "./pages/ReadQRCode";
import Enter from "./pages/Enter";
import GoodLuck from "./pages/GoodLuck";
import { Start } from "./pages/Start";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />}></Route>
            <Route path="drawings/:drawingId/qrcode" element={<ReadQRCode />}></Route>
            <Route path="drawings/:drawingId/enter" element={<Enter />}></Route>
            <Route path="drawings/:drawingId/goodluck" element={<GoodLuck />}></Route>
            <Route path="drawings/:drawingId/start" element={<Start />}></Route>
        </>
    )
);