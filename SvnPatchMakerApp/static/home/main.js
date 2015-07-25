Ext.onReady(function(){

    var mainTab = Ext.create('Ext.tab.Panel', {
        title: 'SvnPatchMakerApp',
        margin: '10 10 10 10'
    });

    var configPanel = Ext.create('Ext.panel.Panel', {
        title: '配置',
        layout: 'border'
    });

    var projectPanel = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'anchor',
        autoScroll: true
    });

    var svnProjectGrid = new svnPatchMaker.svnProjectGrid({
        title: 'Svn项目',
        height: 220
    });

    var svnConverterGrid = new svnPatchMaker.svnConverterGrid({
        title: 'Url转换【项目名后映射】'
    });

    svnProjectGrid.on('select', function(grid, record){
        svnConverterGrid.getStore().removeAll();
    });

    svnProjectGrid.on('itemclick', function(view, record){
        svnConverterGrid.getStore().load({
            params: {
                'project': record.get('id')
            }
        });
    });

    svnProjectGrid.getStore().on('load', function(){
        svnConverterGrid.getStore().removeAll();
    });

    svnProjectGrid.svnConverterGrid = svnConverterGrid;
    svnConverterGrid.svnProjectGrid = svnProjectGrid;

    projectPanel.add(svnProjectGrid);
    projectPanel.add(svnConverterGrid);

    var svnAccountGrid = new svnPatchMaker.svnAccountGrid({
        title: 'Svn用户',
        width: 220,
        region: 'west'
    });

    configPanel.add(projectPanel);
    configPanel.add(svnAccountGrid);

    var svnLogPanel = new svnPatchMaker.svnLogPanel({});

    mainTab.add(svnLogPanel);
    mainTab.add(configPanel);

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [mainTab]
    });
});
