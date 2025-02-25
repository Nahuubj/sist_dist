import socket
import psutil as pct
import json
import threading 
import time
import os

def get_ram_memory():
    """Obtiene el porcentaje de uso de RAM"""
    mem = pct.virtual_memory()
    return mem.percent  # Devuelve porcentaje usado

def get_disk_usage():
    """Obtiene el porcentaje de uso del disco principal"""
    disk_path = '/' if os.name != 'nt' else 'C:'
    disk = pct.disk_usage(disk_path)
    return disk.percent  # Devuelve porcentaje usado

def get_ip_address():
    """Obtiene la IP local del dispositivo"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def get_mac_address():
    """Obtiene la dirección MAC del dispositivo"""
    for interface, addrs in pct.net_if_addrs().items():
        for addr in addrs:
            if addr.family == pct.AF_LINK:
                return addr.address
    return "00:00:00:00:00:00"  # Valor por defecto en caso de error

def send_data():
    """Envía los datos al servidor"""
    host = '192.168.0.169'
    port = 5700

    disk_usage = get_disk_usage()
    ram_usage = get_ram_memory()
    ip = get_ip_address()
    mac = get_mac_address()

    data = {
        "macAddress": mac,
        "diskUsage": disk_usage,
        "ramUsage": ram_usage,
        "ipAddress": ip
    }

    json_data = json.dumps(data)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.connect((host, port))
        sock.sendall(json_data.encode())
    finally:
        sock.close()

def monitor_changes():
    """Detecta cambios en RAM o disco y envía datos al servidor solo si hay variación"""
    prev_ram = get_ram_memory()
    prev_disk = get_disk_usage()

    while True:
        time.sleep(5)  # Chequea cada 5 segundos

        current_ram = get_ram_memory()
        current_disk = get_disk_usage()

        if current_ram != prev_ram or current_disk != prev_disk:
            send_data()  # Envía datos al servidor
            prev_ram = current_ram  # Actualiza valores previos
            prev_disk = current_disk

# Iniciar el monitoreo en un hilo separado
thread = threading.Thread(target=monitor_changes)
thread.start()
thread.join()