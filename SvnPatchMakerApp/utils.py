#/usr/bin/env python
# -*- coding: utf-8 -*-

import pysvn
import subprocess
import os

subversionDir = 'Subversion'

def updatesvn(dict):
    def get_login(realm, username, may_save):
        return True, dict['username'], dict['password'], False
    client = pysvn.Client(dict['svnuserdir'])
    client.callback_get_login = get_login
    client.cleanup(dict['svnworkpath'])
    list = client.update(
        dict['svnworkpath'],
        recurse=True,
        revision=pysvn.Revision(pysvn.opt_revision_kind.head),
        ignore_externals=False
    )
    r = list[0]
    result = r'已更新到最新版本' + '[' + str(r.number) + ']'
    return result

def exec_command(*args):
    # args = ['D:/Documents/Downloads/gradle-2.0/bin/gradle.bat','-p','E:/gradle','hello']
    p = subprocess.Popen(args, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

    call_back_msg = {}
    call_back_msg['list'] = []
    call_back_msg['return_code'] = ''

    for line in p.stdout.readlines():
        dic = {}
        linetrip = line.replace(os.linesep, '').strip()
        if linetrip:
            call_back_msg['list'].append(linetrip)

    call_back_msg['return_code'] = p.wait()
    return call_back_msg

if __name__ == '__main__':
    dict = {}
    dict['username'] = 'fengzhen'
    dict['password'] = '123456'
    dict['svnuserdir'] = subversionDir
    dict['svnworkpath'] = 'D:/svn/crane_soa/performance'
    print updatesvn(dict)
    call_back_msg = exec_command(*['D:/Documents/Downloads/gradle-2.0/bin/gradle.bat','-p','E:/gradle','hello'])
    print call_back_msg["return_code"]
    print os.linesep.join(call_back_msg["list"])