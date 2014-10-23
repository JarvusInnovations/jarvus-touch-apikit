/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true */
/* global Ext */
Ext.define('Jarvus.touch.proxy.API', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.api',
    requires: [
        'Jarvus.touch.util.API'
    ],

    config: {
        /**
         * @cfg The {Ext.data.Connection} instance that will process requests
         * @required
         */
        connection: 'Jarvus.touch.util.API'
    },
    
    applyConnection: function(connection) {
        if (typeof connection == 'string') {
            Ext.syncRequire(connection);
            connection = Ext.ClassManager.get(connection);
        }
        
        return connection;
    },

    /**
     * @inheritdoc
     * Overridden to replace Ext.Ajax with me.getConnection() and to set me.lastRequest
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation);

        request.setConfig({
            headers: me.getHeaders(),
            timeout: me.getTimeout(),
            method: me.getMethod(request),
            callback: me.createRequestCallback(request, operation, callback, scope),
            scope: me,
            proxy: me,
            useDefaultXhrHeader: me.getUseDefaultXhrHeader()
        });

        if (operation.getWithCredentials() || me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }

        // We now always have the writer prepare the request
        me.lastRequest = request = writer.write(request);

        me.getConnection().request(request.getCurrentConfig());

        return request;
    }
});