#/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import time

from django.shortcuts import render, render_to_response
from django.http import Http404, HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import pysvn
from SvnPatchMakerApp.models import SvnProject, SvnAccount, SvnConverter
from SvnPatchMakerApp import patchmaker
from SvnPatchMakerApp import utils

subversionDir = 'Subversion'

def home(request):
    return render_to_response("home.html", {})

def svnprojects(request):
    svnprojects = SvnProject.objects.all()
    listprojects = []
    for project in svnprojects:
        projectdic = {}
        projectdic['id'] = project.id
        projectdic['projectname'] = project.projectname
        projectdic['svnurl'] = project.svnurl
        projectdic['svnpath'] = project.svnpath
        projectdic['workpath'] = project.workpath
        projectdic['savepath'] = project.savepath
        listprojects.append(projectdic)

    jsondata = json.dumps({"rows": listprojects})
    return HttpResponse(jsondata)

def svnaccounts(request):
    svnaccounts = SvnAccount.objects.all()
    listusers = []
    for user in svnaccounts:
        userdic = {}
        userdic['id'] = user.id
        userdic['username'] = user.username
        userdic['password'] = user.password
        listusers.append(userdic)

    jsondata = json.dumps({"rows": listusers})
    return HttpResponse(jsondata)

def svnconverters(request):
    projectId = request.REQUEST['project']
    project = SvnProject.objects.get(id=projectId)
    svnconverters = SvnConverter.objects.filter(project=project)
    listconverters = []
    for converter in svnconverters:
        converterdic = {}
        converterdic['id'] = converter.id
        converterdic['key'] = converter.key
        converterdic['value'] = converter.value
        listconverters.append(converterdic)

    jsondata = json.dumps({"rows": listconverters})
    return HttpResponse(jsondata)

@csrf_exempt
def add_or_up_project(request):
    success = False
    msg = r'保存失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            projectname = request.POST['projectname']
            svnurl = request.POST['svnurl']
            svnpath = request.POST['svnpath']
            workpath = request.POST['workpath']
            savepath = request.POST['savepath']
            if id:
                project = SvnProject.objects.get(id=id)
                project.projectname = projectname
                project.svnurl = svnurl
                project.svnpath = svnpath
                project.workpath = workpath
                project.savepath = savepath
                project.save()
            else:
                project = SvnProject(projectname=projectname, svnurl=svnurl, svnpath=svnpath, workpath=workpath, savepath=savepath)
                project.save()
            success = True
            msg = r'保存成功'
    except Exception, e:
        print e
        success = False
        msg = r'保存失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

@csrf_exempt
def del_project(request):
    success = False
    msg = r'删除失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            if(id):
                project = SvnProject.objects.get(id=id)
                project.delete()
                success = True
                msg = r'删除成功'
            else:
                msg = r'删除失败' + '[缺少id]'
    except Exception, e:
        print e
        success = False
        msg = r'删除失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

@csrf_exempt
def add_or_up_converter(request):
    success = False
    msg = r'保存失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            key = request.POST['key']
            value = request.POST['value']
            projectId = request.POST['project']
            if id:
                converter = SvnConverter.objects.get(id=id)
                converter.key = key
                converter.value = value
                converter.save()
            else:
                project = SvnProject.objects.get(id=projectId)
                converter = SvnConverter(key=key, value=value, project=project)
                converter.save()
            success = True
            msg = r'保存成功'
    except Exception, e:
        print e
        success = False
        msg = r'保存失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

@csrf_exempt
def del_converter(request):
    success = False
    msg = r'删除失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            if(id):
                converter = SvnConverter.objects.get(id=id)
                converter.delete()
                success = True
                msg = r'删除成功'
            else:
                msg = r'删除失败' + '[缺少id]'
    except Exception, e:
        print e
        success = False
        msg = r'删除失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

@csrf_exempt
def add_or_up_user(request):
    success = False
    msg = r'保存失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            username = request.POST['username']
            password = request.POST['password']
            if id:
                user = SvnAccount.objects.get(id=id)
                user.username = username
                user.password = password
                user.save()
            else:
                user = SvnAccount(username=username, password=password)
                user.save()
            success = True
            msg = r'保存成功'
    except Exception, e:
        print e
        success = False
        msg = r'保存失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

@csrf_exempt
def del_user(request):
    success = False
    msg = r'删除失败'
    try:
        if request.method == 'POST':
            id = request.POST['id']
            if(id):
                user = SvnAccount.objects.get(id=id)
                user.delete()
                success = True
                msg = r'删除成功'
            else:
                msg = r'删除失败' + '[缺少id]'
    except Exception, e:
        print e
        success = False
        msg = r'删除失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": msg})
        return HttpResponse(jsondata, content_type="text/html")

def svnlogdatas(request):
    jsondata = {"rows": []}
    projectId = request.REQUEST['project']
    project = SvnProject.objects.get(id=projectId)
    userId = request.REQUEST['user']
    user = SvnAccount.objects.get(id=userId)
    if project and user:
        dic = {}
        dic['begintime'] = request.REQUEST['begintime']
        dic['svnurl'] = project.svnurl
        def get_login(realm, username, may_save):
            return True, user.username, user.password, False
        dic['get_login'] = get_login
        dic['svnuserdir'] = subversionDir
        jsondata = log2grid(dic)

    return HttpResponse(jsondata)

def log2grid(dic):
    log_messages = getlogs(dic)
    listlogs = []
    for log in log_messages:
        logdict = {}
        logfiles = []
        logdict["vnum"] = log.revision.number
        logdict["author"] = log["author"]
        logdict["message"] = log["message"]
        logdict["date"] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(log.date))
        for path in log.changed_paths:
            filedic = {}
            filedic["filename"] = path.path
            filedic["op"] = path.action
            logfiles.append(filedic)
        logdict["logfiles"] = logfiles
        listlogs.append(logdict)

    return json.dumps({"rows": listlogs})

def getlogs(dic):
    svnuserdir = dic['svnuserdir']
    get_login = dic['get_login']
    begintime = dic['begintime']
    svnurl = dic['svnurl']
    client = pysvn.Client(svnuserdir)
    client.callback_get_login = get_login
    begintime = time.mktime(time.strptime(begintime, '%Y-%m-%d %H:%M:%S'))
    log_messages = \
        client.log(svnurl,
                    revision_start=pysvn.Revision(pysvn.opt_revision_kind.head),
                    revision_end=pysvn.Revision(pysvn.opt_revision_kind.date, begintime),
                    discover_changed_paths=True)
    return log_messages

@csrf_exempt
def checkfiles(request):
    listpack = []
    setpack = set(request.POST.getlist("listPack"))
    for packfile in setpack:
        packdict = {}
        packdict["filename"] = packfile
        listpack.append(packdict)

    listdel = []
    setdel = set(request.POST.getlist("listDel"))
    for delfile in setdel:
        deldict = {}
        deldict["filename"] = delfile
        listdel.append(deldict)
    return HttpResponse(json.dumps({"setPack": listpack, "setDel": listdel}))

@csrf_exempt
def packfiles(request):
    filelist = request.POST.getlist('filelist')
    projectId = request.POST['project']
    project = SvnProject.objects.get(id=projectId)
    converters = SvnConverter.objects.filter(project=project)
    convertersdic = {}
    for converter in converters:
        convertersdic[converter.key] = converter.value
    isfileslist, savefileslist, msg = patchmaker.patchmake(filelist, project.svnpath, project.workpath, project.savepath, **convertersdic)
    savefiles = []
    for save in savefileslist:
        filedic = {}
        filedic['filename'] = save
        savefiles.append(filedic)
    return HttpResponse(json.dumps({"resultfiles": isfileslist, "savefiles": savefiles, "msg": '<font size="5" color="blue">' + msg + '</font>'}))

@csrf_exempt
def updateworkpath(request):
    success = True
    msg = r'缺少参数'
    try:
        svnworkpath = request.POST['updatePath']
        projectId = request.REQUEST['project']
        project = SvnProject.objects.get(id=projectId)
        userId = request.REQUEST['user']
        user = SvnAccount.objects.get(id=userId)
        if svnworkpath and user and project:
            dic = {
                "svnworkpath": svnworkpath,
                "username": user.username,
                "password": user.password,
                "svnuserdir": subversionDir
            }
            msg = utils.updatesvn(dic)
    except Exception, e:
        print e
        success = False
        msg = r'更新失败' + '[' + str(e) + ']<br><font size="5" color="red">检查路径和pysvn版本</font>'
    finally:
        jsondata = json.dumps({"success": success, "msg": '<font size="5" color="blue">' + msg + '</font>'})
        return HttpResponse(jsondata)

@csrf_exempt
def execute_command(request):
    success = True
    msg = r'缺少参数'
    try:
        comScript = request.POST['comScript']
        if comScript:
            list = comScript.split(',')
            call_back_msg = utils.exec_command(*list)
            # call_back_msg["return_code"] 程序执行是否异常 0正常 1异常
            msg = ('<br>'.join(call_back_msg["list"]))
    except Exception, e:
        print e
        success = False
        msg = r'脚本执行失败' + '[' + str(e) + ']'
    finally:
        jsondata = json.dumps({"success": success, "msg": '<font size="4" color="blue">' + msg + '</font>'})
        return HttpResponse(jsondata)
