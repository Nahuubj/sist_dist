import { useEffect, useState } from "react";
import Monitor from "../components/monitor"

function Home() {

	const [dataServers, setDataServers] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			console.log("HOLA");
			// si el endpoint cambia se debe cambiar la url aqui
			fetch("http://localhost:3000/GetDisks")
				.then((response) => response.json())
				.then((data) => { setDataServers(data.map(x=> x.data)); })
				.catch((error) => { console.error('Error al obtener los datos:', error); });
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Monitor dataServers={dataServers} />
		</>
	)
}

export default Home
