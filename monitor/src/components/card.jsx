import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#EF4444', '#10B981']; // Rojo (Usado), Verde (Libre)

const Card = ({ server, currentTime, currentDate }) => {
    if (!server) {
        return (
            <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-4">
                <p className="text-red-600 font-bold text-xl">No está conectado</p>
            </div>
        );
    }

    const { disks } = server;
    const total = disks[0]?.totalDisk || 1; // Evitar divisiones por 0
    let used = disks[0]?.diskUsage || 0;
    let free = disks[0]?.diskFree || 0;

    // Asegurar que la suma de "usado + libre" sea igual al total
    if (used + free !== total) {
        free = total - used;
    }

    // 🔍 Log para verificar valores antes de pasarlos a la gráfica
    console.log(`📊 Datos para la gráfica: Total: ${total} | Usado: ${used} | Libre: ${free}`);

    // Datos para la gráfica
    const data = [
        { name: "Usado", value: Number(used) },
        { name: "Libre", value: Number(free) },
    ];
    

    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transition-transform transform hover:scale-105">
            <img className="w-full h-64 object-cover" src="https://illustoon.com/photo/thum/7823.png" alt="Server" />
            <div className="px-6 py-4">
                <div className="font-bold text-2xl text-green-700 mb-2">{server.clientName}</div>
                {server.status === 0 ? (
                    <p className='text-red-600 font-bold text-xl'>No conectado</p>
                ) : (
                    <>
                        <div className="text-gray-800 font-semibold mb-1">Detalles</div>
                        <p className="text-blue-600 text-base font-bold">Hora: {currentTime}</p>
                        <p className="text-blue-600 text-base font-bold">Fecha: {currentDate}</p>
                        <p className="text-gray-700 text-base font-bold">IP: {server.ipAddress}</p>
                        <p className="text-gray-700 text-base font-bold">RAM: {server.ramMemory}</p>

                        <div className="text-gray-800 font-semibold mb-1">
                            Almacenamiento: "{disks[0]?.disk || 'Desconocido'}"
                        </div>
                        <p className="text-gray-700 text-base">Total: {total} GB</p>
                        <p className="text-gray-700 text-base">En Uso: {used} GB</p>
                        <p className="text-gray-700 text-base">Libre: {free} GB</p>

                        {/* Barra de progreso */}
                        <div className="mb-4">
                            <div className="text-left">
                                <span className="text-base font-bold">Porcentaje de uso:</span>
                            </div>
                            <div className="relative w-full h-4 bg-gray-200 rounded">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded ${
                                        (used / total) * 100 < 33
                                            ? 'bg-green-500'
                                            : (used / total) * 100 < 66
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }`}
                                    style={{ width: `${((used / total) * 100).toFixed(2)}%` }}
                                />
                            </div>
                            <p className="text-gray-700 text-base font-bold text-left">
                                En uso: {((used / total) * 100).toFixed(2)}%
                            </p>
                        </div>

                        {/* <div className="w-full h-52 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        fill="#8884d8"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div> */}
                    </>
                )}
            </div>
        </div>
    );
};

export default Card;
