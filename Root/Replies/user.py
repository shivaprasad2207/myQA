from django.template.loader import get_template
from django.http import HttpResponse
from django.utils.crypto import get_random_string
from django.shortcuts import redirect
from .models import  UserInfo
from .mylib.myutil import getCookieInfo, showJsonResponse


def manageUsers (request):
    data = getCookieInfo(request)
    data['users'] = UserInfo.objects.filter(orgCode=data['orgCode'], is_active=1)
    t = get_template('user_list_t.html')
    html = t.render(data)
    response = HttpResponse(html)
    return response

def chuser (request):
    data = getCookieInfo(request)
    userId = request.GET.get('userId', '')
    userAuth = UserInfo.objects.filter(orgCode=data['orgCode'], is_active=1, userId=userId).get()
    if userAuth.userRole == 1 :
        userAuth.userRole = 0
    else:
        userAuth.userRole = 1
    userAuth.save()
    return redirect('/replies/users/list')

def delete (request):
    data = getCookieInfo(request)
    userId = request.GET.get('userId', '')
    userAuth = UserInfo.objects.filter(orgCode=data['orgCode'], is_active=1, userId=userId).get()
    userAuth.is_active = 0
    userAuth.save()
    return redirect('/replies/users/list')

def modify (request):
    data = getCookieInfo(request)
    if request.method == 'GET':
        userId = request.GET.get('userId', '')
        userInfo = UserInfo.objects.filter(orgCode=data['orgCode'], is_active=1, userId=userId).get()
        user = {
            'userName':userInfo.userName,
            'userEmail':userInfo.userEmail,
            'orgCode':userInfo.orgCode,
            'userId': userInfo.userId
        }
        userData = data.copy()
        userData.update(user)
        t = get_template('user_mod_t.html')
        html = t.render(userData)
        response = HttpResponse(html)
        return response
    else:
        orgCode = request.POST.get('orgCode', '')
        userId = request.POST.get('userId', '')
        userInfo = UserInfo.objects.filter(orgCode=orgCode, is_active=1, userId=userId).get()
        userInfo.userName =  request.POST.get('userName', '')
        userInfo.userEmail = request.POST.get('userEmail', '')
        userInfo.save()
        return redirect('/replies/users/list')

def search(request):
    data = getCookieInfo(request)
    data['users'] = []
    searchString = request.GET.get('search', '')
    search = {}
    search['userName' + '__contains'] = searchString
    search['orgCode'] = data['orgCode']
    search['is_active'] = 1
    userInfoList = UserInfo.objects.filter(**search)
    del(search['userName' + '__contains'])
    search['userEmail' + '__contains'] = searchString
    userInfoList = userInfoList | UserInfo.objects.filter(**search)
    data['users'] = userInfoList
    t = get_template('user_list_t.html')
    html = t.render(data)
    response = HttpResponse(html)
    return response


def getUserInfoObj(search):
    try:
        return UserInfo.objects.filter(**search).get()
    except UserInfo.DoesNotExist:
        return None
