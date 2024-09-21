import socket
import time
import struct
import locale

def server_program():
    host = '0.0.0.0'
    port = 5656

    server_socket = socket.socket()
    server_socket.bind((host, port))

    server_socket.listen(1)
    conn, address = server_socket.accept()  # accept new connection
    conn.settimeout(60) # 60 second timeout
    print("Connection from: " + str(address))

    dump_data = bytearray()
    first_packet_recv = False
    first_packet_time = time.monotonic()
    while True:
        try:
            data = conn.recv(0x10000)
            if not data:
                break
            if not first_packet_recv:
                first_packet_recv = True
                first_packet_time = time.monotonic()

            dump_data.extend(data)
            data_recv = len(dump_data)

            kbps = 0
            if first_packet_time != time.monotonic():
                kbps = round(data_recv / (time.monotonic() - first_packet_time) / 1024)

            print("Received {} bytes ({} kb/s)...".format(data_recv, kbps))
        except socket.timeout:
            print("Timeout reached for receiving data (1 min)")
            break

    # write to file
    timestr = time.strftime("%Y%m%d-%H%M%S")
    print("[+] Writing dump to dump-" + timestr + ".bin...")
    f = open("dump-" + timestr + ".bin", "wb")
    f.write(dump_data)
    f.close()

    conn.close()

if __name__ == '__main__':
    server_program()