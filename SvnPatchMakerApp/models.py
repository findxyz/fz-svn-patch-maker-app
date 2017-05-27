# -*- encoding: utf-8 -*-
from django.db import models

# Create your models here.
class SvnProject(models.Model):
    projectname = models.CharField(max_length=100)

    svnurl = models.CharField(max_length=100)

    # e.g. /springmvc/src.. --> /springmvc is svnpath , config by user self
    svnpath = models.CharField(max_length=100, blank=True)

    # e.g. D:/workspace/springmvc
    workpath = models.CharField(max_length=100)

    # 最后生成到的文件夹
    savepath = models.CharField(max_length=100)

    def __str__(self):
        return self.projectname

    class Meta():
        ordering = ['projectname']

class SvnAccount(models.Model):
    username = models.CharField(max_length=30)

    password = models.CharField(max_length=30)

    def __str__(self):
        return self.username

class SvnConverter(models.Model):
    project = models.ForeignKey(SvnProject)

    key = models.CharField(max_length=100)

    value = models.CharField(max_length=100)

    def __str__(self):
        return self.key

    class Meta():
        ordering = ['key']

class SvnVersion(models.Model):

    key = models.CharField(max_length=100)

    def __str__(self):
        return self.key

    class Meta():
        ordering = ['key']