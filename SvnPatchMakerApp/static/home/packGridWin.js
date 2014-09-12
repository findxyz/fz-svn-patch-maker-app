Ext.define('svnPatchMaker.packGridWin', {
    extend: 'Ext.window.Window',
    title: '打包文件整理检查',
    maximizable: true,
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 1000,
    height: 500,
    initComponent: function(){
        var win = this;
        win.tbar = [{
            text: '【记得更新编译^_^~~】',
            iconCls: 'Build',
            handler: function(){
                var upPanel = Ext.create('Ext.panel.Panel', {
                    title: '更新',
                    html: '',
                    autoScroll: true,
                    tbar: [{
                        xtype: 'textfield',
                        fieldLabel: '更新目录',
                        labelWidth: 60,
                        id: 'updatePath',
                        width: 500,
                        listeners: {
                            afterrender: function(f){
                                var localStorage = window.localStorage;
                                if(localStorage.getItem("updatePath")){
                                    f.setValue(localStorage.getItem("updatePath"));
                                }
                            }
                        }
                    }, {
                        text: 'RUN',
                        handler: function(){
                            var localStorage = window.localStorage;
                            var updatePath = Ext.getCmp('updatePath').getValue();
                            if(!localStorage.getItem("updatePath") || localStorage.getItem("updatePath") != updatePath){
                                localStorage.setItem("updatePath", updatePath);
                            }
                            var projectRecords = Ext.getCmp('svnProjectGrid').getSelectionModel().getSelection();
                            var projectRecord = projectRecords[0];
                            var userRecords = Ext.getCmp('svnUserGrid').getSelectionModel().getSelection();
                            var userRecord = userRecords[0];
                            if(updatePath && userRecord && projectRecord){
                                upPanel.update('处理中...请稍等...');
                                Ext.Ajax.request({
                                    url: '/updateworkpath',
                                    params: {
                                        'updatePath': updatePath,
                                        'project': projectRecord.get('id'),
                                        'user': userRecord.get('id')
                                    },
                                    success: function(resp){
                                        var json = Ext.decode(resp.responseText);
                                        if(json.success){
                                            upPanel.update(json.msg);
                                        }else{
                                            upPanel.update(json.msg);
                                        }
                                    }
                                });
                            }else{
                                upPanel.update('没有更新路径啊...');
                            }
                        }
                    }]
                });
                var comPanel = Ext.create('Ext.panel.Panel', {
                    title: '编译【逗号分割命令】',
                    html: '',
                    autoScroll: true,
                    tbar: [{
                        xtype: 'textfield',
                        fieldLabel: '执行脚本',
                        labelWidth: 60,
                        id: 'comScript',
                        width: 500,
                        listeners: {
                            afterrender: function(f){
                                var localStorage = window.localStorage;
                                if(localStorage.getItem("comScript")){
                                    f.setValue(localStorage.getItem("comScript"));
                                }
                            }
                        }
                    }, {
                        text: 'RUN',
                        handler: function(){
                            var localStorage = window.localStorage;
                            var comScript = Ext.getCmp('comScript').getValue();
                            if(!localStorage.getItem("comScript") || localStorage.getItem("comScript") != comScript){
                                localStorage.setItem("comScript", comScript);
                            }
                            if(comScript){
                                comPanel.update('处理中...请稍等...');
                                Ext.Ajax.request({
                                    url: '/execute_command',
                                    params: {
                                        'comScript': comScript
                                    },
                                    success: function(resp){
                                        var json = Ext.decode(resp.responseText);
                                        if(json.success){
                                            comPanel.update(json.msg);
                                        }else{
                                            comPanel.update(json.msg);
                                        }
                                    }
                                });
                            }else{
                                comPanel.update('没有执行命令啊...');
                            }
                        }
                    }]
                });
                var tabPanel = Ext.create('Ext.tab.Panel', {
                    layout: 'fit',
                    items: [upPanel, comPanel]
                });
                var upAndComWin = Ext.create('Ext.Window', {
                    title: '手动更新编译',
                    width: 600,
                    height: 400,
                    layout: 'fit',
                    autoScroll: true,
                    items: [tabPanel]
                });
                upAndComWin.show();
            }
        },{
            text: '确认',
            iconCls: 'Cartremove',
            handler: function(){
                var records = setPackGrid.getStore().getRange();
                var params = {};
                var filelist = [];
                for(var i=0; i<records.length; i++){
                    filelist.push(records[i].get('filename'));
                }
                var projectRecord = win.projectRecord;
                params.filelist = filelist;
                params.project = projectRecord.get('id');
                Ext.Ajax.request({
                    url: '/packfiles',
                    params: params,
                    success: function(resp){
                        win.close();
                        var respText = resp.responseText;
                        var json = Ext.decode(respText);
                        // console.log(json);
                        var resultstore = Ext.data.StoreManager.lookup('resultstore');
                        resultstore.loadRawData(json);
                        var savestore = Ext.data.StoreManager.lookup('savestore');
                        savestore.loadRawData(json);
                        var resultWin = new svnPatchMaker.resultGridWin();
                        resultWin.show();
                        resultWin.msgPanel.update(json.msg);
                    }
                });
            }
        }];
        this.callParent(arguments);
        var setPackGrid = Ext.create('Ext.grid.Panel', {
            flex: 2,
            store: Ext.data.StoreManager.lookup('setpackdata'),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            columns: [{
                    xtype: 'rownumberer',
                    sortable: false,
                    locked: true
                },
                { text: '文件路径【增改】', dataIndex: 'filename', flex: 1 }
            ]
        });
        win.add(setPackGrid);
        var setDelGrid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            store: Ext.data.StoreManager.lookup('setdeldata'),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            columns: [{
                    xtype: 'rownumberer',
                    sortable: false,
                    locked: true
                },
                { text: '文件路径【删】', dataIndex: 'filename', flex: 1 }
            ]
        });
        win.add(setDelGrid);
    },
    constructor: function(config){
        this.initConfig(config);
        this.callParent(arguments);
    }
});