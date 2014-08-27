Ext.define('svnPatchMaker.svnConverterGrid', {
    extend: 'Ext.grid.Panel',
    config: {
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        },
        store: Ext.data.StoreManager.lookup('svnConverterStore'),
        columns: [
            { dataIndex: 'id', hidden: true },
            { dataIndex: 'project', hidden: true },
            { text: '替换前',  dataIndex: 'key', flex: 0.5 },
            { text: '替换后', dataIndex: 'value', flex: 0.5 }
        ]
    },
    initComponent: function(){
        var grid = this;
        var tbar = [{
            text: '增加',
            iconCls: 'Bookadd',
            handler: function(){
                var projectRecords = grid.svnProjectGrid.getSelectionModel().getSelection();
                var projectRecord = projectRecords[0];
                if(projectRecord){
                    var win = new svnPatchMaker.svnConverterAddUpWin({
                        title: '新增'
                    });
                    win.on('reloadGrid', function(){
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                        win.close();
                    });
                    win.show();
                    win.form.getForm().setValues({'project': projectRecord.get('id')});
                    Ext.getCmp('key').focus(false, 300);
                    Ext.getCmp('key').selectText();
                }else{
                    Ext.Msg.alert('提示', '请先选择一条项目记录');
                }
            }
        },{
            text: '修改',
            iconCls: 'Bookedit',
            handler: function(){
                var records = grid.getSelectionModel().getSelection();
                var record = records[0];
                if(record){
                    var win = new svnPatchMaker.svnConverterAddUpWin({
                        title: '编辑'
                    });
                    win.on('reloadGrid', function(){
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                        win.close();
                    });
                    win.show();
                    win.form.getForm().loadRecord(record);
                    Ext.getCmp('key').focus(false, 300);
                    Ext.getCmp('key').selectText();
                }
            }
        },{
            text: '删除',
            iconCls: 'Bookdelete',
            handler: function(){
                var records = grid.getSelectionModel().getSelection();
                var record = records[0];
                if(record){
                    Ext.Ajax.request({
                        url: 'del_converter',
                        params: {
                            id: record.get('id')
                        },
                        success: function(resp){
                            var json = Ext.decode(resp.responseText);
                            if(json.success){
                                Ext.Msg.alert('提示', json.msg);
                                grid.getStore().reload();
                                grid.getSelectionModel().deselectAll();
                            }else{
                                Ext.Msg.alert('提示', json.msg);
                            }
                        }
                    });
                }
            }
        }];
        grid.tbar = tbar;
        this.callParent(arguments);
    },
    constructor: function(config){
        this.initConfig(config);
        this.callParent(arguments);
    }
});