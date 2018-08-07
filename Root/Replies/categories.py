from django.template.loader import get_template
from django.http import HttpResponse
from django.shortcuts import redirect
from .models import Category, SubCategory
from .mylib.myutil import getCookieInfo, jsonOut,showJsonResponse

def showCategoryAddForm(request):
    if request.method == 'POST':
        category = Category()
        category.orgCode = request.POST.get('orgCode', '')
        category.category = request.POST.get('category', '')
        category.save()
        data = {}
        data['status'] = 'SUCCESS'
        data['message'] = '<br><b> Category Added <b>'
        return jsonOut(data)
    else:
        t = get_template('categories_add_form_t.html')
        html = t.render(getCookieInfo(request))
        response = HttpResponse(html)
        return response

def subCategory ( request ):
    data = getCookieInfo(request)
    if request.method == 'POST':
        data['orgCode'] = request.POST.get('orgCode', '')
        data['categoryId'] = request.POST.get('categoryId', '')
        data['subcategory'] = request.POST.get('subcategory', '')
        subCategoryObj = SubCategory()
        categoryObj = Category.objects.filter().get(categoryId=data['categoryId'], orgCode=data['orgCode'])
        subCategoryObj.orgCode = data['orgCode']
        subCategoryObj.categoryId = categoryObj
        subCategoryObj.subCategory = data['subcategory']
        subCategoryObj.save()
        data['status'] = 'SUCCESS'
        return showJsonResponse(data)
    elif request.method == 'GET':
        data['orgCode'] = request.GET.get('orgCode', '')
        data['categoryId'] = request.GET.get('categoryId', '')
        categoryObj = Category.objects.filter().get(categoryId=data['categoryId'], orgCode=data['orgCode'])
        data['category'] = categoryObj.category
        data['subCategories'] = SubCategory.objects.filter(categoryId=categoryObj , orgCode=data['orgCode'],is_active=1)
        data['showModifyForm'] = 0
        t = get_template('sub_categories_t.html')
        html = t.render(data)
        response = HttpResponse(html)
        return response

def subCategoryChannge (request):
    data = getCookieInfo(request)
    if request.method == 'GET':
        operation = request.GET.get('op', '')
        if operation == 'Del':
            subCategoryObj = SubCategory.objects.filter().get(subCategoryId=request.GET.get('subCategoryId', ''))
            subCategoryObj.is_active = 0
            subCategoryObj.save()
            data['orgCode'] = request.GET.get('orgCode', '')
            data['categoryId'] = request.GET.get('categoryId', '')
            categoryObj = Category.objects.filter().get(categoryId=data['categoryId'])
            data['category'] = categoryObj.category
            data['subCategories'] = SubCategory.objects.filter(categoryId=categoryObj, orgCode=data['orgCode'],is_active=1)
            t = get_template('sub_categories_t.html')
            html = t.render(data)
            response = HttpResponse(html)
            return response
        elif operation == 'ModShow':
            data['orgCode'] = request.GET.get('orgCode', '')
            data['categoryId'] = request.GET.get('categoryId', '')
            subCategoryObj = SubCategory.objects.filter().get(subCategoryId=request.GET.get('subCategoryId', ''))
            data['subcategory'] = subCategoryObj.subCategory
            data['subCategoryId'] = subCategoryObj.subCategoryId
            categoryObj = Category.objects.filter().get(categoryId=data['categoryId'])
            data['category'] = categoryObj.category
            data['subCategories'] = SubCategory.objects.filter(categoryId=categoryObj, orgCode=data['orgCode'],is_active=1)
            data['showModifyForm'] = 1
            t = get_template('sub_categories_t.html')
            html = t.render(data)
            response = HttpResponse(html)
            return response
    else:
        data = getCookieInfo(request)
        operation = request.POST.get('op', '')
        if operation == 'ModShow':
            data['orgCode'] = request.POST.get('orgCode', '')
            data['categoryId'] = request.POST.get('categoryId', '')
            data['subCategoryId'] = request.POST.get('subCategoryId', '')
            subCategoryObj = SubCategory.objects.filter().get(subCategoryId=request.POST.get('subCategoryId', ''))
            subCategoryObj.subCategory = request.POST.get('subcategory', '')
            subCategoryObj.save()
            url = '/replies/categories/subcategories/add?categoryId=%s&orgCode=%s' %  ( data['categoryId'], data['orgCode'] )
            return  redirect( url )


def categoryList (request):
    data = getCookieInfo(request)
    data['categories'] = Category.objects.filter(orgCode=data['orgCode'],is_active=1)
    t = get_template('category_list_t.html')
    html = t.render(data)
    response = HttpResponse(html)
    return response

def deleteCategory (request):
    orgCode = request.GET.get('orgCode', '')
    categoryId = request.GET.get('categoryId', '')
    category = Category.objects.filter().get(categoryId=categoryId,orgCode=orgCode)
    category.is_active = 0
    category.save()
    return redirect('/replies/categories/show')

def modifyCategory (request):
    if request.method == 'POST':
        orgCode = request.POST.get('orgCode', '')
        categoryId = request.POST.get('categoryId', '')
        category = request.POST.get('category', '')
        categoryObj = Category.objects.filter().get(categoryId=categoryId, orgCode=orgCode)
        categoryObj.category = category
        categoryObj.save()
        return redirect('/replies/categories/show')
    else:
        data = getCookieInfo(request)
        orgCode = request.GET.get('orgCode', '')
        categoryId = request.GET.get('categoryId', '')
        data['category'] = Category.objects.filter().get(categoryId=categoryId,orgCode=orgCode).category
        data['orgCode'] = orgCode
        data['categoryId'] = categoryId
        t = get_template('category_modify_t.html')
        html = t.render(data)
        response = HttpResponse(html)
        return response
