import socket
import psutil as pct
import json
import threading
import time
import signal
import sys


running = True

passwordd = "hola"
def get_ram_memory():
    mem = pct.virtual_memory()
    return mem.total

def get_ip_address():
    host_name = socket.gethostname()
    my_ip = socket.gethostbyname(host_name)
    return my_ip

def get_first_mac_address():
    addrs = pct.net_if_addrs()
    
    for interface, interface_addresses in addrs.items():
        for address in interface_addresses:
            if address.family == pct.AF_LINK:
                return address.address  

    return "f-f-f" 

host = input("Ingrese host: ")
port = int(input("Ingrese puerto: "))  
id = input("Ingrese ID: ")

disks = pct.disk_partitions()
disk_data = []

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
if input("Ingrese contraseña")!= passwordd:
    print("Incorrecto")
    exit()

def main():
    disk_data.clear()
    ip = get_ip_address()
    ram = get_ram_memory()
    mac = get_first_mac_address()
    for disk in disks:
        disk_usage = pct.disk_usage(disk.mountpoint)
        disk_info = {
            "disk": disk.device,
            "totalDisk": disk_usage.total,
            "diskUsage": disk_usage.used,
            "diskFree": disk_usage.free
        }
        disk_data.append(disk_info)

    data = {
        "id": id,
        "clientName": '',
        "disks": disk_data,
        "ipAddress": ip,
        "mac": mac,
        "ramMemory": ram,
        "status": 1
    }
    json_data = json.dumps(data)
    try:
        sock.send(json_data.encode())
    except socket.error as e:
        print("Error: ",e)
        sock.close()  
        sys.exit(0)

def run_main_every_5_seconds():
    while running:  
        main()
        time.sleep(4)

try:
    sock.connect((host, port))
    print("Conectado")
    thread = threading.Thread(target=run_main_every_5_seconds)
    thread.start()
    thread.join()
except socket.error as e:
    print(f"Error en la conexión o envío de datos: {e}")
    sys.exit(1)

def signal_handler(sig, frame):
    global running
    print("\nCerrando el programa...")
    running = False  # Detener el hilo
    thread.join() 
    sock.close()  
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler) 



