import { useEffect } from "react";

function App() {
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("http://localhost:8080/");
			const data = await response.json();
			console.log(data);
		};
		fetchData();
	});

	return (
		<>
			<p className="text-red-500">ok</p>
		</>
	);
}

export default App;
