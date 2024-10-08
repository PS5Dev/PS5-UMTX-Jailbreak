import http.server, ssl, time, re #, cgi

from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler, HTTPServer

class RequestHandler(SimpleHTTPRequestHandler):
    def replace_locale(self):
        self.path = re.sub(r'^\/document\/(\w{2})\/ps5', '/document/en/ps5', self.path)

    def do_GET(self):
        self.replace_locale()
        return super().do_GET()

    def do_POST(self):
        self.replace_locale()
        tn = self.path.lstrip('/document/en/ps5/')
        print('!POST!: tn:\n'  + tn)
        fn = tn
        if (not tn.startswith("T_")):
            if (fn!="a.bin"):
                print('!POST!: INFO: '  + str(self.rfile.read(int(self.headers['Content-length']))),"utf-8")
                return
            else:
                fn = time.strftime("%Y%m%d-%H%M%S") + ".bin"

        print('!POST!: ' + self.path + ' -->> ' + fn)
        print('test: %d'%int(self.headers['Content-length']))
        data = self.rfile.read(int(self.headers['Content-length']))
        open("%s"%fn, "wb").write(data)
        
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()


server_address = ('0.0.0.0', 443)
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='localhost.pem')
httpd = http.server.HTTPServer(server_address, RequestHandler)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
print('running server')
httpd.serve_forever()
