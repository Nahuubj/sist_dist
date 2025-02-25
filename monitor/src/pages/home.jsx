import { useEffect, useState } from "react";
import Monitor from "../components/monitor"

function Home() {

	const [dataServers, setDataServers] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			// si el endpoint cambia se debe cambiar la url aqui
			fetch("http://localhost:5168/api/Tcp/GetClients")
				.then((response) => response.json())
				.then((data) => { setDataServers(data); })
				.catch((error) => { console.error('Error al obtener los datos:', error); });
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Monitor dataServers={dataServers} />
		</>
	)
}

export default Home
