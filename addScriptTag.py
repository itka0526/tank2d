import os
import bs4

html_path = os.path.dirname(os.path.abspath(__file__)) + "/static/tank2d/index.html"

def run_script() :
    with open(html_path, "r") as f:
        html = f.read()
        alr_hr1 = html.find('<script src="/socket.io/socket.io.js"></script>')
        alr_hr2 = html.find('<script src="/static/connect.js"></script>')
        if alr_hr1 != -1 or alr_hr2 != -1: 
            return print("--- ALREADY ADDED SCRIPT TAG ---")
        modified = bs4.BeautifulSoup(html, features="lxml")

    script1 = modified.new_tag("script", src="/socket.io/socket.io.js" )
    script2 = modified.new_tag("script", src="/static/connect.js" )
    modified.body.append(script1)
    modified.body.append(script2)

    with open(html_path, "w") as f:
        f.write(str(modified))

    print("--- SUCCESSFULLY ADDED SCRIPT TAG ---")

run_script()