Ext.define('svnPatchMaker.svnProjectGrid', {
	extend: 'Ext.grid.Panel',
	config: {
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},
		store: Ext.data.StoreManager.lookup('svnProjectStore'),
		columns: [
            { dataIndex: 'id', hidden: true },
			{ text: '项目名',  dataIndex: 'projectname', flex: 0.1 },
			{ text: 'Svn地址', dataIndex: 'svnurl', flex: 0.30 },
			{ text: 'SvnPath映射', dataIndex: 'svnpath', flex: 0.20 },
			{
                text: 'ClassPath映射',
                dataIndex: 'workpath',
                flex: 0.20,
                renderer: function (v, meta, r) {
                    return "<div style='white-space:normal;word-wrap:break-word;word-break:break-all;'>" + v + "</div>";
                }
            },
			{ text: '打包目录', dataIndex: 'savepath', flex: 0.20 }
		]
    },
    initComponent: function(){
        var grid = this;
        var tbar = [{
            text: '增加',
            iconCls: 'Bookadd',
            handler: function(){
                var win = new svnPatchMaker.svnProjectAddUpWin({
                    title: '新增'
                });
                win.on('reloadGrid', function(){
                    grid.getStore().reload();
                    grid.getSelectionModel().deselectAll();
                    win.close();
                });
                win.show();
                Ext.getCmp('projectname').focus(false, 300);
                Ext.getCmp('projectname').selectText();
            }
        },{
            text: '修改',
            iconCls: 'Bookedit',
            handler: function(){
                var records = grid.getSelectionModel().getSelection();
				var record = records[0];
                if(record){
                    var win = new svnPatchMaker.svnProjectAddUpWin({
                        title: '编辑'
                    });
                    win.on('reloadGrid', function(){
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                        win.close();
                    });
                    win.show();
                    win.form.getForm().loadRecord(record);
                    Ext.getCmp('projectname').focus(false, 300);
                    Ext.getCmp('projectname').selectText();
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
                        url: 'del_project',
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