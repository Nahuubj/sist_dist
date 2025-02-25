import socket
import psutil as pct
import json
import threading 
import time
import os

def get_ram_memory():
    mem = pct.virtual_memory()
    return mem.total

def get_ip_address():
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
    for interface, addrs in pct.net_if_addrs().items():
        for addr in addrs:
            if addr.family == pct.AF_LINK:  # Verifica si es una MAC Address
                return addr.address
    return "00:00:00:00:00:00"  # En caso de error, devuelve una MAC por defecto

def main():
    host = '192.168.0.169'
    port = 5700

    # Definir ruta del disco según el sistema operativo
    disk_path = '/' if os.name != 'nt' else 'C:'

    my_disk = pct.disk_usage(disk_path)
    my_usage_disk = my_disk.used
    my_free_disk = my_disk.free
    my_storage = my_disk.total

    ip = get_ip_address()
    ram = get_ram_memory()
    mac = get_mac_address()  # Obtener la MAC Address

    data = {
        "macAddress": mac,
        "totalDisk": my_storage,
        "diskUsage": my_usage_disk,
        "diskFree": my_free_disk,
        "ipAddress": ip,
        "ramMemory": ram
    }

    json_data = json.dumps(data)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.connect((host, port))
        sock.sendall(json_data.encode())
    finally:
        sock.close()

def run_main_every_5_seconds():
    while True:
        main()
        time.sleep(3)  # Ahora realmente espera 5 segundos

thread = threading.Thread(target=run_main_every_5_seconds)
thread.start()

thread.join()
