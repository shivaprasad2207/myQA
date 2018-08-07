from django.template.loader import get_template
from django.http import HttpResponse
import json

def getCookieInfo(request):
    userInfo = request.COOKIES['userInfo']
    return dict(item.split("=") for item in userInfo.split(";"))

def manageBooks(request):
    t = get_template('manage_books.html')
    html = t.render(getCookieInfo(request))
    response = HttpResponse(html)
    return response

def jsonOut( data ):
    response = HttpResponse()
    response['Content-Type'] = "text/javascript"
    response.write(json.dumps(data))
    return response

def showJsonResponse( data ):
    userInfo = ';'.join(['%s=%s' % x for x in data.items()])
    response = HttpResponse()
    response['Content-Type'] = "text/javascript"
    response.set_cookie('userInfo', userInfo)
    response.write(json.dumps(data))
    return response

def returnJsonResponse( data ):
    response = HttpResponse()
    response['Content-Type'] = "text/javascript"
    response.write(json.dumps(data))
    return response
