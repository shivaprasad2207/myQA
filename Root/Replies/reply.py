from django.template.loader import get_template
from django.http import HttpResponse
from django.utils.crypto import get_random_string
from django.shortcuts import redirect
from .mylib.myutil import getCookieInfo, showJsonResponse, returnJsonResponse
from .models import  UserInfo
from .mylib.myutil import getCookieInfo, showJsonResponse
from .mylib.mylib import get_or_create_csrf_token as getCsrf
import json
import hashlib
from .models import Category, SubCategory,  UserInfo, OrgInfo
from .models import Message, MessageMetadata,Subject
from .models import BranchMessage , BranchMessageMetadata
from datetime import datetime

class Counter:
    count = 1

    def increment(self):
        self.count += 1
        return ''

    def decrement(self):
        self.count -= 1
        return ''

    def double(self):
        self.count *= 2
        return ''


def addNewContent (request):
    data = getCookieInfo(request)
    if request.method == 'GET':
        if request.GET.get('op', '') == 'getSubCategoryFrom':
            data['categoryId'] = request.GET.get('categoryId', '')
            categoryObj = Category.objects.filter().get(categoryId=data['categoryId'], orgCode=data['orgCode'])
            data['category'] = categoryObj.category
            data['subCategories'] = SubCategory.objects.filter(categoryId=categoryObj, orgCode=data['orgCode'],is_active=1)
            t = get_template('part_template.html')
            data['section'] = 'SHOW_SUBCATEGORY_OPTION'
            html = t.render(data)
            response = HttpResponse(html)
            return response
        elif request.GET.get('op', '') == 'getContentFrom':
            data['categoryId'] = request.GET.get('categoryId', '')
            data['subCategoryId'] = request.GET.get('subCategoryId', '')
            t = get_template('part_template.html')
            data['section'] = 'SHOW_REST_OF_REPLY_CONTENT_FORM'
            html = t.render(data)
            response = HttpResponse(html)
            return response
        else:
            data['categories'] = Category.objects.filter(orgCode=data['orgCode'], is_active=1)
            data['section'] = 'SHOW_REPLY_ADD_FORM'
            t = get_template('replies_add_t.html')
            html = t.render(data)
            response = HttpResponse(html)
            return response
    else:
        orgCode = request.POST.get('orgCode', '')
        subjectText = request.POST.get('subject', '')
        content = request.POST.get('content', '')
        categoryId = request.POST.get('categoryId', '')
        subCategoryId = request.POST.get('subCategoryId', '')
        userInfo = UserInfo.objects.filter(orgCode=orgCode,is_active=1,userName=data['userName'],userEmail=data['userEmail']).get()
        category = Category.objects.filter(categoryId=categoryId, orgCode=orgCode, is_active=1).get()
        subCategory = SubCategory.objects.filter(subCategoryId=subCategoryId,orgCode=orgCode, is_active=1).get()

        subject = Subject()
        subject.userInfo = userInfo
        subject.orgCode = orgCode
        subject.categoryId = category
        subject.subCategoryId = subCategory
        subject.subjectText = subjectText
        subject.dateTo = datetime.now().strftime('%Y-%m-%d')

        message = Message()
        message.dateTo = datetime.now().strftime('%Y-%m-%d')
        message.orgCode = orgCode
        message.userInfo = userInfo
        message.messageText = content
        message.save()
        subject.messageId = message
        subject.save()

        messageMeta = MessageMetadata()
        messageMeta.message = message
        messageMeta.parentMessage = message
        if BranchMessage.objects.filter(orgCode='ROOT1234', dateTo='1965-08-02', is_active=0).count() > 0:
            messageMeta.bMessageId = BranchMessage.objects.filter(orgCode='ROOT1234', dateTo='1965-08-02', is_active=0).get()
        else:
            branchMessage = BranchMessage()
            branchMessage.orgCode = 'ROOT1234'
            branchMessage.dateTo = '1965-08-02'
            branchMessage.is_active = 0
            branchMessage.userInfo = userInfo
            branchMessage.save()
            messageMeta.bMessageId = branchMessage
        messageMeta.save()

        if Message.objects.filter(orgCode='ROOT1234', dateTo='1965-08-02', is_active=0).count() <= 0:
            nullMessage = Message()
            nullMessage.orgCode = 'ROOT1234'
            nullMessage.dateTo = '1965-08-02'
            nullMessage.is_active = 0
            nullMessage.userInfo = userInfo
            nullMessage.save()
        data['status'] = 'SUCCESS'
        response = HttpResponse()
        response['Content-Type'] = "text/javascript"
        response.write(json.dumps(data))
        return response

def branchAdd (request):
    data = getCookieInfo(request)
    messageId = request.POST.get('messageId', '')
    content = request.POST.get('content', '')

    message = Message.objects.filter(messageId=messageId, is_active=1,orgCode=data['orgCode']).get()

    branchMessage = BranchMessage ()
    branchMessage.bMessageText = content
    branchMessage.orgCode = data['orgCode']
    branchMessage.userInfo = UserInfo.objects.filter( orgCode=data['orgCode'], is_active=1,userName=data['userName'],
                                                      userEmail=data['userEmail']).get()
    branchMessage.dateTo = datetime.now().strftime('%Y-%m-%d')
    branchMessage.save()

    messageMetadata = MessageMetadata.objects.filter(message=message).get()
    messageMetadata.is_branched = 1
    messageMetadata.bMessageId = branchMessage
    messageMetadata.save()

    branchMessageMetadata = BranchMessageMetadata()
    branchMessageMetadata.bMessage = branchMessage
    branchMessageMetadata.parentBmessage = branchMessage
    branchMessageMetadata.message = message
    branchMessageMetadata.save()
    data['status'] = 'SUCCESS'
    response = HttpResponse()
    response['Content-Type'] = "text/javascript"
    response.write(json.dumps(data))
    return response

def searchList(request):
    data = getCookieInfo(request)
    searchString = request.GET.get('search', '')
    search = {
        'orgCode': data['orgCode'],
        'is_active':   1,
        'subjectText__contains' : searchString
    }
    subjectList = []
    for subject in Subject.objects.filter(**search):
        subjectInfo = {}
        subjectInfo['subjectId'] = subject.subjectId
        subjectInfo['subjectText'] = subject.subjectText
        subjectInfo['orgCode'] = subject.orgCode
        subjectInfo['dateTo'] = subject.dateTo
        subjectInfo['category'] = subject.categoryId.category
        subjectInfo['subCategory'] = subject.subCategoryId.subCategory
        subjectInfo['userName'] = subject.userInfo.userName
        subjectInfo['messageId'] = subject.messageId.messageId
        subjectList.append(subjectInfo)
    del(search['subjectText__contains'])
    search['messageText__contains'] = searchString
    for message in Message.objects.filter(**search):
        message = MessageMetadata.objects.filter(message=message).get().parentMessage
        subject = Subject.objects.filter(messageId=message).get()
        if subject.is_active != 0 :
            subjectInfo = {}
            subjectInfo['subjectId'] = subject.subjectId
            subjectInfo['subjectText'] = subject.subjectText
            subjectInfo['orgCode'] = subject.orgCode
            subjectInfo['dateTo'] = subject.dateTo
            subjectInfo['category'] = subject.categoryId.category
            subjectInfo['subCategory'] = subject.subCategoryId.subCategory
            subjectInfo['userName'] = subject.userInfo.userName
            subjectInfo['messageId'] = subject.messageId.messageId
            subjectList.append(subjectInfo)

    subjectInfo = {}
    for subject in subjectList:
        subjectInfo[subject['subjectId']] = subject
    subjectList = list(subjectInfo.values())
    data['subjects'] = subjectList
    t = get_template('replies_subject_list_t.html')
    html = t.render(data)
    response = HttpResponse(html)
    return response


def subjectList(request):
    data = getCookieInfo(request)
    subjectList = []
    for subject in Subject.objects.filter( orgCode=data['orgCode'], is_active=1 ):
        subjectInfo = {}
        subjectInfo['subjectId'] = subject.subjectId
        subjectInfo['subjectText'] = subject.subjectText
        subjectInfo['orgCode'] = subject.orgCode
        subjectInfo['dateTo'] = subject.dateTo
        subjectInfo['category'] = subject.categoryId.category
        subjectInfo['subCategory'] = subject.subCategoryId.subCategory
        subjectInfo['userName'] = subject.userInfo.userName
        subjectInfo['messageId'] = subject.messageId.messageId
        subjectList.append(subjectInfo)

    data['subjects'] = subjectList
    t = get_template('replies_subject_list_t.html')
    html = t.render(data)
    response = HttpResponse(html)
    return response


def getBranchNodes (message):
    messageMetada = MessageMetadata.objects.filter(message=message).get()
    messageO = Message.objects.filter(messageId=message.messageId).get()
    bMessage = messageMetada.bMessageId
    branchMaessages = []
    for bMessageMetada  in BranchMessageMetadata.objects.filter(message=messageO).order_by('id'):
        branchMaessageInfo = {}
        branchMaessage = bMessageMetada.bMessage
        if branchMaessage.is_active == 1 :
            branchMaessageInfo['userName'] = branchMaessage.userInfo.userName
            branchMaessageInfo['bMessageText'] = branchMaessage.bMessageText
            branchMaessageInfo['dateTo'] = branchMaessage.dateTo
            branchMaessages.append(branchMaessageInfo)
    return branchMaessages

def delete(request):
    data = getCookieInfo(request)
    data['subjectId'] = request.GET.get('subjectId', '')
    data['messageId'] = request.GET.get('messageId', '')
    subject = Subject.objects.filter(orgCode=data['orgCode'], is_active=1, subjectId=data['subjectId']).get()
    message = Message.objects.filter(messageId=data['messageId'], is_active=1, orgCode=data['orgCode']).get()
    subject.is_active = 0
    message.is_active = 0
    subject.save()
    message.save()
    data['status'] = 'SUCCESS'
    response = HttpResponse()
    response['Content-Type'] = "text/javascript"
    response.write(json.dumps(data))
    return response

def subject (request):
    data = getCookieInfo(request)
    if request.GET.get('flag', '') == 'showPostBox' :
        data['subjectId'] = request.GET.get('subjectId', '')
        data['FLAG']  = 'SHOW_MSG_ADD'
        subject = Subject.objects.filter(orgCode=data['orgCode'], is_active=1, subjectId=data['subjectId']).get()
        data['messageId'] = subject.messageId.messageId
        t = get_template('reply_add_from_t.html')
        html = t.render(data)
        response = HttpResponse(html)
        return response
    elif request.GET.get('flag', '') == 'showReplyPostBox' :
        data['FLAG'] = 'SHOW_BRANCH_MSG_ADD'
        data['branchRootMessageId'] = request.GET.get('subjectId', '')
        branchRootMessage = Message.objects.filter(messageId=data['branchRootMessageId'], is_active=1, orgCode=data['orgCode']).get()
        rootMessage = MessageMetadata.objects.filter(message=branchRootMessage).get().parentMessage
        data['rootMessageId'] = rootMessage.messageId
        data['subjectId'] = Subject.objects.filter(messageId=rootMessage,is_active=1, orgCode=data['orgCode']).get().subjectId
        t = get_template('reply_add_from_t.html')
        html = t.render(data)
        response = HttpResponse(html)
        return response
    else:
        messageId = request.GET.get('messageId', '')
        subjectId = request.GET.get('subjectId', '')
        subject = Subject.objects.filter(orgCode=data['orgCode'], is_active=1, subjectId=subjectId).get()
        data.update({
            'subjectText': subject.subjectText,
            'mUserName': subject.userInfo.userName,
            'dateTo': subject.dateTo,
            'subjectId': subject.subjectId,
            'messageId': subject.messageId.messageId,
            'messageText': subject.messageId.messageText,
            'orgCode': data['orgCode']
        })
        data['messages'] = []
        first = 1
        for messageMetadata in MessageMetadata.objects.filter(parentMessage=messageId).order_by('id'):
            if first == 0 :
                messageO = Message.objects.filter(messageId=messageMetadata.message.messageId, is_active=1,
                                                  orgCode=data['orgCode']).get()
                messageInfo = {
                    'dateTo': messageO.dateTo,
                    'userName': messageO.userInfo.userName,
                    'messageText': messageO.messageText,
                    'messageId': messageO.messageId,
                    'is_branched': messageMetadata.is_branched
                }
                if messageMetadata.is_branched == 1:
                    messageInfo['branchRootId'] = messageO.messageId
                    messageInfo['branchMessages'] = getBranchNodes(messageO)
                    messageInfo['branchMessageCount'] = len(messageInfo['branchMessages'])
                    messageInfo['counter'] = Counter()
                data['messages'].append(messageInfo)
            else :
                first = 0
        t = get_template('discuss.html')
        html = t.render(data)
        response = HttpResponse(html)
        return response

def messageAdd (request):
    data = getCookieInfo(request)
    if request.method == 'POST':
        subjectId = request.POST.get('subjectId', '')
        content = request.POST.get('content', '')

        message = Message()
        message.dateTo = datetime.now().strftime('%Y-%m-%d')
        message.orgCode = data['orgCode']
        message.userInfo = UserInfo.objects.filter(orgCode=data['orgCode'],is_active=1,userName=data['userName']).get()
        message.messageText = content
        message.save()

        pMessageO = Subject.objects.filter(orgCode=data['orgCode'], is_active=1, subjectId=subjectId).get().messageId
        nullBranchNode = BranchMessage.objects.filter(orgCode='ROOT1234', dateTo='1965-08-02', is_active=0).get()
        messageMeta = MessageMetadata()
        messageMeta.message = message
        messageMeta.parentMessage = pMessageO
        messageMeta.bMessageId = nullBranchNode
        messageMeta.save()
        data['status'] = 'SUCCESS'
        response = HttpResponse()
        response['Content-Type'] = "text/javascript"
        response.write(json.dumps(data))
        return response

def getUserInfoObj(search):
    try:
        return UserInfo.objects.filter(**search).get()
    except UserInfo.DoesNotExist:
        return None
