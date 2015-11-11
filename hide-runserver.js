function main(){
    wsh = new ActiveXObject('WScript.Shell');
    target_path = 'cmd /c' + wsh.CurrentDirectory + '\\runserver.bat';
    wsh.Run(target_path, 0);
}

main();