Ext.define('svnPatchMaker.svnAccountAddUpWin', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    config: {
        width: 375,
        height: 200
    },
    initComponent: function(){
        this.callParent(arguments);
        var win = this;
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 25,
            width: 350,
            url: '/add_or_up_user',
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 50
            },
            defaultType: 'textfield',
            items: [{
                xtype: 'hidden',
                name: 'id'
            },{
                fieldLabel: '用户名',
                id: 'username',
                name: 'username',
                allowBlank: false
            },{
                fieldLabel: '密码',
                name: 'password',
                allowBlank: false
            }],
            buttons: [{
                text: '保存',
                handler: function(){
                    if(form.isValid()){
                        form.submit({
                            success: function(form, action){
                                Ext.Msg.alert('成功', action.result.msg);
                                win.fireEvent('reloadGrid');
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('失败', action.result.msg);
                            }
                        });
                    }
                }
            },{
                text: '关闭',
                handler: function(){
                    win.close();
                }
            }]
        });
        win.add(form);
        win.form = form;
    },
    constructor: function(config){
        this.initConfig(config);
        this.callParent(arguments);
    }
});