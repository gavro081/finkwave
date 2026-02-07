import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { PlayerProvider } from "./context/playerContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<PlayerProvider>
				<App />
			</PlayerProvider>
		</AuthProvider>
	</StrictMode>,
);
