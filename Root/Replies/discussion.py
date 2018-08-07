from django.template.loader import get_template
from django.http import HttpResponse
from django.utils.crypto import get_random_string
from django.shortcuts import redirect
from .mylib.myutil import getCookieInfo, showJsonResponse, returnJsonResponse
from .mylib.mylib import get_or_create_csrf_token as getCsrf
import json
import hashlib
from .models import Category, SubCategory,  UserInfo, OrgInfo


def categoriesFunctions(request):
    t = get_template('categories_functions_t.html')
    html = t.render(getCookieInfo(request))
    response = HttpResponse(html)
    return response

def discuss(request):
    t = get_template('discuss.html')
    html = t.render()
    response = HttpResponse(html)
    return response

def main (request):
    t = get_template('home_t.html')
    html = t.render(getCookieInfo(request))
    response = HttpResponse(html)
    return response


def registerNewUser(request):
    if request.method == 'POST':
        orgCode = request.POST.get('orgCode', '')
        userName = request.POST.get('userName', '')
        userEmail = request.POST.get('userEmail', '')
        password = request.POST.get('password', '')
        data = {}
        if UserInfo.objects.filter(orgCode=orgCode,userName=userName,is_active=1).count() > 0:
            data['status'] = 'ERROR'
            data['message'] = 'Same user name already Exist'
        else:
            userInfo = UserInfo()
            userInfo.userName = userName
            userInfo.userEmail = userEmail
            userInfo.orgCode = orgCode
            userInfo.userPassword = hashlib.md5(password.encode('utf-8')).hexdigest()
            userInfo.userRole = 1
            userInfo.OrgInfo = OrgInfo.objects.filter(orgCode=orgCode).get()
            userInfo.save()
            data['status'] = 'SUCCESS'
            data['message'] = 'you are registered with username : ' + userName
            response = HttpResponse()
            response['Content-Type'] = "text/javascript"
            #response.set_cookie('userInfo', userInfo)
            response.write(json.dumps(data))
            return response
    else:
        csrf = {
            'csrfmiddlewaretoken': getCsrf(request)
        }
        t = get_template('new_user_t.html')
        html = t.render(csrf)
        return HttpResponse(html)

def userLogout (request):
    csrf = {
        'csrfmiddlewaretoken': getCsrf(request)
    }
    t = get_template('login_t.html')
    html = t.render(csrf)
    response = HttpResponse(html)
    response.delete_cookie('userInfo')
    return response

def userLogin (request):
    if request.method == 'POST':
        orgCode = request.POST.get('orgCode', '')
        userName = request.POST.get('userName', '')
        password = request.POST.get('password', '')
        data = {}
        if OrgInfo.objects.filter(orgCode=orgCode).count() <= 0:
            data['status'] = 'ERROR'
            data['message'] = orgCode + ' No such Orgnisation code exist  '
            return returnJsonResponse(data)
        elif UserInfo.objects.filter(orgCode=orgCode, userName=userName,is_active=1).count() <= 0:
            data['status'] = 'ERROR'
            data['message'] = userName + ' User name does not exist  '
            return returnJsonResponse (data)
        else:
            userInfo = UserInfo.objects.filter(orgCode=orgCode, userName=userName).get()
            if ( hashlib.md5(password.encode('utf-8')).hexdigest() != userInfo.userPassword ):
                data['status'] = 'ERROR'
                data['message'] = ' Wrong password .. '
                return returnJsonResponse(data)
            else :
                data['status'] = 'SUCCESS'
                userInfo = dict([
                                    ('userName',userName),('orgCode', orgCode), ('userRole',userInfo.userRole),
                                    ('orgName',userInfo.OrgInfo.orgName),('userEmail',userInfo.userEmail),
                                    ('csrfmiddlewaretoken', getCsrf(request))
                                ])
                userInfo = ';'.join(['%s=%s' % x for x in userInfo.items()])
                response = HttpResponse()
                response['Content-Type'] = "text/javascript"
                response.set_cookie('userInfo', userInfo)
                response.write(json.dumps(data))
                return response
    else:
        csrf = {
            'csrfmiddlewaretoken': getCsrf(request)
        }
        t = get_template('login_t.html')
        html = t.render(csrf)
        return HttpResponse(html)


def registerNewOrg(request):
    if request.method == 'POST':
        orgName = request.POST.get('orgName', '')
        orgAddress = request.POST.get('orgAddress', '')
        userName = request.POST.get('userName', '')
        userEmail = request.POST.get('userEmail', '')
        password = request.POST.get('password', '')
        data = {}
        if OrgInfo.objects.filter(orgName=orgName).count() > 0:
            data['status'] = 'ERROR'
            data['message'] = 'Same Organisation Name Already Exist'
        else:
            orgInfo = OrgInfo()
            orgInfo.orgCode =  get_random_string(length=8)
            orgInfo.orgAddress = orgAddress
            orgInfo.orgName =  orgName
            orgInfo.save()
            userInfo = UserInfo()
            userInfo.orgCode = orgInfo.orgCode
            userInfo.OrgInfo = orgInfo
            userInfo.userEmail = userEmail
            userInfo.userName = userName
            userInfo.userPassword = hashlib.md5(password.encode('utf-8')).hexdigest()
            userInfo.save()
            data['status'] = 'SUCCESS'
            data['message'] = 'Organisation is Registered and its Code : ' + orgInfo.orgCode
            response = HttpResponse()
            response['Content-Type'] = "text/javascript"
            response.set_cookie('userInfo', userInfo)
            response.write(json.dumps(data))
            return response
    else:
        csrf = {
            'csrfmiddlewaretoken': getCsrf(request)
        }
        t = get_template('new_org_t.html')
        html = t.render(csrf)
        return HttpResponse(html)

