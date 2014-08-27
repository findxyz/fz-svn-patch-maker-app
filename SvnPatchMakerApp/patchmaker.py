#/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import shutil

__author__ = 'fz'

"""
change svn url to local file url
"""

def pathchange(svnpath, origin, dest):
    """
    change svn path(/../src/main/java.....)
    to local file path(D:/workspace/../web/src/main/java/.....)
    """
    if origin:
        return svnpath.replace(origin, dest, 1)
    else:
        return dest+svnpath

def pathconvert(path, **kwargs):
    """
    convert svn path(/src/main/java)
    to convert path(/WEB-INF/class)
    """
    for key in kwargs:
        if key in path:
            return path.replace(key, kwargs[key], 1)
    return path

def convert4java(javapath):
    """
    A.java to A.class, add A.class to filelist
    if A$xx liked class is existed, add them also
    e.g.
    javapath = D:\Devspace\shenli_lmis\lmis\src\org\lmis\persist\dao\deliver\yunshudan\ViewMidReYunShuDanDAO.java
    javaname = ViewMidReYunShuDanDAO.java
    dirname = D:\Devspace\shenli_lmis\lmis\src\org\lmis\persist\dao\deliver\yunshudan\
    """
    def java2class(javalist):
        classlist = []
        for java in javalist:
            classlist.append(java.replace('java', 'class'))
        return classlist

    javalist = [javapath]
    javaname = os.path.basename(javapath)
    dirname = os.path.dirname(javapath)
    files = os.listdir(dirname)
    innername = javaname.replace('.java', '$')
    for file in files:
        filepath = os.path.join(dirname, file)
        if os.path.isfile(filepath) and file.startswith(innername):
            javalist.append(filepath)

    return java2class(javalist)

def savefiles(classlist, savepath, workpath):
    savenormpath = os.path.normpath(savepath)
    savefileslist = []
    isfileslist = []
    if not os.path.isdir(savenormpath):
        os.makedirs(savenormpath)
    else:
        shutil.rmtree(savenormpath)
    for classpath in classlist:
        newfilepath = savenormpath + classpath.replace(os.path.normpath(workpath), '', 1)
        newfiledir = os.path.dirname(newfilepath)
        if not os.path.isdir(newfiledir):
            os.makedirs(newfiledir)
        if os.path.isfile(classpath):
            shutil.copy(classpath, (newfilepath))
            savefileslist.append(newfilepath)
            isfileslist.append({"filename": classpath, "isfile": 1})
        else:
            isfileslist.append({"filename": classpath, "isfile": 0})
    return isfileslist, savefileslist

def patchmake(svnpaths, svnworkpath, workpath, savepath, **converts):
    msg = 'success'
    resultfileslist = []
    savefileslist = []
    isfileslist = []
    try:
        for svnpath in svnpaths:
            classpaths = []
            path = pathchange(svnpath, svnworkpath, workpath)
            path = pathconvert(path, **converts)
            path = os.path.normpath(path)
            filename = os.path.basename(path)
            if '.java' in filename:
                classpaths = convert4java(path)
                resultfileslist += classpaths
            else:
                resultfileslist.append(path)
        # save files
        isfileslist, savefileslist = savefiles(resultfileslist, savepath, workpath)
    except WindowsError, e:
        if e.winerror == 145:
            msg = r'生成失败了，关闭打包目录后重试' + '[' + str(e) + ']'
        elif e.winerror == 3:
            msg = r'转换路径出错了，请检查转换规则' + '[' + str(e) + ']'
    except Exception, e:
        msg = str(e)
    return isfileslist, savefileslist, msg

if __name__ == '__main__':
    # path = pathchange(r'/springmvc/src/main/java/controller/BaseController.java', r'/springmvc', r'D:/workspace/mvcpro')
    # dict = {}
    # dict['/src/main/java'] = '/WEB-INF/classes'
    # path = pathconvert(path, **dict)
    # print path

    # path = pathchange(r'/src/main/java/controller/BaseController.java', r'', r'D:/workspace/mvcpro')
    # dict = {}
    # dict['/src/main/java'] = '/WEB-INF/classes'
    # path = pathconvert(path, **dict)
    # print path

    # path = r'D:/Devspace/shenli_lmis/lmis/src/org/lmis/persist/dao/deliver/yunshudan/ViewMidReYunShuDanDAO.java'
    # print os.path.normcase('D:/Devspace')
    # print os.path.isfile(path)
    # print os.path.basename(path)
    # print os.path.dirname(path)
    # print convert4java(os.path.normpath(path))
    # print convert4java(path)

    svnpaths = [
        '/lmis/src/org/lmis/persist/hibernate/deliver/yunshudan/YunShuDanDAOHibernate.java',
        '/lmis/src/org/lmis/persist/hibernate/deliver/yunshudan/BillInfoDAOHibernate.java',
        '/lmis/src/org/lmis/web/action/deliver/yunshudan/ListYunShuDanAction.java',
        '/lmis/web/mainUI.jsp',
        '/lmis/web/WEB-INF/pages/top.jsp'
    ]
    resultlist, msg = patchmake(svnpaths,
                           r'/lmis',
                           r'D:/Devspace/shenli_lmis/lmis',
                           r'E:/svnlogfiles/sllmis',
                           **{r'/src': r'/web/WEB-INF/classes'})
    print '\n'.join(resultlist)
    print msg
