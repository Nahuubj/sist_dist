import React, { useState, useEffect } from 'react';
import Card from './card';


const Monitor = ({ dataServers }) => {
    const [servers, setServers] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

    const [totalDiskUsage, setTotalDiskUsage] = useState(0);
    const [totalDiskFree, setTotalDiskFree] = useState(0);

    const [sumTotalFree, setSumTotalFree] = useState(0);
    const [sumTotalDiskUsage, setSumTotalDiskUsage] = useState(0);

    const refreshTime = 3000;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setCurrentDate(new Date().toLocaleDateString());
        }, refreshTime);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            let totalDisk = 0;
            let totalDiskUsage = 0;
            let totalDiskFree = 0;

            const summedServers = dataServers.reduce((acc, server) => {
                if (server.status === 1) {
                    const existingServer = acc.find(s => s.id === server.id && s.status === 1);
                    if (existingServer) {
                        existingServer.totalDisk += server.totalDisk;
                        existingServer.diskUsage += server.diskUsage;
                        existingServer.diskFree += server.diskFree;
                    } else {
                        acc.push({ ...server });
                    }

                    totalDisk += server.totalDisk;
                    totalDiskUsage += server.diskUsage;
                    totalDiskFree += server.diskFree;
                    const totalDiskUsagePercentage = (totalDiskUsage / totalDisk) * 100;
                    const totalDiskFreePercentage = (totalDiskFree / totalDisk) * 100;

                    setTotalDiskUsage(totalDiskUsagePercentage);
                    setTotalDiskFree(totalDiskFreePercentage);
                } else {
                    acc.push({ ...server });
                }
                return acc;
            }, []);

            setSumTotalDiskUsage(totalDiskUsage);
            setSumTotalFree(totalDiskFree);

            setServers(summedServers);
        }, refreshTime);

        return () => clearInterval(interval);
    }, [dataServers]);

    return (
        <div className="container mx-auto px-4">
            <div>
                <div className="flex items-center justify-center mb-4">
                    <img src={"cns.jpg"} alt="Monitor Nacional de Almacenamiento" className="h-auto max-w-md rounded mr-4" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white-800">Monitor Nacional de Almacenamiento</h1>
                    </div>
                </div>
                <div className="bg-white rounded text-black text-xl">
                    <h2>Almacenamiento total</h2>
                    <p>Reportaron: {dataServers.filter(server => server.status === 1).length} / {dataServers.length}</p>
                    <div className="flex flex-col  md:flex-row justify-between items-center py-6 ">
                        <p className="text-gray-700 text-lg md:text-xl font-semibold">
                            Usado: {totalDiskUsage.toFixed(2)}%
                        </p>
                        <p className="text-gray-700 text-lg md:text-xl font-semibold">
                            Libre: {totalDiskFree.toFixed(2)}%
                        </p>
                        <p className="text-gray-700 text-lg md:text-xl font-semibold">
                            Total Usado: {sumTotalDiskUsage.toFixed(2)} GB
                        </p>
                        <p className="text-gray-700 text-lg md:text-xl font-semibold">
                            Total Disponible: {sumTotalFree.toFixed(2)} GB
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 m-5">
                {servers.length > 0 ? (
                    servers.map(server => (
                        <Card
                            server={server}
                            currentTime={currentTime}
                            currentDate={currentDate}
                            key={server.id}
                            className="w-full sm:w-[48%] lg:w-[31%] xl:w-[23%]"
                        />
                    ))
                ) : (
                    <p className="text-red-500">No hay servidores disponibles</p>
                )}
            </div>
        </div>
    );
};

export default Monitor;