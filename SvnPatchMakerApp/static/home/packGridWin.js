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
            iconCls: 'Build'
        },{
            text: '确认',
            iconCls: 'Cartremove',
            handler: function(){
                var myMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: '正在处理，请稍后...',
                    removeMask: true
                });
                myMask.show();
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
                        myMask.hide();
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