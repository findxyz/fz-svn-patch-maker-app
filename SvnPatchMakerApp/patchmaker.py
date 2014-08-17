#/usr/bin/env python
# -*- coding: utf-8 -*-

import os

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
    to convert path(/WEB-INFO/class)
    """
    for key in kwargs:
        if key in path:
            return path.replace(key, kwargs[key], 1)

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
        if os.path.isfile(filepath) and innername in file:
            javalist.append(filepath)

    return java2class(javalist)

if __name__ == '__main__':
    # path = pathchange(r'/springmvc/src/main/java/controller/BaseController.java', r'/springmvc', r'D:/workspace/mvcpro')
    # dict = {}
    # dict['/src/main/java'] = '/WEB-INFO/classes'
    # path = pathconvert(path, **dict)
    # print path

    # path = pathchange(r'/src/main/java/controller/BaseController.java', r'', r'D:/workspace/mvcpro')
    # dict = {}
    # dict['/src/main/java'] = '/WEB-INFO/classes'
    # path = pathconvert(path, **dict)
    # print path

    path = r'D:/Devspace/shenli_lmis/lmis/src/org/lmis/persist/dao/deliver/yunshudan/ViewMidReYunShuDanDAO.java'
    # print os.path.normcase('D:/Devspace')
    # print os.path.isfile(path)
    # print os.path.basename(path)
    # print os.path.dirname(path)
    print convert4java(os.path.normpath(path))
    # print convert4java(path)