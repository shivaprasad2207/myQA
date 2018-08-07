from django.db import models
from datetime import datetime

class OrgInfo(models.Model):
    orgId = models.AutoField(primary_key=True)
    orgName = models.CharField(max_length=255, blank=True)
    orgAddress = models.CharField(max_length=255, blank=True)
    orgCode =  models.CharField(max_length=255,unique=True, blank=True)
    is_active = models.IntegerField(default=1)

class UserInfo(models.Model):
    userId = models.AutoField(primary_key=True)
    OrgInfo = models.ForeignKey(OrgInfo, on_delete=models.CASCADE)
    orgCode = models.CharField(max_length=255, blank=True)
    userName = models.CharField(max_length=255, blank=True)
    userEmail = models.EmailField(max_length=255, blank=True)
    userPassword = models.CharField(max_length=255, blank=True)
    userRole = models.IntegerField(default=1)
    is_active = models.IntegerField(default=1)

class Category(models.Model):
    categoryId = models.AutoField(primary_key=True)
    orgCode = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=255, blank=True)
    is_active = models.IntegerField(default=1)

class SubCategory(models.Model):
    subCategoryId = models.AutoField(primary_key=True)
    categoryId = models.ForeignKey(Category, on_delete=models.CASCADE)
    orgCode = models.CharField(max_length=255, blank=True)
    subCategory = models.CharField(max_length=255, blank=True)
    is_active = models.IntegerField(default=1)

class Message (models.Model):
    messageId = models.AutoField(primary_key=True)
    messageText = models.CharField(max_length=500, blank=True)
    orgCode = models.CharField(max_length=255, blank=True)
    is_active = models.IntegerField(default=1)
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    dateTo = models.DateField(default=datetime.now, blank=True)

class Subject(models.Model):
    subjectId = models.AutoField(primary_key=True)
    categoryId =  models.ForeignKey(Category, on_delete=models.CASCADE)
    subCategoryId = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    subjectText = models.CharField(max_length=500, blank=True)
    messageId = models.ForeignKey(Message, on_delete=models.CASCADE)
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    orgCode = models.CharField(max_length=255, blank=True)
    is_active = models.IntegerField(default=1)
    dateTo = models.DateField(default=datetime.now, blank=True)

class BranchMessage (models.Model):
    bMessageId = models.AutoField(primary_key=True)
    bMessageText = models.CharField(max_length=500, blank=True)
    orgCode = models.CharField(max_length=255, blank=True)
    is_active = models.IntegerField(default=1)
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    dateTo = models.DateField()

class MessageMetadata(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE,related_name='self_message')
    parentMessage = models.ForeignKey(Message, on_delete=models.CASCADE,related_name='parent_message')
    is_branched = models.IntegerField(default=0)
    bMessageId = models.ForeignKey(BranchMessage, on_delete=models.CASCADE)

class BranchMessageMetadata(models.Model):
    bMessage = models.ForeignKey(BranchMessage, on_delete=models.CASCADE,related_name='self_message')
    parentBmessage = models.ForeignKey(BranchMessage, on_delete=models.CASCADE,related_name='parent_message')
    is_last = models.IntegerField(default=1)
    is_first = models.IntegerField(default=1)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)

