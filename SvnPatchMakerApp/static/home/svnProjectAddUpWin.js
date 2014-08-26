Ext.define('svnPatchMaker.svnProjectAddUpWin', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    config: {
        width: 475,
        height: 270
    },
    initComponent: function(){
        this.callParent(arguments);
        var win = this;
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            width: 450,
            url: '/add_or_up_project',
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 90
            },
            defaultType: 'textfield',
            items: [{
                xtype: 'hidden',
                name: 'id'
            },{
                fieldLabel: '项目名',
                id: 'projectname',
                name: 'projectname',
                allowBlank: false
            },{
                fieldLabel: 'Svn地址',
                name: 'svnurl',
                allowBlank: false
            },{
                fieldLabel: 'SvnPath映射',
                name: 'svnpath',
                allowBlank: false
            },{
                fieldLabel: 'ClassPath映射',
                name: 'workpath',
                allowBlank: false
            },{
                fieldLabel: '打包目录',
                name: 'savepath',
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