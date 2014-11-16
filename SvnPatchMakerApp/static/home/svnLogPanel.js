Ext.define('svnPatchMaker.svnLogPanel', {
    extend: 'Ext.panel.Panel',
    title: 'Svn日志',
    layout: 'border',
    initComponent: function(){
        var svnLogPanel = this;
        this.callParent(arguments);
        var leftpanel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            region: 'west',
            width: 220
        });
        var svnUserGrid = Ext.create('Ext.grid.Panel', {
            title: '用户',
            width: 110,
            id: 'svnUserGrid',
            region: 'west',
            store: Ext.data.StoreManager.lookup('svnAccountStore'),
            columns: [
                { dataIndex: 'id', hidden: true },
                { text: '用户名', dataIndex: 'username' }
            ],
            tbar: [{
                text: '刷新',
                iconCls: 'Rainbow',
                handler: function(){
                    svnUserGrid.getStore().reload();
                }
            }]
        });

        svnUserGrid.getStore().on('load', function(store){
            var userId = Ext.util.Cookies.get('user');
            if(userId){
                var user = store.findRecord('id', userId);
                if(user){
                    svnUserGrid.getSelectionModel().select(user);
                }
            }
        });

        svnUserGrid.getSelectionModel().on('select', function(rm, record, index, eOpts){
            var d = new Date();
            d.setTime(d.getTime() + (3600*24*60*60*1000));
            Ext.util.Cookies.set('user', record.get('id'), d);
        });

        var svnProjectGrid = Ext.create('Ext.grid.Panel', {
            title: '项目',
            region: 'center',
            id: 'svnProjectGrid',
            store: Ext.data.StoreManager.lookup('svnProjectStore'),
            columns: [
                { dataIndex: 'id', hidden: true },
                { text: '项目名', dataIndex: 'projectname' }
            ],
            tbar: [{
                text: '刷新',
                iconCls: 'Rainbow',
                handler: function(){
                    svnProjectGrid.getStore().reload();
                }
            }]
        });

        svnProjectGrid.getStore().on('load', function(store){
            var projectId = Ext.util.Cookies.get('project');
            if(projectId){
                var project = store.findRecord('id', projectId);
                if(project){
                    svnProjectGrid.getSelectionModel().select(project);
                }
            }
        });

        svnProjectGrid.getSelectionModel().on('select', function(rm, record, index, eOpts){
            var d = new Date();
            d.setTime(d.getTime() + (3600*24*60*60*1000));
            Ext.util.Cookies.set('project', record.get('id'), d);
        });

        leftpanel.add(svnUserGrid);
        leftpanel.add(svnProjectGrid);
        svnLogPanel.add(leftpanel);

        var rightpanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'anchor',
            autoScroll: true
        });

        svnLogPanel.add(rightpanel);

        /* svn log grid begin */
        var today = new Date();
        var svnLogGrid = Ext.create('Ext.grid.Panel', {
            title: '提交记录[双击记录有惊喜]',
            store: Ext.data.StoreManager.lookup('svnLogStore'),
            multiSelect: false,
            viewConfig: {
                stripeRows: true
            },
            columns: [
                { text: '作者',  dataIndex: 'author', width: 120 },
                { text: '日期', dataIndex: 'date', width: 150 },
                { text: '版本', dataIndex: 'vnum', width: 50 },
                {
                    text: '提交内容',
                    dataIndex: 'message',
                    flex: 1,
                    renderer: function (v, meta, r) {
                        return "<div style='white-space:normal;word-wrap:break-word;word-break:break-all;'>" + v + "</div>";
                    }
                },
                { text: '变动文件', dataIndex: 'logfiles', hidden: true }
            ],
            height: 260,
            tbar: [{
                xtype: 'datefield',
                id: 'begintime',
                anchor: '100%',
                labelWidth: 60,
                fieldLabel: '开始时间',
                name: 'begin_date',
                maxValue: today,
                format: 'Y-m-d 00:00:00',
                value: today
            },{
                xtype: 'label',
                html: '结束时间:' + '【最新提交的版本】'
            },{
                text: '查询',
                id: 'searchBtn',
                iconCls: 'Bookgo',
                handler: function(){
                    searchFileGrid.getStore().removeAll();
                    chooseFileGrid.getStore().removeAll();
                    var projectRecords = svnProjectGrid.getSelectionModel().getSelection();
                    var projectRecord = projectRecords[0];
                    var userRecords = svnUserGrid.getSelectionModel().getSelection();
                    var userRecord = userRecords[0];
                    if(projectRecord && userRecord){
                        svnLogGrid.getStore().load({
                            params: {
                                'begintime': Ext.getCmp('begintime').getRawValue(),
                                'project': projectRecord.get('id'),
                                'user': userRecord.get('id')
                            }
                        });
                    }else{
                        Ext.Msg.alert('提示', '请选择一个用户和一条项目记录');
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: '按作者过滤',
                labelWidth: 80,
                id: 'searchUser',
                enableKeyEvents: true,
                listeners: {
                    keypress: function(field, e, eOpts){
                        var projectRecords = svnProjectGrid.getSelectionModel().getSelection();
                        var projectRecord = projectRecords[0];
                        var userRecords = svnUserGrid.getSelectionModel().getSelection();
                        var userRecord = userRecords[0];
                        if(projectRecord && userRecord){
                            if(e.getKey() == Ext.EventObject.ENTER){
                                svnLogGrid.getStore().clearFilter();
                                if(Ext.getCmp('searchUser').getRawValue()){
                                    svnLogGrid.getStore().filter("author", Ext.getCmp('searchUser').getRawValue());
                                }
                            }
                        }
                    },
                    blur: function(){
                        var projectRecords = svnProjectGrid.getSelectionModel().getSelection();
                        var projectRecord = projectRecords[0];
                        var userRecords = svnUserGrid.getSelectionModel().getSelection();
                        var userRecord = userRecords[0];
                        if(projectRecord && userRecord){
                            if(!Ext.getCmp('searchUser').getRawValue()){
                                svnLogGrid.getStore().clearFilter();
                            }
                        }
                    }
                }
            }, {
                text: '过滤',
                id: 'searchUserBtn',
                iconCls: 'Bookmagnify',
                handler: function(){
                    var projectRecords = svnProjectGrid.getSelectionModel().getSelection();
                    var projectRecord = projectRecords[0];
                    var userRecords = svnUserGrid.getSelectionModel().getSelection();
                    var userRecord = userRecords[0];
                    if(projectRecord && userRecord){
                        if(Ext.getCmp('searchUser').getRawValue()){
                            svnLogGrid.getStore().clearFilter();
                            svnLogGrid.getStore().filter("author", Ext.getCmp('searchUser').getRawValue());
                        }
                    }
                }
            }, {
                xtype: 'label',
                html: '版本顺序: 从某个时间点到当前最新版本'
            }]
        });
        rightpanel.add(svnLogGrid);
        /* svn log grid end*/

        var filespanel = Ext.create('Ext.panel.Panel', {
            height: 400,
            border: false,
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        });

        /* search files grid begin */
        var searchFileGrid = Ext.create('Ext.grid.Panel', {
            title: '提交文件',
            border: false,
            flex: 1,
            store: Ext.data.StoreManager.lookup('searchfilesdatas'),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            selModel: {
                selType:'checkboxmodel'
            },
            columns: [
                {
                    text: '文件路径',
                    dataIndex: 'filename',
                    flex: 1,
                    renderer: function (v, meta, r) {
                        return "<div style='white-space:normal;word-wrap:break-word;word-break:break-all;'>" + v + "</div>";
                    }
                },
                {
                    text: '操作',
                    dataIndex: 'op',
                    width: 50,
                    renderer: function(v, meta, record, rowIndex){
                        if(v == 'M'){
                            return '<font color="blue">修改</font>'
                        }else if(v == "A"){
                            return '<font color="green">添加</font>'
                        }else if(v == "D"){
                            return '<font color="red">删除</font>'
                        }
                    }
                }
            ],
            tbar: ['->', {
                text: '打包去',
                iconCls: 'Cartadd',
                handler: function(){
                    var records = searchFileGrid.getSelectionModel().getSelection();
                    chooseFileGrid.getStore().loadData(records, true);
                }
            }]
        });
        /* search files grid end */

        /* choose files grid begin */
        var chooseFileGrid = Ext.create('Ext.grid.Panel', {
            title: '打包文件',
            border: false,
            flex: 1,
            store: Ext.data.StoreManager.lookup('choosefilesdatas'),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            selModel: {
                selType:'checkboxmodel'
            },
            columns: [
                {
                    text: '文件路径',
                    dataIndex: 'filename',
                    flex: 1,
                    renderer: function (v, meta, r) {
                        return "<div style='white-space:normal;word-wrap:break-word;word-break:break-all;'>" + v + "</div>";
                    }
                },
                {
                    text: '操作',
                    dataIndex: 'op',
                    width: 50,
                    renderer: function(v, meta, record, rowIndex){
                        if(v == 'M'){
                            return '<font color="blue">修改</font>'
                        }else if(v == "A"){
                            return '<font color="green">添加</font>'
                        }else if(v == "D"){
                            return '<font color="red">删除</font>'
                        }
                    }
                }
            ],
            tbar: [{
                text: '不打了',
                iconCls: 'Cartedit',
                handler: function(){
                    var records = chooseFileGrid.getSelectionModel().getSelection();
                    if(records.length > 0){
                        for(var i=0; i<records.length; i++){
                            chooseFileGrid.getStore().remove(records[i]);
                        }
                    }
                }
            },{
                text: '清空',
                iconCls: 'Cartdelete',
                handler: function(){
                    chooseFileGrid.getStore().removeAll();
                }
            },{
                text: '打包选中的文件',
                iconCls: 'Cartgo',
                handler: function(){
                    var records = chooseFileGrid.getSelectionModel().getSelection();
                    if(records.length > 0){
                        var myMask = new Ext.LoadMask(Ext.getBody(), {
                            msg: '正在处理，请稍后...',
                            removeMask: true
                        });
                        myMask.show();
                        var params = {};
                        var listPack = [];
                        var listDel = [];
                        for(var i=0; i<records.length; i++){
                            var record = records[i];
                            if(record.get('op') == 'D'){
                                listDel.push(record.get('filename'));
                            }else{
                                listPack.push(record.get('filename'));
                            }
                        }
                        params.listPack = listPack;
                        params.listDel = listDel;
                        Ext.Ajax.request({
                            url: '/checkfiles',
                            params: params,
                            success: function(resp){
                                myMask.hide();
                                var respText = resp.responseText;
                                var json = Ext.decode(respText);
                                // console.log(json);
                                var setPackStore = Ext.data.StoreManager.lookup('setpackdata');
                                var setDelStore = Ext.data.StoreManager.lookup('setdeldata');
                                setPackStore.loadRawData(json);
                                setDelStore.loadRawData(json);
                                var projectRecords = svnProjectGrid.getSelectionModel().getSelection();
                                var projectRecord = projectRecords[0];
                                var checkWin = new svnPatchMaker.packGridWin();
                                checkWin.show();
                                checkWin.projectRecord = projectRecord;
                            }
                        });
                    }
                }
            }]
        });
        /* choose files grid end */

        filespanel.add(searchFileGrid);
        filespanel.add(chooseFileGrid);

        svnLogGrid.getSelectionModel().on('select', function(rm, record, index, eOpts){
            searchFileGrid.getStore().loadData(record.get("logfiles"));
            searchFileGrid.getSelectionModel().selectAll();
        });

        svnLogGrid.on('itemdblclick', function(){
            var records = searchFileGrid.getSelectionModel().getSelection();
            chooseFileGrid.getStore().loadData(records, true);
        });

        rightpanel.add(filespanel);
    },
    constructor: function(config){
        this.initConfig(config);
        this.callParent();
    }
});