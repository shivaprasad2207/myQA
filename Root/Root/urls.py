"""DemoProj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from  Replies  import  categories
from  Replies  import discussion
from  Replies  import user
from  Replies  import reply

urlpatterns = [
    path('admin/', admin.site.urls),
    path('replies/registerNewUser/', discussion.registerNewUser),
    path('replies/registerNewOrg/', discussion.registerNewOrg),
    path('replies/login/', discussion.userLogin),
    path('replies/main/', discussion.main),
    path('replies/logout/', discussion.userLogout),
    path('replies/categories/', discussion.categoriesFunctions),
    path('replies/categories/add', categories.showCategoryAddForm),
    path('replies/categories/show', categories.categoryList),
    path('replies/categories/modify',categories.modifyCategory),
    path('replies/categories/delete',categories.deleteCategory),
    path('replies/categories/subcategories/add',categories.subCategory),
    path('replies/categories/subcategories/modify',categories.subCategoryChannge),
    path('replies/categories/subcategories/delete',categories.subCategoryChannge),
    path('replies/users/', user.manageUsers),
    path('replies/users/list', user.manageUsers),
    path('replies/users/chuser', user.chuser),
    path('replies/users/delete', user.delete),
    path('replies/users/modify', user.modify),
    path('replies/users/search', user.search),
    path('replies/reply/start', reply.addNewContent),
    path('replies/reply/subject/list', reply.subjectList),
    path('replies/reply/subject/search', reply.searchList),
    path('replies/reply/subject/delete',reply.delete),
    path('replies/reply/subject', reply.subject),
    path('replies/reply/message/add', reply.messageAdd),
    path('replies/reply/branch/add', reply.branchAdd),
]
