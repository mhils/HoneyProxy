import os, re

def update():
    isPage = re.compile("^[^_].+\.html$")
    with open("_template.html", 'r') as tmpl:
        template = tmpl.read()
        
    for filename in os.listdir("."):
        if(isPage.match(filename)):
            with open(filename, 'r') as page:
                with open("../"+filename, 'w') as result:
                    result.write(template % page.read())

def watch():
    """
    Windows only
    """
    import win32file, win32event, win32con
    
    watchPath = os.path.abspath(".")

    change_handle = win32file.FindFirstChangeNotification(
        watchPath,
        0,
        win32con.FILE_NOTIFY_CHANGE_LAST_WRITE)
    
    try:
        while 1:
            result = win32event.WaitForSingleObject(change_handle, 500)
            if(result == win32con.WAIT_OBJECT_0):
                update()
                win32file.FindNextChangeNotification(change_handle)
    finally:
        win32file.FindCloseChangeNotification(change_handle)
        
if __name__ == '__main__':
    update()
    watch()