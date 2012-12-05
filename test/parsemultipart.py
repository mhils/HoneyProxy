import StringIO, cgi

content = """-----------------------------265001916915724
Content-Disposition: form-data; name="F1"; filename="fileA.txt"
Content-Type: text/plain

I'm file A.
-----------------------------265001916915724
Content-Disposition: form-data; name="F2"; filename="fileB.txt"
Content-Type: text/plain

I'm file B.
-----------------------------265001916915724
Content-Disposition: form-data; name="F3"; filename="fileA.txt"
Content-Type: text/plain

I'm file A2.
-----------------------------265001916915724--"""
print len(content)
headers = {"content-type":"multipart/form-data; boundary=---------------------------265001916915724" }

fp = StringIO.StringIO(content)
fs = cgi.FieldStorage(fp,headers,environ={ 'REQUEST_METHOD':'POST' })
print fs