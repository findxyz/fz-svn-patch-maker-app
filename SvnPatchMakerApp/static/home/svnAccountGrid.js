Ext.define('svnPatchMaker.svnAccountGrid', {
	extend: 'Ext.grid.Panel',
	config: {
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},
		store: Ext.data.StoreManager.lookup('svnAccountStore'),
		columns: [
            { dataIndex: 'id', hidden: true },
            { text: '用户名',  dataIndex: 'username', flex: 0.5 },
            { text: '密码', dataIndex: 'password', flex: 0.5 }
		]
	},
    initComponent: function(){
        var grid = this;
        var tbar = [{
			text: '增加',
			iconCls: 'Bookadd',
			handler: function(){
				var win = new svnPatchMaker.svnAccountAddUpWin({
                    title: '新增'
                });
                win.on('reloadGrid', function(){
                    grid.getStore().reload();
                    win.close();
                });
                win.show();
                Ext.getCmp('username').focus(false, 300);
                Ext.getCmp('username').selectText();
			}
		},{
			text: '修改',
			iconCls: 'Bookedit',
			handler: function(){
                var records = grid.getSelectionModel().getSelection();
				var record = records[0];
                if(record){
                    var win = new svnPatchMaker.svnAccountAddUpWin({
                        title: '编辑'
                    });
                    win.on('reloadGrid', function(){
                        grid.getStore().reload();
                        win.close();
                    });
                    win.show();
                    win.form.getForm().loadRecord(record);
                    Ext.getCmp('username').focus(false, 300);
                    Ext.getCmp('username').selectText();
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
                        url: 'del_user',
                        params: {
                            id: record.get('id')
                        },
                        success: function(resp){
                            var json = Ext.decode(resp.responseText);
                            if(json.success){
                                Ext.Msg.alert('提示', json.msg);
                                grid.getStore().reload();
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