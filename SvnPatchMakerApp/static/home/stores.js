Ext.create('Ext.data.Store', {
	storeId:'svnProjectStore',
	fields:['id', 'projectname', 'svnurl', 'svnpath', 'workpath', 'savepath'],
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: '/svnprojects',
		timeout: 30000,
		reader: {
			type: 'json',
			root: 'rows'
		}
	}
});

Ext.create('Ext.data.Store', {
	storeId:'svnConverterStore',
	fields:['id', 'project', 'key', 'value'],
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: '/svnconverters',
		timeout: 30000,
		reader: {
			type: 'json',
			root: 'rows'
		}
	}
});

Ext.create('Ext.data.Store', {
	storeId:'svnAccountStore',
	fields:['id', 'username', 'password'],
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: '/svnaccounts',
		timeout: 30000,
		reader: {
			type: 'json',
			root: 'rows'
		}
	}
});

Ext.create('Ext.data.Store', {
    storeId:'svnLogStore',
    fields:['author', 'date', 'message', 'vnum', 'logfiles'],
    proxy: {
        type: 'ajax',
        url: '/svnlogdatas',
        timeout: 30000,
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'searchfilesdatas',
    fields:['filename', 'op'],
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'choosefilesdatas',
    fields:['filename', 'op'],
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'setpackdata',
    fields:['filename'],
    autoLoad: true,
    proxy: {
        type: 'memory',
        data: [],
        reader: {
            type: 'json',
            root: 'setPack'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'setdeldata',
    fields:['filename'],
    autoLoad: true,
    proxy: {
        type: 'memory',
        data: [],
        reader: {
            type: 'json',
            root: 'setDel'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'resultstore',
    fields:['filename'],
    autoLoad: true,
    proxy: {
        type: 'memory',
        data: [],
        reader: {
            type: 'json',
            root: 'resultfiles'
        }
    }
});

Ext.create('Ext.data.Store', {
    storeId:'savestore',
    fields:['filename'],
    autoLoad: true,
    proxy: {
        type: 'memory',
        data: [],
        reader: {
            type: 'json',
            root: 'savefiles'
        }
    }
});
