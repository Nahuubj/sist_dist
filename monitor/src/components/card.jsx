import React from 'react';


const Card = ({ server, currentTime, currentDate }) => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transition-transform transform hover:scale-105" key={server.id}>
            <img className="w-full h-64 object-cover" src="https://illustoon.com/photo/thum/7823.png" alt="Sunset in the mountains" />
            <div className="px-6 py-4">

                {server.status === 1 ? (
                    <>
                        <div className="font-bold text-2xl text-green-700 mb-2">{server.clientName}</div>
                        <div className="text-gray-800 font-semibold mb-1">Detalles</div>

                        <p className="text-blue-600 text-base text-left font-bold">Hora: {currentTime}</p>
                        <p className="text-blue-600 text-base text-left font-bold">Fecha: {currentDate}</p>

                        <p className="text-gray-700 text-base font-bold text-left">IP: {server.ipAddress}</p>
                        <p className="text-gray-700 text-base font-bold text-left">RAM: {server.ramMemory}</p>

                        <div className="text-gray-800 font-semibold mb-1">Almacenamiento</div>
                        <p className="text-gray-700 text-base text-left">Total: {server.totalDisk} GB</p>
                        <p className="text-gray-700 text-base text-left">En Uso: {server.diskUsage} GB</p>
                        <p className="text-gray-700 text-base text-left">Libre: {server.diskFree} GB</p>
                        <div className="mb-4">
                            <div className="text-left">
                                <span className="text-base font-bold">Porcentaje de uso: </span>
                            </div>
                            <div className="relative w-full h-4 bg-gray-200 rounded">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded ${(server.diskUsage / server.totalDisk) * 100 < 33
                                            ? 'bg-green-500'
                                            : (server.diskUsage / server.totalDisk) * 100 < 66
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                    style={{
                                        width: `${((server.diskUsage / server.totalDisk) * 100).toFixed(2)}%`,
                                    }}
                                />
                            </div>
                            <p className="text-gray-700 text-base font-bold text-left">
                                en uso: {((server.diskUsage / server.totalDisk) * 100).toFixed(2)}%
                            </p>
                        </div>
                    </>
                ) : (
                    <div>
                        <p className="text-red-600 font-bold text-xl">{server.clientName}</p>
                        <p className="text-red-600">No está conectado</p>
                    </div>
                )}
            </div>
        </div>
    );


}


export default Card;