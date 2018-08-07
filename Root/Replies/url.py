from django.urls import path
from . import  categories,user,discussion,reply


urlpatterns = [
    path('', discussion.registerNewUser, name='registerNewUser'),
    path('', discussion.registerNewOrg, name='registerNewOrg'),
    path('', discussion.userLogin, name='userLogin'),
    path('', discussion.userLogout, name='userLogout'),
    path('', discussion.main, name='main'),
    path('', categories.showCategoryAddForm, name='categoriesShowCategoryAddForm'),
    path('', categories.categoryList, name='categoriesList'),
    path('', categories.modifyCategory, name='modifyCategory'),
    path('', categories.subCategory, name='subCategory'),
    path('', categories.subCategoryChannge, name='subCategoryChannge'),
    path('', user.manageUsers, name='manageUsers'),
    path('', user.chuser, name='chuser'),
    path('', user.delete, name='delete'),
    path('', user.modify, name='modify'),
    path('', user.search, name='search'),
    path('', reply.addNewContent, name='addNewContent'),
    path('', reply.subjectList, name='subjectList'),
    path('', reply.searchList, name='searchList'),
    path('', reply.subject, name='subject'),
    path('', reply.delete, name='delete'),
    path('', reply.meesageAdd, name='messageAdd'),
    path('', reply.branchAdd, name='branchAdd'),
]